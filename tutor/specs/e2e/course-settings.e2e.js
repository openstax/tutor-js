import { visitPage, setTimeouts, setRole } from './helpers'

describe('Course Settings', () => {

    beforeEach(async () => {
        await setTimeouts()
        await setRole('teacher')
        await visitPage(page, '/course/1/settings?tab=1')
    })

    it('shows the course settings from with term and dates as ready only', async () => {
        await expect(page).toHaveSelector('.course-detail-settings-form')
        const isTermReadOnly = await page.$eval('#term', el => el.readOnly)
        const isStartDateReadOnly = await page.$eval('#startDate', el => el.readOnly)
        const isEndDateReadOnly = await page.$eval('#endDate', el => el.readOnly)
        expect(isTermReadOnly).toBeTruthy()
        expect(isStartDateReadOnly).toBeTruthy()
        expect(isEndDateReadOnly).toBeTruthy()
    });

    it('shows the save button when course name is changed', async () => {
        await expect(page).toHaveSelector('.course-detail-settings-form')
        await page.fill('#course-name', 'New name')
        await expect(page).toHaveSelector('.save-changes-button')
    });

    it('shows the save button when course code is changed', async () => {
        await expect(page).toHaveSelector('.course-detail-settings-form')
        await page.fill('#course-code', 'NEW-COURSE-CODE')
        await expect(page).toHaveSelector('.save-changes-button')
    });

    it('shows the save button when timezone is changed', async () => {
        await expect(page).toHaveSelector('.course-detail-settings-form')
        const timezoneDropdownTestId = '[data-test-id="timezone-dropdown"]'
        const currentTZ = await page.$eval(timezoneDropdownTestId, el => el.textContent)
        await page.click(`${timezoneDropdownTestId} .dropdown-toggle`, { force: true })
        await page.click(`${timezoneDropdownTestId} .dropdown-menu.show a:nth-child(2)`)
        await expect(page).not.toHaveText(`${timezoneDropdownTestId} .dropdown-toggle div`, currentTZ)
        await expect(page).toHaveSelector('.save-changes-button')
    });

    it.only('shows a warning message in the delete modal if there are any students enrolled in the course', async () => {
        await expect(page).toHaveSelector('.course-detail-settings-form')
        await page.click('testEl=delete-course-btn')
        await expect(page).toHaveSelector('testEl=disabled-delete-course-message')
    });

    it('should save changes, show a success toast and the save button dissapears', async () => {
        await expect(page).toHaveSelector('.course-detail-settings-form')
        const courseName = 'New course name';
        const courseCode = 'NEW-COURSE-CODE';
        const timezone = 'US/Hawaii'

        await page.type('#course-name', courseName)
        await page.type('#course-code', courseCode)

        const timezoneDropdownTestId = '[data-test-id="timezone-dropdown"]'
        await page.click(`${timezoneDropdownTestId} .dropdown-toggle`, { force: true })
        await page.click(`${timezoneDropdownTestId} .dropdown-menu.show a[value="${timezone}"]`)

        await expect(page).toHaveSelector('.save-changes-button')
        await page.click('.save-changes-button')
        await expect(page).toHaveText('[data-test-id="course-settings-published"] .title span', 'Course Settings Saved')  
    });

})
