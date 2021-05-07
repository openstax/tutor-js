const PORT = Number(process.env.PORT || 3001);
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
            PORT,
            URL: `http://localhost:${PORT}`,
            DEBUG,
        },
    },
    testTimeout: (DEBUG ? 600 : 30 )* 1000,
    testEnvironment: '../configs/test/playwright.env.js',
    setupFilesAfterEnv: ['expect-playwright'],
};


module.exports = config;
