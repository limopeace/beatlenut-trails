/**
 * Global Jest setup
 */

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Increase test timeout
jest.setTimeout(10000);

// Global setup
beforeAll(async () => {
  // Any global setup can go here
  console.log('Starting tests...');
});

// Global teardown
afterAll(async () => {
  // Any global teardown can go here
  console.log('Tests completed!');
});

// Mock console.error in test environment
global.console.error = jest.fn();

// Handle unhandledRejection
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});