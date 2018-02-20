const Server = require('./server');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const del = require('del');
const path = require('path');
const { gitInit, gitCommit } = require('./git');
const repoURL = 'https://github.com/openstax/tutor-images.git';

const DIR = require('./working-directory');

async function boot () {
  await gitInit();
  const browser = await puppeteer.launch();
  global.__BROWSER__ = browser;
  fs.ensureDirSync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());

  global.global.__SERVER__ = new Server();
  await global.__SERVER__.boot();
}

module.exports = boot;
