const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BENCHMARK_DIR = path.resolve(__dirname);
const ROOT_DIR = path.resolve(BENCHMARK_DIR, '..');
const TAILWIND_CONFIG = path.join(BENCHMARK_DIR, 'tailwind.config.js');
const cloud_CONFIG = path.join(BENCHMARK_DIR, 'cloudcss.config.ts');
const INPUT_HTML = path.join(BENCHMARK_DIR, 'large.html');

function runBenchmark(name, command) {
  console.log(`\n--- Benchmarking ${name} ---`);
  
  // Clean up previous output
  const outputCss = path.join(BENCHMARK_DIR, `${name.toLowerCase()}.css`);
  if (fs.existsSync(outputCss)) fs.unlinkSync(outputCss);

  const start = process.hrtime();
  try {
    execSync(command, { stdio: 'inherit', cwd: ROOT_DIR });
  } catch (e) {
    console.error(`Failed to run ${name}:`, e.message);
    return null;
  }
  const end = process.hrtime(start);
  const durationMs = (end[0] * 1000 + end[1] / 1000000).toFixed(2);

  const stats = fs.statSync(outputCss);
  const sizeKb = (stats.size / 1024).toFixed(2);

  console.log(`${name} Results:`);
  console.log(`  Time: ${durationMs}ms`);
  console.log(`  Size: ${sizeKb}KB`);

  return { durationMs, sizeKb };
}

async function main() {
  console.log('Building cloudCSS first...');
  execSync('npm run build', { stdio: 'inherit', cwd: ROOT_DIR });

  // Tailwind Benchmark
  // Assuming tailwindcss is available via npx
  const tailwindCmd = `${path.join(BENCHMARK_DIR, 'node_modules', '.bin', 'tailwindcss')} -i ${path.join(BENCHMARK_DIR, 'input.css')} -o ${path.join(BENCHMARK_DIR, 'tailwind.css')} --minify`;



  
  // Create a simple input CSS for Tailwind
  fs.writeFileSync(path.join(BENCHMARK_DIR, 'input.css'), '@import "tailwindcss";\n@source "./large.html";');


  const twResult = runBenchmark('Tailwind', tailwindCmd);

  // cloudCSS Benchmark
  // Use the local CLI
  const cloudCmd = `node dist/cli/index.cjs benchmark/large.html -o ${path.join(BENCHMARK_DIR, 'cloudcss.css')} --minify`;



  const cloudResult = runBenchmark('cloudCSS', cloudCmd);

  if (twResult && cloudResult) {
    console.log('\n--- Final Comparison ---');
    console.log(`Time: cloudCSS is ${(twResult.durationMs / cloudResult.durationMs).toFixed(2)}x faster`);
    console.log(`Size: cloudCSS is ${(twResult.sizeKb / cloudResult.sizeKb).toFixed(2)}x smaller (CSS content only)`);
  }
}

main();
