/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 90000, // 90 seconds
  collectCoverage: true, //this means that jest will collect coverage information
  // only files on __test__ directory
  // testMatch: ['**/__test__/**/*.test.ts'],
};