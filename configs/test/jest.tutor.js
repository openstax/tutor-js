module.exports = {
    coverageDirectory: '../coverage/tutor/',
    rootDir: '../../tutor',
    cacheDirectory: '/tmp/tutor',
    testPathIgnorePatterns: [
        '/node_modules/',
        '<rootDir>/specs/acceptance',
    ],
    preset: '../configs/test/jest.config.json',
};
