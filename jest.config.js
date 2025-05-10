module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/utils/swagger.js'
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  setupFilesAfterEnv: ['./tests/setup.js'],
};