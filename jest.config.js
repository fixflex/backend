/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 90000, // 90 seconds
  openHandlesTimeout: 0,// this is to avoid the error "Jest did not exit one second after the test run has completed"
  forceExit: true, // this is to avoid the error "Jest did not exit one second after the test run has completed"
  // collectCoverage: true, //this means that jest will collect coverage information
  // only files on __test__ directory
  // testMatch: ['**/__test__/**/*.test.ts'],
};