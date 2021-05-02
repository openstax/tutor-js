module.exports = {
    coverageDirectory: '../coverage/tutor/',
    rootDir: '../../tutor',
    collectCoverage: false,
    collectCoverageFrom: [],
    testRegex: 'specs/acceptance/.*\.spec\.js$',
    testEnvironment: '<rootDir>/specs/acceptance/helpers/jest-environment.js',
    setupTestFrameworkScriptFile: '<rootDir>/specs/acceptance/setup.js',
    cacheDirectory: '/tmp/tutor',
    preset: '../configs/test/jest.config.json',
    watchPathIgnorePatterns: ['acceptance/.*\.json$'],
    globalSetup: '<rootDir>/specs/acceptance/helpers/global-setup.js',
    globalTeardown: '<rootDir>/specs/acceptance/helpers/global-teardown.js',
};
