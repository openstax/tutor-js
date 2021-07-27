import { visitPage, withUser, expect, test, disableTours } from './test';


withUser('teacher02')

test.describe('without any students', () => {
    test('deletes, then redirects to my-courses', async ({ page }) => {
        await visitPage(page, '/courses')
        await page.click('testId=create-course')
        await page.click('[role=button].choice')
        await page.click('testId=next-btn')
        await page.click('testId=next-btn')
        await page.click('testId=next-btn')

        await page.fill('#number-students', '1')
        await page.click('testId=next-btn')


        await page.waitForSelector('.course-page')
        disableTours(page)

        await page.click('#actions-menu')
        await page.click('[data-item=courseSettings]')
        await page.pause()

        await page.click('testId=course-details-tab')
        await expect(page).toHaveSelector('.course-detail-settings-form')
        const courseName = page.$eval('input#course-name', (el: any) => el.value)
        await page.click('testId=delete-course-btn')
        await expect(page).toMatchText('testId=delete-course-message', /delete/)
        await expect(page).not.toHaveSelector('testId=disabled-delete-course-message-warning', { timeout: 100 })
        await page.click('testId=confirm-delete-btn')
        await expect(page).toHaveSelector('testId=existing-teacher-screen')
        expect(
            await page.evaluate(() => document.location.pathname)
        ).toEqual('/courses')
        await expect(page).not.toHaveSelector(`testId=course-card >> text=${courseName}`, { timeout: 100 })
    });
})

test.describe('with students', () => {

    test.beforeEach(async ({ page }) => {
        await visitPage(page, '/course/2/settings?tab=1')
    })

    test('shows the course settings from with term and dates as ready only', async ({ page }) => {
        await expect(page).toHaveSelector('.course-detail-settings-form')
        const isTermReadOnly = await page.$eval('#term', (el: any) => el.readOnly)
        const isStartDateReadOnly = await page.$eval('#startDate', (el: any) => el.readOnly)
        const isEndDateReadOnly = await page.$eval('#endDate', (el: any) => el.readOnly)
        expect(isTermReadOnly).toBeTruthy()
        expect(isStartDateReadOnly).toBeTruthy()
        expect(isEndDateReadOnly).toBeTruthy()
    })

    test('shows the save button when course name is changed', async ({ page }) => {
        await expect(page).toHaveSelector('.course-detail-settings-form')
        await page.fill('#course-name', 'New name')
        await expect(page).toHaveSelector('.save-changes-button')
    })

    test('shows the save button when course code is changed', async ({ page }) => {
        await expect(page).toHaveSelector('.course-detail-settings-form')
        await page.fill('#course-code', 'NEW-COURSE-CODE')
        await expect(page).toHaveSelector('.save-changes-button')
    })

    test('shows the save button when timezone is changed', async ({ page }) => {
        await expect(page).toHaveSelector('.course-detail-settings-form')
        const timezoneDropdownTestId = '[data-test-id="timezone-dropdown"]'
        const currentTZ = await page.$eval(timezoneDropdownTestId, el => el.textContent) || ''
        await page.click(`${timezoneDropdownTestId} .dropdown-toggle`, { force: true })
        await page.click(`${timezoneDropdownTestId} .dropdown-menu.show a:nth-child(2)`)
        await expect(page).not.toMatchText(`${timezoneDropdownTestId} .dropdown-toggle div`, RegExp(currentTZ), { timeout: 100 })
        await expect(page).toHaveSelector('.save-changes-button')
    })

    test('shows a warning message in the delete modal if there are any students enrolled in the course', async ({ page }) => {
        await expect(page).toHaveSelector('.course-detail-settings-form')
        await page.click('testId=delete-course-btn')
        await expect(page).toHaveSelector('testId=disabled-delete-course-message-warning')
        await expect(page).toMatchText('testId=delete-course-message', /leave/)
        await page.click('button.close')
    })

    test('should save changes, show a success toast and the save button disapears', async ({ page }) => {

        await expect(page).toHaveSelector('.course-detail-settings-form')
        const courseName = 'New course name';
        const courseCode = 'NEW-COURSE-CODE';
        const timezone = 'US/Hawaii'
        const originalName = await page.$eval('#course-name', (el:HTMLInputElement) => el.value)

        await page.fill('#course-name', courseName)
        await page.fill('#course-code', courseCode)

        const timezoneDropdownTestId = '[data-test-id="timezone-dropdown"]'
        await page.click(`${timezoneDropdownTestId} .dropdown-toggle`, { force: true })
        await page.click(`${timezoneDropdownTestId} .dropdown-menu.show a[value="${timezone}"]`)

        await expect(page).toHaveSelector('.save-changes-button')
        await page.click('text="Save changes"')
        await expect(page).toMatchText('[data-test-id="course-settings-published"] .title span', /Course Settings Saved/)

        // IMPORTANT - restore original values so other tests are not confused
        await page.fill('#course-name', originalName)
        await page.fill('#course-code', '')
        await page.click(`${timezoneDropdownTestId} .dropdown-toggle`, { force: true })
        await page.click('text="US/Central"')
        await page.click('text="Save changes"')
    })

})
