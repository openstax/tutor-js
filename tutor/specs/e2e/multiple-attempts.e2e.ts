import faker from 'faker'

import {
    visitPage, expect, test, setDateTimeRelative,
    selectCalendarSidebarOption, selectExeciseCard,
    withUser,
} from './test'

const COURSE_ID = 2

let assignmentName = ''

withUser('reviewstudent2')

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: 'temp/teacher02-state.json' })
    const page = await context.newPage()

    await visitPage(page, `/course/${COURSE_ID}`)

    await selectCalendarSidebarOption(page, 'Grading Templates')
    await page.waitForSelector('testId=grading-template-card')

    const hasFeedbackTmpl = await page.$('testId=grading-template-card >> text=MultipleAttempts')
    if (!hasFeedbackTmpl) {
        await page.click('text="Add new template"')
        await page.click('.modal-content >> text="Homework"')
        await page.fill('.modal-content >>#template_name', 'MultipleAttempts')
        await page.click('.modal-content >> [data-test-id=turn-on-multiple-attempts]')
        await page.click('.modal-content >> .btn-primary')
    }

    await visitPage(page, `/course/${COURSE_ID}`)

    await selectCalendarSidebarOption(page, 'Add homework')

    assignmentName  = faker.commerce.productName()
    await page.fill('testId=edit-assignment-name', assignmentName)
    setDateTimeRelative(page, 'input[name="tasking_plans[0].opens_at"]', { day: -2 })

    await page.click('testId=grading-templates')
    await page.click('.dropdown-menu >> text=MultipleAttempts')

    await page.click('text="Save & Continue"')

    await page.click('text="Newtons First Law of Motion: Inertia"')
    await page.click('text="Save & Continue"')

    await selectExeciseCard(page, '2084')
    await selectExeciseCard(page, '2092')
    await selectExeciseCard(page, '2076')

    await page.click('text="Save & Continue"')
    await page.click('text="Publish"')

    await page.waitForSelector(`tourRegion=teacher-calendar >> css=.is-published.is-open >> text="${assignmentName}"`)

    await page.close()
    await context.close()
})

test.beforeEach(async ({ page }) => {
    await visitPage(page, `/course/${COURSE_ID}`)
    await page.click(`text="${assignmentName}"`)
});

test('can re-attempt answers', async ({ page }) => {

    await page.click('[data-step-index="2"]')
    await page.fill('testId=free-response-box', '')
    let submitBtn = await page.$('testId=submit-answer-btn')
    await submitBtn!.waitForElementState('disabled')
    await page.type('testId=free-response-box', 'this is a answer answering and fully explaining my reasoning for the question')
    await page.click('testId=submit-answer-btn')

    const attemptsLeft = await page.waitForSelector('.attempts-left')

    await expect(attemptsLeft).toMatchText('2 attempts left')

    await page.click('testId=answer-choice-a')
    await page.click('testId=submit-answer-btn')

    await page.waitForResponse((response) => response.url().includes('step'))

    submitBtn = await page.waitForSelector('testId=submit-answer-btn')
    await expect(submitBtn).toBeDisabled()
    await expect(attemptsLeft).toMatchText('1 attempt left')

    await page.click('testId=answer-choice-b')

    await expect(submitBtn).toBeEnabled()
    expect(await submitBtn.textContent()).toEqual('Re-submit')
    await page.click('testId=submit-answer-btn')
    await page.waitForResponse((response) => response.url().includes('step'))
    const ctnBtn = await page.waitForSelector('testId=continue-btn')
    await expect(ctnBtn).toBeEnabled()
    expect(await ctnBtn.textContent()).toEqual('Next')
})
