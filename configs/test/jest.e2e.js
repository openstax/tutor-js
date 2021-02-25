const frontendPort = Number(process.env.BACKEND_PORT || 8110);
const backendPort = Number(process.env.FRONTEND_PORT || 8111);
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
            backendPort,
            frontendPort,
            API_URL: `http://localhost:${backendPort}/api`,
            URL: `http://localhost:${frontendPort}`,
            DEBUG,
        },
    },
    testTimeout: (DEBUG ? 90 : 30 )* 1000,
    testEnvironment: '../configs/test/playwright.env.js',
    setupFilesAfterEnv: ['expect-playwright'],
};


module.exports = config;
