import { chromium } from '@playwright/test'
import fs from 'fs'
import { loginAs } from './helpers'

const AUTH_SENTINEL = 'temp/auth-complete'

export const DEFAULT_TIMEOUT = 10000
export const DEFAULT_NAVIGATION_TIMEOUT = 20000

const preAuthUsers = async () => {
    if (fs.existsSync(AUTH_SENTINEL)) {
        return
    }
    for (const n of [1, 2]) {
        const browser = await chromium.launch()
        const context = await browser.newContext()
        context.setDefaultTimeout(DEFAULT_TIMEOUT)
        context.setDefaultNavigationTimeout(DEFAULT_NAVIGATION_TIMEOUT)
        const page = await context.newPage()
        await loginAs(`teacher0${n}`, page)
        await context.storageState({ path: `temp/teacher0${n}-state.json` })
        await browser.close()
    }

    for (const n of [1, 2]) {
        const browser = await chromium.launch()
        const context = await browser.newContext()
        context.setDefaultTimeout(DEFAULT_TIMEOUT)
        context.setDefaultNavigationTimeout(DEFAULT_NAVIGATION_TIMEOUT)
        const page = await context.newPage()
        page.setDefaultTimeout(DEFAULT_TIMEOUT)
        page.setDefaultNavigationTimeout(DEFAULT_NAVIGATION_TIMEOUT)
        await loginAs(`reviewstudent${n}`, page)
        await context.storageState({ path: `temp/reviewstudent${n}-state.json` })
        await browser.close()
    }
    fs.closeSync(fs.openSync(AUTH_SENTINEL, 'w'));
}


export default async function globalSetup() {
    await preAuthUsers()
}
