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

interface StormCSSOptions {
  config?: string;
  minify?: boolean;
}

interface StormCSSConfig {
  extract?: {
    include?: string[];
    exclude?: string[];
  };
  preflight?: boolean;
}

// ─── Processor cache ──────────────────────────────────────────────────────────

let _processor: Processor | null = null;
let _lastConfigMtime = 0;
let _resolvedConfigFile: string | undefined;

/**
 * Returns a Processor, rebuilding it only when the config file is modified.
 * Safe for PostCSS watch mode — avoids unnecessary re-instantiation.
 */
function getProcessor(configFile?: string): Processor {
  if (configFile && existsSync(configFile)) {
    const mtime = statSync(configFile).mtimeMs;
    const isSameFile = configFile === _resolvedConfigFile;
    const isUnchanged = mtime === _lastConfigMtime;

    if (_processor === null || !isSameFile || !isUnchanged) {
      const resolved = _require.resolve(configFile);
      // Bust require cache so watch mode always picks up config edits
      delete _require.cache[resolved];
      _processor = new Processor(_require(resolved));
      _lastConfigMtime = mtime;
      _resolvedConfigFile = configFile;
    }
  } else if (_processor === null) {
    // No config file provided — create a plain default Processor once
    _processor = new Processor();
  }

  return _processor;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default function stormcssPlugin(options: StormCSSOptions = {}): Plugin {
  const configFile = options.config ? resolve(options.config) : undefined;

  return {
    postcssPlugin: 'stormcss',

    async AtRule(atRule: AtRule, { result }) {
      if (atRule.name !== 'stormcss') return;

      const processor = getProcessor(configFile);
      const config = processor.allConfig as StormCSSConfig;

      // ── Register config file as a PostCSS/webpack dependency ──────────────
      // Done here (not in Once) so _resolvedConfigFile is guaranteed to be set
      if (_resolvedConfigFile) {
        result.messages.push({
          type: 'dependency',
          plugin: 'stormcss',
          file: path.normalize(_resolvedConfigFile),
          parent: result.opts.from,
        });
      }

      // ── Resolve file list ──────────────────────────────────────────────────
      const patterns = config.extract?.include ?? ['src/**/*.{js,ts,jsx,tsx}'];
      const exclude  = config.extract?.exclude ?? ['node_modules', '.git', '.next'];

      const files = globArray(
        [...patterns, ...exclude.map((i) => `!${i}`)]
      )
        .map((f) => resolve(f))   // normalise to absolute paths
        .filter(existsSync);      // single filter pass — no redundant checks

      console.log(
        `[stormcss] ${new Date().toLocaleTimeString()} — scanning ${files.length} file(s)`
      );

      // ── Register files + parent dirs as HMR dependencies ──────────────────
      const watchedDirs = new Set<string>();

      for (const file of files) {
        result.messages.push({
          type: 'dependency',
          plugin: 'stormcss',
          file: path.normalize(file),
          parent: result.opts.from,
        });
        watchedDirs.add(dirname(file));
      }

      // Watching directories lets PostCSS/webpack detect newly created files
      for (const dir of watchedDirs) {
        result.messages.push({
          type: 'context-dependency',
          plugin: 'stormcss',
          file: path.normalize(dir),
          parent: result.opts.from,
        });
      }

      // ── Parse files in parallel ────────────────────────────────────────────
      const styleSheet = new StyleSheet();

      const settled = await Promise.allSettled(
        files.map(async (file) => {
          const content = await fsPromises.readFile(file, 'utf8');
          const classes  = new HTMLParser(content)
            .parseClasses()
            .map((i: { result: string }) => i.result);

          return {
            content,
            utilityStyleSheet: processor.interpret(classes.join(' ')).styleSheet,
          };
        })
      );

      for (let i = 0; i < settled.length; i++) {
        const item = settled[i];

        if (item.status === 'rejected') {
          // Warn and continue — one bad file must never abort the whole build
          console.warn(`[stormcss] Skipping "${files[i]}":`, item.reason);
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

      // replaceWith requires a PostCSS node tree, not a raw string
      atRule.replaceWith(postcss.parse(css) as Root);
    },
  };
}

stormcssPlugin.postcss = true;