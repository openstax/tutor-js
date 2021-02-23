import { Page } from 'playwright-core'

export const visitPage = async (page: Page, path: string) => {
    const url = `${testConfig.URL}${path}`
    return await page.goto(url)
}


export const setTimeouts = async () => {
    const TIMEOUT = testConfig.DEBUG ? 90 : 10
    context.setDefaultTimeout(TIMEOUT * 1000)
}