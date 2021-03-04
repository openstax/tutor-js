import { Page } from 'playwright-core'
import fetch from 'node-fetch'
import { forEach } from 'lodash'

const SCREENS = {
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

export const withScreenSizes = (test: () => Promise<void>, sizes = SCREENS) => {
    forEach(sizes, async size => {
        const [w,h] = size;
        await page.setViewportSize({ width: w, height: h })
        await test()
        await page.setViewportSize({ width: SCREENS.desktop[0], height: SCREENS.desktop[1] })
    })
};

export const disableTours = async () => {
    await page.evaluate(() => {
        window._MODELS.feature_flags.set('tours', false)
    })
}
