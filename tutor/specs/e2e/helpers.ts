import { Page } from 'playwright-core'
import Factory from 'object-factory-bot'
import { forEach } from 'lodash'
import * as cp from 'child_process'
import * as faker from 'faker';

export { faker }

import '../factories/definitions'
export * from './mocker'

export const SCREENS = {
    mobile: [375,667], // iphone
    tablet: [768,1024], // ipad
    desktop: [1280, 1024], // pretty much anything is larger than this
}

export const visitPage = async (page: Page, path: string) => {
    const url = `${testConfig.URL}${path}`
    return await page.goto(url)
}

export const execRailsCmd = async (irb: string) => {
    return new Promise((result, reject) => {
        const cmd = `docker exec tutor-server_rails_1 bin/rails r "${irb}"`
        cp.exec(cmd, (error, stdout) => {
            if (error) {
                console.warn(cmd, error, stdout) // eslint-disable-line
                reject(error)
            }
            result(stdout)
        })
    })

}

interface AccountOptions {
    page: Page,
    role?: 'instructor' | 'student' | 'unknown_role',
    userName: string
    isVerified?: boolean
    approvedSchool?: boolean
    agreeToTerms?: boolean
}

export const findOrCreateTeacherAccount = async ({
    page, userName,
    agreeToTerms = true,
    role = 'instructor',
    isVerified = true,
    approvedSchool = true,
}: AccountOptions) => {
    const returnedId = await execRailsCmd(
        `puts User::FindOrCreateUser[
username:'${userName}',
role:'${role}',
is_test:true,
faculty_status:'${isVerified ? 'confirmed_faculty' : 'no_faculty_info'}',
school_type:'${approvedSchool ? 'college' : 'unknown_school_type' }',
school_location:'domestic_school'].id`
    )
    const userId = Number(returnedId)
    if (agreeToTerms) {
        await execRailsCmd(`
            pr=OpenStax::Accounts::Account.find(${userId}).profile;
            FinePrint.sign_contract(pr,:general_terms_of_use);
            FinePrint.sign_contract(pr,:privacy_policy)
        `)
    }
    await loginAs(userName, page)
    return userId
}

export const disableTours = async (page: Page = (global as any).page) => {
    await page.evaluate(() => {
        const editing = window._MODELS.user.terms.get('exercise_editing')
        if (editing) { editing.is_signed = true }
        window._MODELS.feature_flags.set('tours', false)
    })
}

export const loaderNotVisible = async (page: Page = (global as any).page) => {
    while (await page.$('css=.loading-animation')) {
        await page.waitForTimeout(100)
    }
}

export const loginAs = async (userName: string, page: Page = (global as any).page ) => {
    const userMenu = await page.$('#user-menu')
    if (userMenu) {
        const currentUserName = await userMenu.getAttribute('data-username')
        if (currentUserName == userName) {
            return
        }
        await userMenu.click({ force: true })
        await page.click('.logout [type=submit]', { force: true })
    }
    await page.goto(`${testConfig.URL}/accounts/dev/accounts`)
    await page.click(`text="${userName}"`)
}

export const setTimeouts = async () => {
    // a bit smaller than are set in jest config
    const TIMEOUT = testConfig.DEBUG ? 600 : 15

    context.setDefaultTimeout(TIMEOUT * 1000)
}

// (screen: string) is getting complained that it is not not-used, but it is a type definiton
// eslint-disable-next-line no-unused-vars
export const withScreenSize = (testName: string, test: (screen: string) =>Promise<void>) => {
    forEach(SCREENS, (dimensions, screen) => {
        const [width, height] = dimensions

        it(`${testName}. Width: ${width} | Height: ${height}`, async () => {
            await page.setViewportSize({ width, height })
            await test(screen)
        })
    })
}

export const selectAnswer = async (page: Page, choice : string, freeResponse: string) => {
    await page.waitForSelector('css=.exercise-step >> testEl=free-response-box', { timeout: 2000 })
        .then(async () => {
            await page.type('css=.exercise-step >> testEl=free-response-box', freeResponse)
            await page.click('testEl=submit-answer-btn')
        })
        // free response is submitted
        .catch(() => {})

    await page.waitForSelector(`css=.answer-checked >> testEl=answer-choice-${choice}`, { timeout: 2000 })
        .then(async () => {
            await page.click(`css=.answer-checked >> testEl=answer-choice-${choice}`)
        })
        .catch(async () => {
            await page.click(`testEl=answer-choice-${choice}`)
            await page.click('testEl=submit-answer-btn')
        })
}

export const deleteText = async (page: Page, elementSelector: string) => {
    await page.click(elementSelector, { clickCount: 3 })
    page.keyboard.press('Backspace')
}


export { Factory }
