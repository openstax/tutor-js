const DEBUG = Boolean(process.env.DEBUG || false);

const config = {
    launchOptions: {
        headless: !DEBUG,
        devtools: DEBUG,
    },
};

module.exports = config;
