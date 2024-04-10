/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 90000, // 90 seconds
  testMatch: ['**/__test__/**/*.+(test|spec).ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  globalSetup: './__test__/testSetup/globalSetup.ts',
  globalTeardown: './__test__/testSetup/globalTeardown.ts',
  testSequencer: './__test__/testSetup/custom-sequencer.js',
  forceExit: true,
  // globals: {
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.json',
  //   },
  // },
  // collectCoverage: true, 
  // coverageDirectory: './coverage',
}; 