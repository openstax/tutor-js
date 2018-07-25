const argv = require('yargs').argv;

module.exports = {
  now: argv.now || '2028-01-01T12:00:00Z',
};
