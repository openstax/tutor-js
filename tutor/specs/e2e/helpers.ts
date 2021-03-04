import { Page } from 'playwright-core'
import fetch from 'node-fetch'

export const SCREENS = {
    mobile: [375,667], // iphone
    tablet: [768,1024], // ipad
    desktop: [1280, 1024], // pretty much anything is larger than this
}


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


export const setTimeouts = async () => {
    const TIMEOUT = testConfig.DEBUG ? 90 : 30
    context.setDefaultTimeout(TIMEOUT * 1000)
}

export const disableTours = async () => {
    await page.evaluate(() => {
        window._MODELS.feature_flags.set('tours', false)
    })
}
