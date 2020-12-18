const serverPort = process.env.SERVER_PORT || 8110;

const config = {
  rootDir: '../../tutor',
  testRegex: 'specs/e2e/.*\\.e2e\\.(ts|js)$',
  preset: 'jest-playwright-preset',
  globals: {
    testConfig: {
      URL: `http://localhost:${serverPort}`,
    },
  },
  testEnvironment: '../configs/test/playwright.env.js',
  setupFilesAfterEnv: ['expect-playwright'],
};


module.exports = config;
