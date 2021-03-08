import { Page } from 'playwright-core'
import fetch from 'node-fetch'

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


export const setTimeouts = async () => {
    const TIMEOUT = testConfig.DEBUG ? 90 : 30
    context.setDefaultTimeout(TIMEOUT * 1000)
}
