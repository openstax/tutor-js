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

    const hasFeedbackTmpl = await page.$('testId=grading-template-card >> text=NoFeedback')
    if (!hasFeedbackTmpl) {
        await page.click('text="Add new template"')
        await page.click('.modal-content >> text="Homework"')
        await page.fill('.modal-content >>#template_name', 'NoFeedback')
        await page.click('.modal-content >> text="After the due date"')
        await page.click('.modal-content >> .btn-primary')
    }

    await visitPage(page, `/course/${COURSE_ID}`)

    await selectCalendarSidebarOption(page, 'Add homework')

    assignmentName  = faker.commerce.productName()
    await page.fill('testId=edit-assignment-name', assignmentName)
    setDateTimeRelative(page, 'input[name="tasking_plans[0].opens_at"]', { day: -2 })

    await page.click('testId=grading-templates')
    await page.click('.dropdown-menu >> text=NoFeedback')

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

test('advances after answering a free-response only question', async ({ page }) => {

    await page.click('[data-step-index="2"]')
    await page.fill('testId=free-response-box', '')
    const submitBtn = await page.waitForSelector('testId=submit-answer-btn')
    await submitBtn.waitForElementState('disabled')
    await page.type('testId=free-response-box', 'this is a answer answering and fully explaining my reasoning for the question')
    await submitBtn.waitForElementState('enabled')
})

test('can change and re-submit answers to questions', async ({ page }) => {
    await page.click('testId=value-prop-continue-btn')
    const stepUrl = await page.evaluate(() => document.location.pathname)
    await page.click('testId=answer-choice-a')
    await page.click('testId=submit-answer-btn')

    await visitPage(page, stepUrl)

    await expect(page).toHaveSelector('css=.answer-checked >> testId=answer-choice-a')
    await page.click('testId=answer-choice-b')
    await page.click('testId=submit-answer-btn')

    await visitPage(page, stepUrl)
    await expect(page).toHaveSelector('css=.answer-checked >> testId=answer-choice-b')
})

test('should show word limit error message and disable submit button if response is over 500 words', async ({ page }) => {
    await page.click(`text="${assignmentName}"`)
    await page.click('[data-step-index="3"]')

    await page.fill('testId=free-response-box', faker.lorem.words(510))
    await expect(page).toHaveSelector('text="Maximum 500 words"')
    expect(
        //@ts-ignore
        await page.isDisabled('testId=submit-answer-btn')
    ).toBeTruthy()
})

test('should be able to save question to my practice', async ({ page }) => {
    await page.click('.sticky-table [data-step-index="1"]')
    const saveBtn = await page.waitForSelector('testId=save-practice-button')
    const wasSaved = (await saveBtn.textContent())?.match(/Remove/)
    await saveBtn.click()
    await saveBtn.waitForElementState('enabled')
    expect(await saveBtn.textContent()).toMatch(wasSaved ? 'Save to practice' : 'Remove from practice')
})
