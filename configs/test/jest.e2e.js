const serverPort = process.env.SERVER_PORT || 8110;
const DEBUG = !!process.env.DEBUG;


const config = {
  rootDir: '../../tutor',
  testRegex: 'specs/e2e/.*\\.e2e\\.(ts|js)$',
  preset: 'jest-playwright-preset',
  transform: {
    '^.+\\.jsx?$': 'babel7-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    testConfig: {
      URL: `http://localhost:${serverPort}`,
      DEBUG,
    },
  },
  testTimeout: (DEBUG ? 90 : 20 )* 1000,
  testEnvironment: '../configs/test/playwright.env.js',
  setupFilesAfterEnv: ['expect-playwright'],
};


module.exports = config;
