/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 90000, // 90 seconds
  // openHandlesTimeout: 0, // this is to avoid the error "Jest did not exit one second after the test run has completed"
  testMatch: ['**/__test__/**/*.test.ts'],
  // maxWorkers: 1, // this should solve the problem of " listen EADDRINUSE: address already in use :::3000" when running tests concurrently
  forceExit: true, // this is to avoid the error "Jest did not exit one second after the test run has completed"
  // collectCoverage: true, //this means that jest will collect coverage information
  // only files on __test__ directory
  // TODO: jest.config.js is not working 
  // TODO: search for jest.config best practices
};