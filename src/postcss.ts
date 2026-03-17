import path, { resolve, dirname } from 'path';
import { existsSync, statSync, promises as fsPromises } from 'fs';
import { createRequire } from 'module';
import type { Plugin, AtRule, Root } from 'postcss';
import postcss from 'postcss';
import { Processor } from './lib';
import { StyleSheet } from './utils/style';
import { HTMLParser } from './utils/parser';
import { globArray } from './cli/utils';

// ESM-safe require (handles config files that are CJS modules)
const _require = createRequire(import.meta.url);

// ─── Types ────────────────────────────────────────────────────────────────────

interface cloudCSSOptions {
  config?: string;
  minify?: boolean;
}

interface cloudCSSConfig {
  extract?: {
    include?: string[];
    exclude?: string[];
  };
  preflight?: boolean;
}

interface FileCacheEntry {
  mtime: number;
  content: string;
  utilityStyleSheet: any; // Replace 'any' with the actual type returned by processor.interpret()
}

// ─── State & Caching ──────────────────────────────────────────────────────────

let _processor: Processor | null = null;
let _lastConfigMtime = 0;
let _resolvedConfigFile: string | undefined;

// Cache to prevent re-reading/re-parsing unchanged files during HMR
const _fileCache = new Map<string, FileCacheEntry>();

function getProcessor(configFile?: string): Processor {
  if (configFile && existsSync(configFile)) {
    const mtime = statSync(configFile).mtimeMs;
    const isSameFile = configFile === _resolvedConfigFile;
    const isUnchanged = mtime === _lastConfigMtime;

    if (_processor === null || !isSameFile || !isUnchanged) {
      const resolved = _require.resolve(configFile);
      delete _require.cache[resolved];
      
      try {
        const config = _require(resolved);
        _processor = new Processor(config);
      } catch (e) {
        console.error('[cloudcss] Error loading configuration:', e);
        throw e;
      }
      
      _lastConfigMtime = mtime;
      _resolvedConfigFile = configFile;
    }
  } else if (_processor === null) {
    _processor = new Processor();
  }

  return _processor;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default function cloudcssPlugin(options: cloudCSSOptions = {}): Plugin {
  const configFile = options.config ? resolve(options.config) : undefined;

  return {
    postcssPlugin: 'cloudcss',

    async AtRule(atRule: AtRule, { result }) {
      if (atRule.name !== 'cloudcss') return;

      const processor = getProcessor(configFile);
      const config = processor.allConfig as cloudCSSConfig;
      const parent = result.opts.from;

      // Helper to safely register dependencies and bypass Turbopack's bridge bugs
      const registerDependency = (msg: Record<string, any>) => {
        // Only append parent if it is strictly defined
        if (parent) msg.parent = parent;
        result.messages.push(msg as any);
      };

      // ── Register config file as a dependency ──────────────────────────────
      if (_resolvedConfigFile) {
        registerDependency({
          type: 'dependency',
          plugin: 'cloudcss',
          file: path.normalize(_resolvedConfigFile),
        });
      }

      // ── Resolve file list ──────────────────────────────────────────────────
      const patterns = config.extract?.include ?? ['src/**/*.{js,ts,jsx,tsx}'];
      const exclude  = config.extract?.exclude ?? ['node_modules', '.git', '.next'];
      const cwd = configFile ? dirname(configFile) : process.cwd();

      const files = globArray(
        [...patterns, ...exclude.map((i) => `!${i}`)],
        { cwd }
      )
        .map((f) => resolve(f))
        .filter(existsSync);

      // ── Register files + directories as HMR dependencies ──────────────────
      const watchedDirs = new Set<string>();

      for (const file of files) {
        registerDependency({
          type: 'dependency',
          plugin: 'cloudcss',
          file: path.normalize(file),
        });
        watchedDirs.add(dirname(file));
      }

      for (const dir of watchedDirs) {
        registerDependency({
          type: 'dir-dependency',
          plugin: 'cloudcss',
          dir: path.normalize(dir),  // Standard PostCSS expectation
          file: path.normalize(dir), // 🚨 THE FIX: Satisfies Turbopack's generic buggy bridge
          glob: '**/*',              // Safe fallback for other bundlers
        });
      }

      // ── Parse files in parallel (with caching) ───────────────────────────
      const styleSheet = new StyleSheet();

      const settled = await Promise.allSettled(
        files.map(async (file) => {
          const stats = await fsPromises.stat(file);
          const mtime = stats.mtimeMs;
          const cached = _fileCache.get(file);

          if (cached && cached.mtime === mtime) {
            return cached;
          }

          const content = await fsPromises.readFile(file, 'utf8');
          const classes  = new HTMLParser(content)
            .parseClasses()
            .map((i: { result: string }) => i.result);

          const utilityStyleSheet = processor.interpret(classes.join(' ')).styleSheet;
          
          const cacheEntry: FileCacheEntry = { mtime, content, utilityStyleSheet };
          _fileCache.set(file, cacheEntry);
          
          return cacheEntry;
        })
      );

      // Cache cleanup: Remove files that no longer exist
      const currentFilesSet = new Set(files);
      for (const cachedFilePath of _fileCache.keys()) {
        if (!currentFilesSet.has(cachedFilePath)) {
          _fileCache.delete(cachedFilePath);
        }
      }

      // ── Compile Styles ─────────────────────────────────────────────────────
      for (let i = 0; i < settled.length; i++) {
        const item = settled[i];

        if (item.status === 'rejected') {
          console.warn(`[cloudcss] Warning: Skipping "${files[i]}" due to error:`, item.reason);
          continue;
        }

        const { content, utilityStyleSheet } = item.value;
        styleSheet.extend(utilityStyleSheet);

        if (config.preflight) {
          styleSheet.extend(processor.preflight(content));
        }
      }

      // ── Emit ───────────────────────────────────────────────────────────────
      const css = styleSheet.sort().combine().build(options.minify);
      atRule.replaceWith(postcss.parse(css) as Root);
    },
  };
}

cloudcssPlugin.postcss = true;