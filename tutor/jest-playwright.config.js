const serverPort = process.env.SERVER_PORT || 8110;

const config = {
  launchOptions: {
    // headless: false,
  },
};

// this seems good but times out. need to investigate
// if (!process.env.EXERNAL_SERVER) {
//   config.serverOptions = {
//     command: 'node tutor/scripts/test-server/index.js',
//     launchTimeout: 50000,
//     port: serverPort,
//   };
// }


module.exports = config;
