import fs from 'fs';
import path from 'path';

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'gray', 'emerald', 'teal', 'cyan', 'sky', 'violet', 'fuchsia', 'rose', 'slate', 'zinc', 'neutral', 'stone', 'orange', 'amber', 'lime'];
const SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];
const SPACING = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'];

function generateClasses() {
  const classes = new Set();
  
  // Mix and match typical utilities
  for (let i = 0; i < 5000; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = SIZES[Math.floor(Math.random() * SIZES.length)];
    const space = SPACING[Math.floor(Math.random() * SPACING.length)];
    
    classes.add(`text-${color}-500`);
    classes.add(`bg-${color}-100`);
    classes.add(`p-${space}`);
    classes.add(`m-${space}`);
    classes.add(`text-${size}`);
    classes.add(`border-${color}-200`);
    classes.add(`hover:text-${color}-600`);
    classes.add(`dark:bg-${color}-900`);
    classes.add(`sm:p-${space}`);
    classes.add(`md:text-${size}`);
    classes.add(`lg:m-${space}`);
  }
  
  return Array.from(classes).join(' ');
}

const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Benchmark</title>
</head>
<body class="bg-gray-50 text-gray-900">
    <div class="${generateClasses()}">
        <h1>Benchmark Case</h1>
        <p>This is a large scale test case for utility class generation.</p>
        <div class="grid grid-cols-4 gap-4">
            ${Array.from({ length: 100 }).map(() => `<div class="${generateClasses()}">Item</div>`).join('\n')}
        </div>
    </div>
</body>
</html>
`;

const benchmarkDir = 'CSS/css/benchmark';
if (!fs.existsSync(benchmarkDir)) {
    fs.mkdirSync(benchmarkDir, { recursive: true });
}

fs.writeFileSync(path.join(benchmarkDir, 'large.html'), html);
console.log('Generated benchmark/large.html');
