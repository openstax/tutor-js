import base, { selectors, Page } from '@playwright/test'
import Factory from 'object-factory-bot'
import * as faker from 'faker';
import 'expect-playwright'
import '../factories/definitions'
import { DEFAULT_TIMEOUT, DEFAULT_NAVIGATION_TIMEOUT } from './setup'
export * from '@playwright/test'
export { faker, Factory }

export * from './helpers'

export const createTestIdEngine = () => {
    const toTestSelector = (sel: string) => {
        const quoted = sel.match(/^".*"$/) ? sel : `"${sel}"`
        return `[data-test-id=${quoted}]`
    }
    return {
        query: (root: HTMLElement, selector: string) =>
            root.querySelector(toTestSelector(selector)),
        queryAll: (root: HTMLElement, selector: string) =>
            Array.from(root.querySelectorAll(toTestSelector(selector))),
    }
}

export const createTourRegionEngine = () => {
    const toTourRegionSelector = (sel: string) => {
        const quoted = sel.match(/^".*"$/) ? sel : `"${sel}"`
        return `[data-tour-region-id=${quoted}]`
    }
    return {
        query: (root: HTMLElement, selector: string) =>
            root.querySelector(toTourRegionSelector(selector)),
        queryAll: (root: HTMLElement, selector: string) =>
            Array.from(root.querySelectorAll(toTourRegionSelector(selector))),
    }
}

interface ScreenDefinition {
    [key: string]: [number, number]
}

export const SCREEN_SIZES:ScreenDefinition = {
    mobile: [375,667], // iphone
    tablet: [768,1024], // ipad
    desktop: [1280, 1024], // pretty much anything is larger than this
}

// (screen: string) is getting complained that it is not not-used, but it is a type definiton
// eslint-disable-next-line no-unused-vars
export async function* screenSizes(page: Page) {
    for (const [screen, [width, height]] of Object.entries(SCREEN_SIZES)) {
        await page.setViewportSize({ width, height })
        yield screen
    }
}

type TestFixtures = {

}
const test = base.extend<TestFixtures>({

})

export const keyboardShortcuts = (page: Page) => ({
  selectAll: (selector: string) => page.press(selector, process.platform === 'darwin' ? 'Meta+a' : 'Control+a')
})


test.beforeAll(async () => {
    await selectors.register('testId', createTestIdEngine)
    await selectors.register('tourRegion', createTourRegionEngine)
})

test.beforeEach(({ context, page }) => {
    context.setDefaultTimeout(DEFAULT_TIMEOUT);
    page.setDefaultTimeout(DEFAULT_TIMEOUT);
    context.setDefaultNavigationTimeout(DEFAULT_NAVIGATION_TIMEOUT);
    page.setDefaultNavigationTimeout(DEFAULT_NAVIGATION_TIMEOUT);
});

// logins stored in ./setup.ts
type UserLogin = 'teacher01' | 'teacher02' | 'reviewstudent1' | 'reviewstudent2'
export const withUser = (login: UserLogin) => {
    test.use({ storageState: `temp/${login}-state.json` })
}

export { test }
