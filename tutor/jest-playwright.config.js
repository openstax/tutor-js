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
        launchTimeout: 5 * 60 * 1000,
        port: serverPort + 2, // fe dev server opens this when it's ready
        protocol: 'http',
    };
}

module.exports = config;
