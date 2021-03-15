import { Page } from 'playwright-core'
import Factory from 'object-factory-bot'
import { BootstrapData } from '../../src/store/types'
import fetch from 'node-fetch'
import '../factories/definitions'
import { Mocker } from './mocker'

export const visitPage = async (page: Page, path: string) => {
    const url = `${testConfig.URL}${path}`
    return await page.goto(url)
}

// the test endpoint doesn't yet support teacher-student role
export type Roles = 'teacher' | 'student'

export const setRole = async (role: Roles): Promise<boolean> => {
    const resp = await fetch(`${testConfig.API_URL}/setrole?role=${role}`)
    return resp.ok
}

// use with care!  jest runs specs multi-process;
// calling this in one spec may reset the state for another spec
// while it's running
export const resetState = async () => {
    const resp = await fetch(`${testConfig.API_URL}/resetState`)
    return resp.ok
}

// IMPORTANT! the page is shared between all specs in file.
// you must call 'await jestPlaywright.resetPage()' in a beforeEach if
// different specs attempt to set different data in the same test file
type bootstrapModifierFn = (data: BootstrapData) => BootstrapData // eslint-disable-line
export const modifyBootstrapData = async (page: Page, cb: bootstrapModifierFn) => {
    await page.route(/bootstrap/, async (route) => {
        const req = await fetch(`${testConfig.API_URL}/user/bootstrap`)
        const bs = await req.json() as BootstrapData
        route.fulfill({
            body: JSON.stringify(cb(bs)),
            headers: {
                'x-app-date': (new Date()).toISOString(),
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        })
    })
}

export const setTimeouts = async () => {
    const TIMEOUT = testConfig.DEBUG ? 90 : 40

    context.setDefaultTimeout(TIMEOUT * 1000)
}

export { Mocker, Factory }
