const Server = require('../../../scripts/test-server');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

const DIR = require('./working-directory');


async function boot () {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    global.__BROWSER__ = browser;
    fs.ensureDirSync(DIR);
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
    global.global.__SERVER__ = new Server();
    await global.__SERVER__.boot();
}

module.exports = boot;
