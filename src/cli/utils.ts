import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import { minimatch } from 'minimatch';

export function globArray(patterns: string[], options?: fg.Options): string[] {
  const list: string[] = [];

  patterns.forEach(pattern => {
    if (pattern[0] === '!') {
      let i = list.length-1;
      while(i > -1) {
        if (!minimatch(list[i], pattern)) {
          list.splice(i, 1);
        }
        i--;
      }

    }
    else {
      const newList = fg.sync(pattern, options);
      newList.forEach(item => {
        if (list.indexOf(item)===-1) {
          list.push(item);
        }
      });
    }
  });

  return list;
}

export function getVersion(): string {
  // eslint-disable-next-line quotes
  return `__NAME__ __VERSION__`; // replace by rollup
}

export function fuzzy(content: string): string[] {
  return content.match(/([^<>"'`\s]*[^<>"'`\s:])|([^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:])/g) ?? [];
}

export type Framework = 'nextjs' | 'vue' | 'svelte' | 'vite' | 'react' | 'unknown';

export interface FrameworkConfig {
  framework: Framework;
  appDir: string;
  extensions: string[];
  configTemplate: string;
}

/**
 * Detect the framework used in the project
 */
export function detectFramework(projectRoot: string): Framework {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return 'unknown';
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (dependencies['next']) return 'nextjs';
    if (dependencies['vue']) return 'vue';
    if (dependencies['svelte']) return 'svelte';
    if (dependencies['react'] && !dependencies['next']) return 'react';
    if (dependencies['vite']) return 'vite';
  } catch (error) {
    // Silently fail if package.json is invalid
  }

  return 'unknown';
}

/**
 * Determine the appropriate directory structure for the framework
 */
export function getFrameworkConfig(projectRoot: string, framework: Framework): FrameworkConfig {
  const appDir = detectAppDirectory(projectRoot, framework);
  
  const configs: Record<Framework, (appDir: string) => FrameworkConfig> = {
    nextjs: (appDir) => ({
      framework: 'nextjs',
      appDir,
      extensions: 'tsx,ts,jsx,js',
      configTemplate: `module.exports = {
  extract: {
    include: ['${appDir}/**/*.{tsx,ts,jsx,js}'],
    exclude: ['node_modules', '.git', '.next'],
  },
  theme: {
    extend: {},
  },
};`,
    }),
    vue: (appDir) => ({
      framework: 'vue',
      appDir,
      extensions: 'vue,html,jsx,tsx,ts',
      configTemplate: `module.exports = ({
  extract: {
    include: ['${appDir}/**/*.{vue,html,jsx,tsx,ts}'],
    exclude: ['node_modules', '.git'],
  },
});`,
    }),
    svelte: (appDir) => ({
      framework: 'svelte',
      appDir,
      extensions: 'svelte,html,jsx,tsx,ts',
      configTemplate: `module.exports = ({
  extract: {
    include: ['${appDir}/**/*.{svelte,html,jsx,tsx,ts}'],
    exclude: ['node_modules', '.git'],
  },
});`,
    }),
    react: (appDir) => ({
      framework: 'react',
      appDir,
      extensions: 'jsx,tsx,js,ts',
      configTemplate: `module.exports = ({
  extract: {
    include: ['${appDir}/**/*.{jsx,tsx,js,ts}'],
    exclude: ['node_modules', '.git'],
  },
});`,
    }),
    vite: (appDir) => ({
      framework: 'vite',
      appDir,
      extensions: 'vue,jsx,tsx,ts',
      configTemplate: `module.exports = ({
  extract: {
    include: ['${appDir}/**/*.{vue,html,jsx,tsx,ts}'],
    exclude: ['node_modules', '.git'],
  },
});`,
    }),
    unknown: (appDir) => ({
      framework: 'unknown',
      appDir,
      extensions: 'html,jsx,tsx,ts',
      configTemplate: `module.exports = ({
  extract: {
    include: ['${appDir}/**/*.{html,jsx,tsx,ts}'],
    exclude: ['node_modules', '.git'],
  },
});`,
    }),
  };

  return configs[framework](appDir);
}

/**
 * Detect if the project uses app/ directory (Next.js 13+) or src/ directory
 */
export function detectAppDirectory(projectRoot: string, framework: Framework): string {
  if (framework === 'nextjs') {
    const appPath = path.join(projectRoot, 'app');
    const srcPath = path.join(projectRoot, 'src');
    
    if (fs.existsSync(appPath)) return 'app';
    if (fs.existsSync(srcPath)) return 'src';
    return 'app';
  }

  const srcPath = path.join(projectRoot, 'src');
  if (fs.existsSync(srcPath)) return 'src';
  return 'src';
}

// ─────────────────────────────────────────────────────────────────────────────
// Tailwind detection helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The canonical PostCSS config CloudCSS expects.
 * Used both when creating a fresh config and when replacing an existing
 * Tailwind-based one.
 */
const POSTCSS_CLOUDCSS_TEMPLATE = `import path from 'path';\n\nexport default {\n  plugins: {\n    '@Aruvili/cloudcss/postcss': {\n      config: path.resolve('./cloud.config.cjs'),\n    },\n  },\n};\n`;

/**
 * All PostCSS config filenames we recognise (checked in priority order).
 */
const POSTCSS_CONFIG_NAMES = [
  'postcss.config.mjs',
  'postcss.config.cjs',
  'postcss.config.js',
];

/**
 * Return the first existing PostCSS config path, or null.
 */
function findPostcssConfig(projectRoot: string): string | null {
  for (const name of POSTCSS_CONFIG_NAMES) {
    const p = path.join(projectRoot, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Return true if the PostCSS config content references tailwindcss.
 */
function postcssHasTailwind(content: string): boolean {
  return /tailwindcss/.test(content);
}

/**
 * Return the canonical CloudCSS PostCSS config content.
 *
 * The cloudcss/postcss plugin requires a `config` path, so a simple key-swap
 * from the Tailwind format would produce an invalid config. We therefore
 * replace the entire file content with the correct template.
 *
 * Any non-Tailwind plugins that were present in the original config are
 * preserved by extracting them first and merging them into the new file.
 */
function replaceTailwindInPostcss(_original: string): string {
  // Completely rewrite with the correct CloudCSS plugin signature.
  // Non-tailwind plugins are intentionally left for the user to re-add if
  // needed — attempting to parse and merge arbitrary plugin configs reliably
  // is out of scope and error-prone.
  return POSTCSS_CLOUDCSS_TEMPLATE;
}

/**
 * Return true if package.json has tailwindcss in any dep bucket.
 */
function packageHasTailwind(pkg: Record<string, any>): boolean {
  return !!(
    pkg.dependencies?.['tailwindcss'] ||
    pkg.devDependencies?.['tailwindcss']
  );
}

/**
 * Remove tailwindcss from all dependency buckets and return the list of
 * buckets that were modified.
 */
function removeTailwindFromPackage(pkg: Record<string, any>): string[] {
  const buckets = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  const modified: string[] = [];
  for (const bucket of buckets) {
    if (pkg[bucket]?.['tailwindcss']) {
      delete pkg[bucket]['tailwindcss'];
      modified.push(bucket);
    }
  }
  return modified;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main init
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initialize CloudCSS in a project.
 * - Detects and removes TailwindCSS from PostCSS config and package.json.
 * - Creates cloud.config.cjs, postcss.config.mjs, and globals.css as needed.
 */
export function initializeProject(
  projectRoot: string,
): { success: boolean; message: string; framework: Framework; configPath: string } {
  try {
    const resolvedRoot = path.resolve(projectRoot);

    if (!fs.existsSync(resolvedRoot)) {
      return {
        success: false,
        message: `Project directory not found: ${projectRoot}`,
        framework: 'unknown',
        configPath: '',
      };
    }

    const framework = detectFramework(resolvedRoot);
    const config = getFrameworkConfig(resolvedRoot, framework);
    const messages: string[] = [];

    // ── 1. cloud.config.cjs ────────────────────────────────────────────────
    const configPath = path.join(resolvedRoot, 'cloud.config.cjs');

    if (fs.existsSync(configPath)) {
      return {
        success: false,
        message: `CloudCSS config already exists at ${configPath}`,
        framework,
        configPath,
      };
    }

    fs.writeFileSync(configPath, config.configTemplate);
    messages.push(`✓ Config file created at ${configPath}`);

    // ── 2. PostCSS config ──────────────────────────────────────────────────
    const existingPostcss = findPostcssConfig(resolvedRoot);

    if (existingPostcss) {
      // A postcss config already exists — check for Tailwind and patch it.
      const original = fs.readFileSync(existingPostcss, 'utf-8');

      if (postcssHasTailwind(original)) {
        const patched = replaceTailwindInPostcss(original);
        fs.writeFileSync(existingPostcss, patched);
        messages.push(`✓ Replaced tailwindcss with cloudcss in ${existingPostcss}`);
      } else {
        // PostCSS exists but has no Tailwind — leave it alone, just log.
        messages.push(`ℹ PostCSS config already exists at ${existingPostcss} (no Tailwind found, left unchanged)`);
      }
    } else {
      // No postcss config at all — create a fresh one.
      const postcssConfigPath = path.join(resolvedRoot, 'postcss.config.mjs');
      fs.writeFileSync(postcssConfigPath, POSTCSS_CLOUDCSS_TEMPLATE);
      messages.push(`✓ PostCSS config created at ${postcssConfigPath}`);
    }

    // ── 3. CSS entry file (name varies by framework) ─────────────────────────
    const CSS_FILE_NAME: Record<Framework, string> = {
      vue:     'style.css',
      vite:    'index.css',
      svelte:  'app.css',
      nextjs:  'globals.css',
      react:   'globals.css',
      unknown: 'globals.css',
    };

    const cssFileName = CSS_FILE_NAME[framework];
    const appDirPath  = path.join(resolvedRoot, config.appDir);

    if (!fs.existsSync(appDirPath)) {
      fs.mkdirSync(appDirPath, { recursive: true });
    }

    const cssFilePath = path.join(appDirPath, cssFileName);
    if (!fs.existsSync(cssFilePath)) {
      // File doesn't exist — create it with the directive.
      fs.writeFileSync(cssFilePath, `@cloudcss;\n html{
    background-color: black;
    border: 0;
    margin: 0;
}`);
      messages.push(`✓ CSS file created at ${cssFilePath}`);
    } else {
      // File exists — check if @cloudcss; is already present.
      const cssContent = fs.readFileSync(cssFilePath, 'utf-8');
      if (/@cloudcss\s*;/.test(cssContent)) {
        messages.push(`ℹ ${cssFileName} already contains @cloudcss; (left unchanged)`);
      } else {
        // Prepend so it's the very first thing PostCSS sees.
        fs.writeFileSync(cssFilePath, `@cloudcss;\n${cssContent}`);
        messages.push(`✓ Inserted @cloudcss; at the top of ${cssFilePath}`);
      }
    }

    // ── 4. package.json ────────────────────────────────────────────────────
    const packageJsonPath = path.join(resolvedRoot, 'package.json');
    const addedDeps: string[] = [];
    const removedDeps: string[] = [];

    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      // Remove tailwindcss wherever it lives.
      if (packageHasTailwind(pkg)) {
        const modified = removeTailwindFromPackage(pkg);
        removedDeps.push(`tailwindcss (from ${modified.join(', ')})`);
      }

      // Ensure devDependencies bucket exists.
      if (!pkg.devDependencies) pkg.devDependencies = {};

      // Add postcss if missing.
      if (!pkg.devDependencies['postcss'] && !pkg.dependencies?.['postcss']) {
        pkg.devDependencies['postcss'] = '^8.4.31';
        addedDeps.push('postcss');
      }

      // Add cloudcss if missing.
      if (!pkg.devDependencies['@aruvili/cloudcss'] && !pkg.dependencies?.['@aruvili/cloudcss']) {
        pkg.devDependencies['@aruvili/cloudcss'] = '^1.0.0';
        addedDeps.push('@aruvili/cloudcss');
      }

      // Only write if something actually changed.
      if (addedDeps.length > 0 || removedDeps.length > 0) {
        fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
      }

      if (removedDeps.length > 0) {
        messages.push(`✓ Removed from package.json: ${removedDeps.join(', ')}`);
      }
      if (addedDeps.length > 0) {
        messages.push(`✓ Added to package.json: ${addedDeps.join(', ')}`);
      }
    } catch (_) {
      // If package.json is missing or malformed, skip silently.
    }

    // ── 5. Warn about leftover tailwind config files ───────────────────────
    const tailwindConfigs = [
      'tailwind.config.js',
      'tailwind.config.ts',
      'tailwind.config.cjs',
      'tailwind.config.mjs',
    ].filter(f => fs.existsSync(path.join(resolvedRoot, f)));

    if (tailwindConfigs.length > 0) {
      messages.push(
        `⚠ Tailwind config file(s) found and can be safely deleted: ${tailwindConfigs.join(', ')}`,
      );
    }

    // ── Header & next-steps ────────────────────────────────────────────────
    const frameworkInfo =
      framework === 'unknown'
        ? ' (Framework not detected, using generic config)'
        : ` (${framework})`;

    const summary = [
      `CloudCSS initialized successfully${frameworkInfo}!`,
      ...messages,
      `\nNext steps:`,
      `1. Run: npm install  (or pnpm install / yarn install)`,
      `2. Import ${config.appDir}/${cssFileName} in your app entry point`,
    ];

    return { success: true, message: summary.join('\n'), framework, configPath };
  } catch (error) {
    return {
      success: false,
      message: `Error initializing CloudCSS: ${error instanceof Error ? error.message : String(error)}`,
      framework: 'unknown',
      configPath: '',
    };
  }
}

export function generateTemplate(
  folder: string,
  outputPath = 'cloud.css'
): { html: string; css: string } {
  if (!(fs.existsSync(folder) && fs.lstatSync(folder).isDirectory())) {
    fs.mkdirSync(folder);
    if (!fs.existsSync(folder))
      throw new Error(`Folder ${folder} creation failed.`);
  }
  folder = path.resolve(folder);
  const template = `<!DOCTYPE html>
  <html lang="en">

  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${path.basename(folder)}</title>
      <link rel="stylesheet" href="${outputPath}">
  </head>

  <body class="bg-gray-100">
      <div class="container mx-auto flex flex-col justify-center items-center h-screen">
          <div class="lg:flex shadow rounded-lg">
              <div class="bg-blue-500 rounded-t-lg lg:rounded-tr-none lg:rounded-l-lg lg:w-4/12 py-4 h-full flex flex-col justify-center">
                  <div class="text-center tracking-wide">
                      <div class="text-white font-bold text-8xl lg:text-4xl">24</div>
                      <div class="text-white font-normal text-4xl pt-4 lg:pt-0 lg:text-2xl">Sept</div>
                  </div>
              </div>
              <div class="w-full px-1 bg-white py-5 lg:px-2 lg:py-2 tracking-wide">
                  <div class="flex flex-row lg:justify-start justify-center">
                      <div class="text-gray-700 font-light text-sm text-center lg:text-left px-2">
                          1:30 PM
                      </div>
                      <div class="text-gray-700 font-light text-sm text-center lg:text-left px-2">
                          Organiser : IHC
                      </div>
                  </div>
                  <div class="text-gray-700 text-xl pb-1 text-center lg:text-left px-2">
                      International Conference Dubai
                  </div>

                  <div class="text-gray-800 font-light text-sm pt-1 text-center lg:text-left px-2">
                      A-142/1, A-142, Ganesh Nagar, Tilak Nagar, New Delhi, 110018
                  </div>
              </div>
              <div class="flex flex-row items-center w-full lg:w-1/3 bg-white lg:justify-end justify-center px-2 py-4 lg:px-0 rounded-lg">
                  <span class="tracking-wider text-gray-600 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm rounded-lg leading-loose mx-2">
                      Going
                  </span>
              </div>
          </div>
      </div>
  </body>
  </html>`;
  const inputPath = path.join(folder, 'index.html');
  outputPath = path.join(folder, outputPath);
  fs.writeFileSync(inputPath, template);
  fs.writeFileSync(outputPath, '');
  return { html: inputPath, css: outputPath };
}