import { DateTime } from 'luxon'
import { visitPage, withUser, test, faker, expect } from './test'
const COURSE_ID = 1
const HW = 4
const RD = 2
const GRADABLE=3

const openCalendarButtonCSS = '.oxdt-dropdown:not(.oxdt-dropdown-hidden) button'
const openCalendarCellTodayCSS = '.oxdt-dropdown:not(.oxdt-dropdown-hidden) .oxdt-cell-today'
const openCalendarCellAfterSelectedCellCSS = '.oxdt-dropdown:not(.oxdt-dropdown-hidden) ' +
                                             '.oxdt-cell-selected + .oxdt-cell'

const detailsDueAtCSS = 'testId=details-due-at'
const detailsClosesAtCSS = 'testId=details-closes-at'

const detailsDateTimeFormat = 'ccc, MMM d, h:mm a z' // TimeHelper.HUMAN_DATE_TIME_TZ_FORMAT
const inputDateTimeFormat = 'MMM d | hh:mm a z'
const reviewDateTimeFormat = 'ccc, MMM d\nh:mm a z'

test.describe('Assignment Review', () => {
    test.use({ timezoneId: 'America/Chicago' });

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
        const assignmentName = faker.hacker.phrase()
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
        await page.click(openCalendarCellTodayCSS)
        await page.click(openCalendarButtonCSS)

        await page.click('text="Save & Continue"')

        await page.click('text="Save & Continue"')

        await page.click('text="Publish"')

        await page.waitForSelector(
            `tourRegion=teacher-calendar >> css=.is-published.is-open >> text="${assignmentName}"`
        )

        await page.click(`text="${assignmentName}"`, { position: { x: 33, y: 8 } })

        const oldDueAt = DateTime.fromFormat(
            await page.$eval(
                detailsDueAtCSS, node => (node as HTMLElement).innerText
            ), detailsDateTimeFormat
        )
        const oldClosesAt = DateTime.fromFormat(
            await page.$eval(
                detailsClosesAtCSS, node => (node as HTMLElement).innerText
            ), detailsDateTimeFormat
        )

        await page.click('text="View assignment"')
        await page.click('testId=edit-assignment')

        await page.click('.due-at')
        await page.click(openCalendarCellAfterSelectedCellCSS)
        await page.click(openCalendarButtonCSS)

        await page.click('.closes-at')
        await page.click(openCalendarCellAfterSelectedCellCSS)
        await page.click(openCalendarButtonCSS)

        const timezone = await page.$eval(
            '[data-test-id="timezone"]', node => (node as HTMLElement).innerText
        )

        const dueAtValue = await page.inputValue('.due-at input')
        const dueAtInput = DateTime.fromFormat(dueAtValue + ' ' + timezone, inputDateTimeFormat)

        const closesAtValue = await page.inputValue('.closes-at input')
        const closesAtInput = DateTime.fromFormat(
            closesAtValue + ' ' + timezone, inputDateTimeFormat
        )

        await page.click('text="Save changes"')

        await page.waitForSelector('.modal', { state: 'detached' })

        const dueAtText = await page.$eval(
            '[data-test-id="due-date"]', node => (node as HTMLElement).innerText
        )
        const newDueAt = DateTime.fromFormat(dueAtText, reviewDateTimeFormat)
        const closeAtText = await page.$eval(
            '[data-test-id="close-date"]', node => (node as HTMLElement).innerText
        )
        const newClosesAt = DateTime.fromFormat(closeAtText, reviewDateTimeFormat)

        expect(newDueAt.diff(dueAtInput).milliseconds).toEqual(0)
        expect(newDueAt.diff(oldDueAt).milliseconds).toEqual(86400000)
        expect(newClosesAt.diff(closesAtInput).milliseconds).toEqual(0)
        expect(newClosesAt.diff(oldClosesAt).milliseconds).toEqual(86400000)

        await page.click('testId=delete-assignment')
        await page.click('testId=confirm-delete-assignment')
        await page.waitForSelector('tourRegion=teacher-calendar')
    })

    test.describe('in a different timezone', () => {
        test.use({ timezoneId: 'America/New_York' });

        test('after creating assignment it edits and can delete', async ({ page }) => {
            const assignmentName = faker.hacker.phrase()
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
            await page.click(openCalendarCellTodayCSS)
            await page.click(openCalendarButtonCSS)

            await page.click('text="Save & Continue"')

            await page.click('text="Save & Continue"')

            await page.click('text="Publish"')

            await page.waitForSelector(
                `tourRegion=teacher-calendar >> css=.is-published.is-open >> text="${assignmentName}"`
            )

            await page.click(`text="${assignmentName}"`, { position: { x: 33, y: 8 } })

            const oldDueAt = DateTime.fromFormat(
                await page.$eval(
                    detailsDueAtCSS, node => (node as HTMLElement).innerText
                ), detailsDateTimeFormat
            )
            const oldClosesAt = DateTime.fromFormat(
                await page.$eval(
                    detailsClosesAtCSS, node => (node as HTMLElement).innerText
                ), detailsDateTimeFormat
            )

            await page.click('text="View assignment"')
            await page.click('testId=edit-assignment')

            await page.click('.due-at')
            await page.click(openCalendarCellAfterSelectedCellCSS)
            await page.click(openCalendarButtonCSS)

            await page.click('.closes-at')
            await page.click(openCalendarCellAfterSelectedCellCSS)
            await page.click(openCalendarButtonCSS)

            const timezone = await page.$eval(
                '[data-test-id="timezone"]', node => (node as HTMLElement).innerText
            )

            const dueAtValue = await page.inputValue('.due-at input')
            const dueAtInput = DateTime.fromFormat(dueAtValue + ' ' + timezone, inputDateTimeFormat)

            const closesAtValue = await page.inputValue('.closes-at input')
            const closesAtInput = DateTime.fromFormat(
                closesAtValue + ' ' + timezone, inputDateTimeFormat
            )

            await page.click('text="Save changes"')

            await page.waitForSelector('.modal', { state: 'detached' })

            const dueAtText = await page.$eval(
                '[data-test-id="due-date"]', node => (node as HTMLElement).innerText
            )
            const newDueAt = DateTime.fromFormat(dueAtText, reviewDateTimeFormat)
            const closeAtText = await page.$eval(
                '[data-test-id="close-date"]', node => (node as HTMLElement).innerText // nocheckin testId=
            )
            const newClosesAt = DateTime.fromFormat(closeAtText, reviewDateTimeFormat)

            expect(newDueAt.diff(dueAtInput).milliseconds).toEqual(0)
            expect(newDueAt.diff(oldDueAt).milliseconds).toEqual(86400000)
            expect(newClosesAt.diff(closesAtInput).milliseconds).toEqual(0)
            expect(newClosesAt.diff(oldClosesAt).milliseconds).toEqual(86400000)

            await page.click('testId=delete-assignment')
            await page.click('testId=confirm-delete-assignment')
            await page.waitForSelector('tourRegion=teacher-calendar')
        })
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
        await page.waitForSelector('testId=assignment-edit-fields')
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
