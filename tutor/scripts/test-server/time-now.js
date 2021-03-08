const argv = require('yargs').argv;

const NOW = (new Date).toISOString();

module.exports = {
    now: argv.now || NOW,
};
