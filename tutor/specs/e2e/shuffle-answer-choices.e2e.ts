import { Page } from '@playwright/test'
import faker from 'faker'

import {
    visitPage, expect, test, setDateTimeRelative,
    selectCalendarSidebarOption, selectExeciseCard,
    withUser,
} from './test'

const COURSE_ID = 2

let assignmentName = ''
const templateName = 'ShuffleAnswerChoices'

const createGradingTemplate = async (page: Page) => {
    await visitPage(page, `/course/${COURSE_ID}`)

    await selectCalendarSidebarOption(page, 'Grading Templates')
    await page.waitForSelector('testId=grading-template-card')

    const hasFeedbackTmpl = await page.$(`testId=grading-template-card >> text=${templateName}`)

    if (!hasFeedbackTmpl) {
        await page.click('text="Add new template"')
        await page.click('.modal-content >> text="Homework"')
        await page.fill('.modal-content >>#template_name', templateName)
        await page.click('.modal-content >> [data-test-id=turn-on-shuffle-answer-choices]')
        await page.click('.modal-content >> .btn-primary')
    }
}

const getOrder = async (page: Page) => await page.$$eval('.answer-answer', (n: HTMLElement[]) => n.map(s => s.innerText))

test.describe('a teacher', () => {
    withUser('teacher01')

    test('C641277: can create a grading template with shuffle', async ({ browser }) => {
        const context = await browser.newContext({ storageState: 'temp/teacher02-state.json' })
        const page = await context.newPage()
        await createGradingTemplate(page)

        const selector = `[data-test-id=grading-template-card]:has-text('${templateName}')`
        const templateContents = await page.textContent(selector)
        expect(templateContents).toMatch('Shuffle answer choices?Yes')
    })
})

test.describe('a student', () => {
    withUser('reviewstudent2')
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext({ storageState: 'temp/teacher02-state.json' })
        const page = await context.newPage()

        await createGradingTemplate(page)

        await visitPage(page, `/course/${COURSE_ID}`)

        await selectCalendarSidebarOption(page, 'Add homework')

        assignmentName = faker.commerce.productName()
        await page.fill('testId=edit-assignment-name', assignmentName)

        await page.click('testId=grading-templates-btn')
        await page.click(`[data-test-id="grading-templates"] .dropdown-menu >> text=${templateName}`)

        await setDateTimeRelative(page, 'input[name="tasking_plans[0].opens_at"]', { day: -2 })
        await setDateTimeRelative(page, 'input[name="tasking_plans[0].due_at"]', { day: 1 })

        await page.click('text="Save & Continue"')

        await page.click('text="Newtons First Law of Motion: Inertia"')
        await page.click('text="Normal, Tension, and Other Examples of Forces"')
        await page.click('text="Save & Continue"')

        await selectExeciseCard(page, '12350')
        await selectExeciseCard(page, '2092')
        await selectExeciseCard(page, '2084')

        await page.click('text="Save & Continue"')
        await page.click('text="Publish"')

        await page.waitForSelector(`tourRegion=teacher-calendar >> css=.is-published.is-open >> text="${assignmentName}"`)

        await page.close()
        await context.close()
    })

    test.beforeEach(async ({ page }) => {
        // Guarantee initial order
        await page.addInitScript(() => Math.random = () => 0)
        await visitPage(page, `/course/${COURSE_ID}`)
        await page.click(`text="${assignmentName}"`)
    });

    test('C641279: can shuffle answers', async ({ page }) => {
        await page.click('[data-step-index="1"]')
        await page.fill('testId=free-response-box', '')
        let submitBtn = await page.waitForSelector('testId=submit-answer-btn')
        await submitBtn.waitForElementState('disabled')
        await page.type('testId=free-response-box', 'answer')
        await page.click('testId=submit-answer-btn')
        const originalOrder = await getOrder(page)

        // Guarantee next order is different
        await page.addInitScript(() => Math.random = () => 0.5)
        await page.reload()

        await page.fill('testId=free-response-box', '')
        submitBtn = await page.waitForSelector('testId=submit-answer-btn')
        await submitBtn.waitForElementState('disabled')
        await page.type('testId=free-response-box', 'answer')
        await page.click('testId=submit-answer-btn')
        const newOrder = await getOrder(page)

        expect(newOrder.length).toEqual(4)
        expect(newOrder).not.toEqual(originalOrder)

        await page.click('testId=answer-choice-b')
        await page.click('testId=submit-answer-btn')

        // Make sure submitted order continues to be used
        await page.waitForSelector('.answer-correct')
        expect(await getOrder(page)).toEqual(newOrder)
        await page.reload()
        await page.waitForSelector('.answer-answer')
        expect(await getOrder(page)).toEqual(newOrder)
    })

    test('can not shuffle important order answers', async ({ page }) => {
        await page.click('[data-step-index="3"]')
        await page.fill('testId=free-response-box', '')
        let submitBtn = await page.waitForSelector('testId=submit-answer-btn')
        await submitBtn.waitForElementState('disabled')
        await page.type('testId=free-response-box', 'initial')
        await page.click('testId=submit-answer-btn')
        const originalOrder = await getOrder(page)

        await page.addInitScript(() => Math.random = () => 0.5)
        await page.reload()

        await page.fill('testId=free-response-box', '')
        submitBtn = await page.waitForSelector('testId=submit-answer-btn')
        await submitBtn.waitForElementState('disabled')
        await page.type('testId=free-response-box', 'reload')
        await page.click('testId=submit-answer-btn')

        expect(await getOrder(page)).toEqual(originalOrder)
    })
})
