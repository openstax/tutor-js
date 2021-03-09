const httpPort = process.env.FRONTEND_PORT || 8111;
const serverPort = process.env.SERVER_PORT || 8110;

const DEBUG = Boolean(process.env.DEBUG || false);

const config = {
    launchOptions: {
        headless: !DEBUG,
        devtools: DEBUG,
    },
};

if (!process.env.EXTERNAL_SERVER) {
    config.serverOptions = {
        command: 'node tutor/scripts/test-server/index.js',
        basePath: '/dist/tutor.js',
        launchTimeout: 90000,
        port: httpPort,
        protocol: 'http',
    };
}

module.exports = config;
