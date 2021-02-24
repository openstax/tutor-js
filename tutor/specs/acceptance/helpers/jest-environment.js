const NodeEnvironment = require('jest-environment-node');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DIR = require('./working-directory');

class TutorAcceptanceEnvironment extends NodeEnvironment {

    constructor(config) {
        const server = global.__SERVER__;
        super(config);
        this.server = server;
    }

    async setup() {
        await super.setup();

        const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8');
        if (!wsEndpoint) {
            throw new Error('wsEndpoint not found');
        }
        this.global.__SERVER__ = this.server;
        this.global.__BROWSER__ = await puppeteer.connect({
            browserWSEndpoint: wsEndpoint,
        });
    }

    runScript(script) {
        return super.runScript(script);
    }
}

module.exports = TutorAcceptanceEnvironment;
