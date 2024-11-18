/** @type {import('jest').Config} */
module.exports = {
  // Transforms
  transformIgnorePatterns: ['node_modules/(?!@librechat/api-keys)'],

  // Test environment
  testEnvironment: 'node',

  // File extensions Jest will look for
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  // The root directory that Jest should scan for tests and modules
  roots: ['<rootDir>/dist'],

  // The test pattern that Jest should look for
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],

  // Coverage settings
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],

  // Clear mocks between every test
  clearMocks: true,

  // Verbose output
  verbose: true,
};
