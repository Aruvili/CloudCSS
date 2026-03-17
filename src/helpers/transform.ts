import { createRequire } from 'module';

export function convert(code: string): string {
  const map = {
    '@tailwindcss\\/typography': 'cloudcss/plugin/typography',
    '@tailwindcss\\/forms': 'cloudcss/plugin/forms',
    '@tailwindcss\\/aspect-ratio': 'cloudcss/plugin/aspect-ratio',
    '@tailwindcss\\/line-clamp': 'cloudcss/plugin/line-clamp',
    'tailwindcss\\/plugin': 'cloudcss/plugin',
    'tailwindcss\\/colors': 'cloudcss/colors',
    'tailwindcss\\/resolveConfig': 'cloudcss/resolveConfig',
    'tailwindcss\\/defaultConfig': 'cloudcss/defaultConfig',
    'tailwindcss\\/defaultTheme': 'cloudcss/defaultTheme',
  };
  for (const [key, value] of Object.entries(map)) {
    code = code.replace(new RegExp(key, 'g'), value);
  }
  return code;
}

export function transform(path: string): any {
  const require = createRequire(import.meta.url);
  const mod = require(path);
  return mod;
  return mod;
}
