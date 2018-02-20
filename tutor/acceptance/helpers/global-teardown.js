const { gitCommit } = require('./git');
const Server = require('./server');
const DIR = require('./working-directory');
const fs = require('fs-extra');

async function teardown () {
  await global.__BROWSER__.close();
  await global.__SERVER__.halt();
  fs.removeSync(DIR);
  return gitCommit();
}

module.exports = teardown;
