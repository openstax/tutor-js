import { chromium } from '@playwright/test'
const fs = require('fs')
import { loginAs } from './helpers'

const AUTH_SENTINEL = 'temp/auth-complete'

const preAuthUsers = async () => {
    if (fs.existsSync(AUTH_SENTINEL)) {
        return
    }
    const browser = await chromium.launch();
    const page = await browser.newPage();
    for (const n of [1, 2]) {
        await loginAs(`teacher0${n}`, page)
        await page.context().storageState({ path: `temp/teacher0${n}-state.json` });
        await loginAs(`reviewstudent${n}`, page)
        await page.context().storageState({ path: `temp/reviewstudent${n}-state.json` });
    }
    await browser.close();
    fs.closeSync(fs.openSync(AUTH_SENTINEL, 'w'));
}


export default async function globalSetup() {
    await preAuthUsers()
}
