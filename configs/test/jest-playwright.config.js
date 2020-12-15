const config = {
  launchOptions: {
    // headless: false,
  },
}

if (!process.env.EXERNAL_SERVER) {
  config.serverOptions = {
    command: 'yarn run tutor:test:server',
    port: serverPort,
  };
}

console.log(config);
