const argv = require('yargs').argv;

const fe_port = parseInt(argv.fe || 8110);
const be_port = parseInt(argv.be || fe_port + 1);

module.exports = { fe_port, be_port };
