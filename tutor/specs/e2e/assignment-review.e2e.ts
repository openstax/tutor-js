import { DateTime } from 'luxon'
import { visitPage, withUser, test, faker, expect } from './test'
const COURSE_ID = 1
const HW = 4
const RD = 2
const GRADABLE=3

test.describe('Assignment Review', () => {

    withUser('teacher01')

    test('loads and views feedback', async ({ page }) => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${GRADABLE}`)
        await page.click('testId=submission-overview-tab')
        await expect(page).toHaveSelector('testId=student-free-responses')
    });

    test('loads and views scores', async ({ page }) => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${HW}`)
        await page.click('testId=assignment-scores-tab')
        await expect(page).toHaveSelector('testId=scores')
    });

    test('can grade WRM', async ({ page }) => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${GRADABLE}`)
        await page.click('testId=submission-overview-tab')
        await page.click('testId=grade-answers-btn')
        await page.click('testId=question-1')
        await page.click('testId=expand-graded')

        await page.fill('input[name="score"]', String(Math.round((Math.random() * 100))/100))
        await page.fill('textarea[name="comment"]', faker.company.bsBuzz())
        const saveBtn = await page.$('testId=save-grade-btn')
        await saveBtn!.click()
        await saveBtn!.waitForElementState('disabled')
    });

    test('can drop questions', async ({ page }) => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${HW}`)
        await page.click('testId=submission-overview-tab')
        await page.click('testId=drop-question')
        await page.waitForSelector('testId=drop-questions-modal')
    })

    test('can render grading template preview', async ({ page }) => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${HW}`)
        await expect(page).not.toHaveSelector('testId=grading-template-card', { timeout: 100 })
        await page.click('testId=preview-card-trigger')
        await expect(page).toHaveSelector('testId=grading-template-card')
    });

    test('after creating assignment it edits and can delete', async ({ page }) => {
        const assignmentName  = faker.hacker.phrase()
        await visitPage(page, `/course/${COURSE_ID}/assignment/edit/reading/new`)
        await page.fill('testId=edit-assignment-name', assignmentName)
        await page.click('text="Save & Continue"')
        await page.click('text="Problem-Solving Strategies"')
        await page.click('text="Save & Continue"')
        await page.click('text="Save as Draft"')

        await page.waitForSelector(`tourRegion=teacher-calendar >> text="${assignmentName}"`)

        await page.click(`text="${assignmentName}"`, { position: { x: 33, y: 8 } })
        await page.waitForSelector('.tasking-date-time')

        await page.waitForSelector('tourRegion=reading-assignment-editor')
        expect(
            await page.evaluate(() => document.location.pathname)
        ).toMatch(/assignment\/edit\/reading/)

        await page.click('.opens-at')
        await page.click('.oxdt-dropdown:not(.oxdt-dropdown-hidden) .oxdt-cell-today')
        await page.click('.oxdt-dropdown:not(.oxdt-dropdown-hidden) button')

        const inputFormat = 'MMM d | hh:mm a z'
        const timezone = await page.$eval('.timezone', node => (node as HTMLElement).innerText)
        const opensAtValue = await page.inputValue('.opens-at input')
        const opensAtInput = DateTime.fromFormat(opensAtValue + ' ' + timezone, inputFormat)

        await page.click('text="Save & Continue"')

        await page.click('text="Save & Continue"')

        await page.click('text="Publish"')

        await page.waitForSelector(
            `tourRegion=teacher-calendar >> css=.is-published.is-open >> text="${assignmentName}"`
        )

        await page.click(`text="${assignmentName}"`, { position: { x: 33, y: 8 } })

        const detailsFormat = 'ccc, MMM d, h:mm a z' // TimeHelper.HUMAN_DATE_TIME_TZ_FORMAT
        const oldOpensAt = DateTime.fromFormat(
            await page.$eval(
                '.tasking-date-time.row + .tasking-date-time.row .opens-at',
                node => (node as HTMLElement).innerText
            ), detailsFormat
        )
        const oldDueAt = DateTime.fromFormat(
            await page.$eval(
                '.tasking-date-time.row + .tasking-date-time.row .due-at',
                node => (node as HTMLElement).innerText
            ), detailsFormat
        )
        const oldClosesAt = DateTime.fromFormat(
            await page.$eval(
                '.tasking-date-time.row + .tasking-date-time.row .closes-at',
                node => (node as HTMLElement).innerText
            ), detailsFormat
        )

        await page.click('text="View assignment"')
        await page.click('testId=edit-assignment')

        await page.click('.due-at')
        await page.click(
            '.oxdt-dropdown:not(.oxdt-dropdown-hidden) .oxdt-cell-selected + .oxdt-cell'
        )
        await page.click('.oxdt-dropdown:not(.oxdt-dropdown-hidden) button')

        await page.click('.closes-at')
        await page.click(
            '.oxdt-dropdown:not(.oxdt-dropdown-hidden) .oxdt-cell-selected + .oxdt-cell'
        )
        await page.click('.oxdt-dropdown:not(.oxdt-dropdown-hidden) button')

        const dueAtValue = await page.inputValue('.due-at input')
        const dueAtInput = DateTime.fromFormat(dueAtValue + ' ' + timezone, inputFormat)

        const closesAtValue = await page.inputValue('.closes-at input')
        const closesAtInput = DateTime.fromFormat(closesAtValue + ' ' + timezone, inputFormat)

        await page.click('text="Save changes"')

        await page.waitForSelector('.modal', { state: 'detached' })

        const reviewFormat = 'ccc, MMM d\nh:mma z'
        const dueAtText = await page.$eval('.due-date', node => (node as HTMLElement).innerText)
        const newDueAt = DateTime.fromFormat(dueAtText + ' ' + timezone, reviewFormat)
        const closeAtText = await page.$eval('.close-date', node => (node as HTMLElement).innerText)
        const newClosesAt = DateTime.fromFormat(closeAtText + ' ' + timezone, reviewFormat)

        expect(newDueAt.diff(dueAtInput).milliseconds).toEqual(0)
        expect(newDueAt.diff(oldDueAt).milliseconds).toEqual(86400000)
        expect(newClosesAt.diff(closesAtInput).milliseconds).toEqual(0)
        expect(newClosesAt.diff(oldClosesAt).milliseconds).toEqual(86400000)

        await page.click('testId=delete-assignment')
        await page.click('testId=confirm-delete-assignment')
        await page.waitForSelector('tourRegion=teacher-calendar')
    })


    test('renders appropriate template and grading blocks for plan types', async ({ page }) => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${HW}`)
        await expect(page).toMatchText('testId=grading-template-name', /Homework/)

        await visitPage(page, `/course/1/assignment/review/${RD}`)
        await expect(page).toMatchText('testId=grading-template-name', /Reading/)
    });


    test('hides overview and scores tabs if not reading or homework', async ({ page }) => {
        // Homework
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${HW}`)
        await expect(page).toHaveSelector('testId=submission-overview-tab')
        await expect(page).toHaveSelector('testId=assignment-scores-tab')

        // Reading
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${RD}`)
        await expect(page).toHaveSelector('testId=submission-overview-tab')
        await expect(page).toHaveSelector('testId=assignment-scores-tab')

        // TODO add these types
        // External
        // await visitPage(page, `/course/${COURSE_ID}/assignment/review/4`)
        // await expect(page).not.toHaveSelector('testId=submission-overview-tab', { timeout: 100 })
        // await expect(page).toHaveSelector('testId=assignment-scores-tab')

        // // Event
        // await visitPage(page, '/course/1/assignment/review/5')
        // await expect(page).not.toHaveSelector('testId=submission-overview-tab', { timeout: 100 })
        // await expect(page).not.toHaveSelector('testId=assignment-scores-tab', { timeout: 100 })
    });

    test('cannot deselect sections', async ({ page }) => {
        await visitPage(page, `/course/1/assignment/review/${HW}`)
        await page.click('testId=edit-assignment')
        await page.click('testId=select-sections', { force: true })
        await page.hover('testId=tasking >> css=[data-icon="check-square"]')
        await expect(page).toMatchText('css=[role=tooltip]', /cannot withdraw/)
    });

    test('should go directly to the submission overview tab', async ({ page }) => {
        await visitPage(page, `/course/1/assignment/review/${GRADABLE}?tab=1`)
        await expect(page).toHaveSelector('testId=overview')
        await expect(page).toHaveSelector('testId=student-free-responses')
    });

    test('should go directly to the assignment scores tab', async ({ page }) => {
        await visitPage(page, `/course/1/assignment/review/${HW}?tab=2`)
        await expect(page).toHaveSelector('testId=scores')
    });

    test('should hide the student names', async ({ page }) => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${GRADABLE}`)
        await page.click('testId=submission-overview-tab')
        // names are shown first, so button label is "Hide student names"
        await expect(page).toMatchText('testId=names-toogle-button', /Hide student names/)
        await expect(page).toHaveSelector('testId=wrq-response-student-name')
        await page.click('testId=names-toogle-button')
        await expect(page).toMatchText('testId=names-toogle-button', /Show student names/)
        await expect(page).toMatchText('testId=wrq-response-student-name', /Student response/)
    });
});
