module.exports = {
  coverageDirectory: '../coverage/tutor/',
  rootDir: '../../tutor',
  collectCoverage: false,
  collectCoverageFrom: [],
  testRegex: 'acceptance/.*\.spec\.js$',
  testEnvironment: '<rootDir>/acceptance/helpers/jest-environment.js',
  setupTestFrameworkScriptFile: '<rootDir>/acceptance/setup.js',
  cacheDirectory: '/tmp/tutor',
  preset: '../configs/test/jest.config.json',
  watchPathIgnorePatterns: ['acceptance/.*\.json$'],
  globalSetup: '<rootDir>/acceptance/helpers/global-setup.js',
  globalTeardown: '<rootDir>/acceptance/helpers/global-teardown.js',
};
