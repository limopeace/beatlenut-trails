#!/usr/bin/env node

/**
 * Fast Build Script for Claude Code
 * 
 * This script provides workarounds for Claude Code's 2-minute timeout limitation
 * when running npm build commands.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Fast Build for Claude Code...');

// Strategy 1: Clean build with progress output
function runFastBuild() {
  return new Promise((resolve, reject) => {
    console.log('📦 Cleaning previous build...');
    
    // Clean .next directory first
    const nextDir = path.join(__dirname, '.next');
    if (fs.existsSync(nextDir)) {
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log('✅ Cleaned .next directory');
    }

    // Set environment variables for faster build
    const env = {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
      // Disable source maps for faster builds
      GENERATE_SOURCEMAP: 'false',
      // Reduce memory usage
      NODE_OPTIONS: '--max_old_space_size=4096'
    };

    console.log('🔨 Starting Next.js build...');
    
    const build = spawn('npx', ['next', 'build'], {
      stdio: 'pipe',
      env,
      cwd: __dirname
    });

    let output = '';
    let errorOutput = '';

    build.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      // Show progress to prevent timeout perception
      if (chunk.includes('Compiled') || chunk.includes('Creating') || chunk.includes('Generating')) {
        console.log('⏳', chunk.trim());
      }
    });

    build.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    build.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build completed successfully!');
        console.log('\n📊 Build Summary:');
        
        // Show build output summary
        const lines = output.split('\n');
        lines.forEach(line => {
          if (line.includes('Route') || line.includes('Size') || line.includes('Page') || line.includes('└')) {
            console.log(line);
          }
        });
        
        resolve(output);
      } else {
        console.error('❌ Build failed with code:', code);
        console.error('Error output:', errorOutput);
        reject(new Error(`Build failed with exit code ${code}`));
      }
    });

    // Timeout handler (realistic for Claude Code workflow)
    const timeout = setTimeout(() => {
      console.log('⚠️  Build taking longer than expected...');
      console.log('💡 Consider running manually: npm run build');
      build.kill('SIGTERM');
      reject(new Error('Build timeout - consider running manually'));
    }, 90000); // 1 minute 30 seconds (realistic for Claude Code)

    build.on('close', () => {
      clearTimeout(timeout);
    });
  });
}

// Strategy 2: Quick validation build (type check only)
function runTypeCheck() {
  return new Promise((resolve, reject) => {
    console.log('🔍 Running TypeScript type check...');
    
    const typeCheck = spawn('npx', ['tsc', '--noEmit'], {
      stdio: 'pipe',
      cwd: __dirname
    });

    let output = '';
    let errorOutput = '';

    typeCheck.stdout.on('data', (data) => {
      output += data.toString();
    });

    typeCheck.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    typeCheck.on('close', (code) => {
      if (code === 0) {
        console.log('✅ TypeScript check passed!');
        resolve(output);
      } else {
        console.error('❌ TypeScript errors found:');
        console.error(errorOutput);
        reject(new Error('TypeScript errors found'));
      }
    });
  });
}

// Strategy 3: Lint check
function runLintCheck() {
  return new Promise((resolve, reject) => {
    console.log('🔍 Running ESLint check...');
    
    const lint = spawn('npx', ['next', 'lint'], {
      stdio: 'pipe',
      cwd: __dirname
    });

    let output = '';
    let errorOutput = '';

    lint.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      console.log(chunk);
    });

    lint.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    lint.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Lint check passed!');
        resolve(output);
      } else {
        console.log('⚠️  Lint warnings/errors found');
        console.log(errorOutput);
        resolve(output); // Don't fail on lint warnings
      }
    });
  });
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  try {
    if (args.includes('--type-check') || args.includes('-t')) {
      await runTypeCheck();
    } else if (args.includes('--lint') || args.includes('-l')) {
      await runLintCheck();
    } else if (args.includes('--quick') || args.includes('-q')) {
      console.log('🚀 Running quick validation...');
      await runTypeCheck();
      await runLintCheck();
      console.log('✅ Quick validation completed!');
    } else {
      // Full build
      await runFastBuild();
    }
  } catch (error) {
    console.error('❌ Build process failed:', error.message);
    process.exit(1);
  }
}

// Show usage if help requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node build-fast.js [options]

Options:
  --quick, -q     Run quick validation (TypeScript + Lint)
  --type-check, -t  Run TypeScript type check only
  --lint, -l      Run ESLint only
  --help, -h      Show this help message

Examples:
  node build-fast.js              # Full build
  node build-fast.js --quick      # Quick validation
  node build-fast.js --type-check # Type check only
  `);
  process.exit(0);
}

main();