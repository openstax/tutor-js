const serverPort = process.env.SERVER_PORT || 8110;

const DEBUG = Boolean(process.env.DEBUG || false);

const config = {
  launchOptions: {
    headless: !DEBUG,
    devtools: DEBUG,
  },
};

if (!process.env.EXERNAL_SERVER) {
  config.serverOptions = {
    command: 'node tutor/scripts/test-server/index.js',
    basePath: '/dist/tutor.js',
    launchTimeout: 90000,
    port: serverPort,
    protocol: 'http',
  };
}

module.exports = config;
