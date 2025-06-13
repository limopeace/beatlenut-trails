#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Start the backend server from the parent directory
const backendDir = path.resolve(__dirname, '..');
const backendProcess = spawn('node', ['src/index.js'], {
  cwd: backendDir,
  stdio: 'inherit',
  env: { ...process.env, PORT: 4000 }
});

console.log('Starting backend server on port 4000...');

backendProcess.on('error', (err) => {
  console.error('Failed to start backend server:', err);
});

backendProcess.on('close', (code) => {
  console.log(`Backend server process exited with code ${code}`);
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('Stopping backend server...');
  backendProcess.kill('SIGINT');
  process.exit(0);
});