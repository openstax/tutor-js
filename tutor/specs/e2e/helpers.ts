import { Page } from '@playwright/test'
import Factory from 'object-factory-bot'
import * as cp from 'child_process'
import * as faker from 'faker';
import 'expect-playwright'
import '../factories/definitions'
export * from '@playwright/test'
import { DateTime, DurationInput } from 'luxon'
export { faker, Factory }


//import '../factories/definitions'
export * from './mocker'

const serverPort = process.env.SERVER_PORT || 3001
const TC = {
    URL: `http://localhost:${serverPort}`,
}

type TestConfig = typeof TC
export type { TestConfig }


export const visitPage = async (page: Page, path: string) => {
    const url = `${TC.URL}${path}`
    await page.goto(url)
    await page.waitForLoadState('networkidle')
    await disableTours(page)
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

export const setDateTimeRelative = async (page: Page, selector: string, diff: DurationInput) => {
    const dte = DateTime.now().plus(diff).toFormat('LLL d | hh:mm a');
    // triple click selects everything
    await page.click(selector, { clickCount: 3 });
    await page.keyboard.press('Backspace')
    await page.type(selector, dte);
    await page.click('.oxdt-footer >> text=Ok');
}

export const selectExeciseCard = async (page: Page, exId: string) => {
    await page.waitForSelector('[data-exercise-id]')
    await page.hover(`[data-exercise-id^="${exId}"]`)
    await page.click(`[data-exercise-id^="${exId}"] >> .action.include`)
}

export const openCalendarSideBar = async (page: Page) => {
    await page.waitForSelector('.add-assignment-sidebar')
    if (!(await page.$('.add-assignment-sidebar.is-open'))) {
        await page.click('text="Add Assignment"')
        await page.waitForSelector('.add-assignment-sidebar.is-open')
    }
}

export const selectCalendarSidebarOption = async (page: Page, option: string) => {
    openCalendarSideBar(page)
    await page.click(`.add-assignment-sidebar >> text="${option}"`)
}

export const disableTours = async (page: Page) => {
    await page.evaluate(() => {
        const editing = (window as any)._MODELS?.user.terms.get('exercise_editing')
        if (editing) { editing.is_signed = true }
        (window as any)._MODELS?.feature_flags.set('tours', false)
    })
}

export const getCourseIdFromURL = async (page: Page) => {
    const url = await page.evaluate(() => document.location.pathname) as string
    return url.match(/course\/(\d+)/)?.[1]
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
    await page.goto(`${TC.URL}/accounts/dev/accounts`)
    await page.click(`text="${userName}"`)
    await page.waitForSelector('.tutor-root')
    await disableTours(page)
}

export const selectAnswer = async (page: Page, choice : string, freeResponse: string) => {
    await page.waitForSelector('css=.exercise-step >> testId=free-response-box', { timeout: 2000 })
        .then(async () => {
            await page.type('css=.exercise-step >> testId=free-response-box', freeResponse)
            await page.click('testId=submit-answer-btn')
        })
        // free response is submitted
        .catch(() => {})

    await page.waitForSelector(`css=.answer-checked >> testId=answer-choice-${choice}`, { timeout: 2000 })
        .then(async () => {
            await page.click(`css=.answer-checked >> testId=answer-choice-${choice}`)
        })
        .catch(async () => {
            await page.click(`testId=answer-choice-${choice}`)
            await page.click('testId=submit-answer-btn')
        })
}

export const deleteText = async (page: Page, elementSelector: string) => {
    await page.click(elementSelector, { clickCount: 3 })
    page.keyboard.press('Backspace')
}
