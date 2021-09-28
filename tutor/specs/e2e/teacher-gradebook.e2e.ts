import { visitPage, test, expect, withUser, deleteText } from './test'


test.describe('Teacher Gradebook', () => {

    test.skip()

    withUser('teacher01')

    test.beforeEach(async ({ page }) => {
        await visitPage(page, '/course/1/gradebook')
    });

    test('loads and views grades', async ({ page }) => {
        await expect(page).toHaveText('testId=page-title', 'Gradebook')
    })

    test('switches tabs', async ({ page }) => {
        await page.click('testId=tabs')
    })

    test('searches', async ({ page }) => {
        await page.type('testId=search-by-name-input', 'horse with no name')
        await expect(page).not.toHaveSelector('testId=student-name')
        await deleteText(page, 'testId=search-by-name-input')
        //need to add a timeout so it waits for the table to be filtered
        await expect(page).toHaveSelector('testId=student-name')
    })

    test('sets preferences', async ({ page }) => {
        await page.click('testId=settings-btn')
        const settings = ['displayScoresAsPoints', 'arrangeColumnsByType','showDroppedStudents']
        await page.click(`testId=${settings[0]}-checkbox`)
        await page.click(`testId=${settings[1]}-checkbox`)
        await page.click(`testId=${settings[2]}-checkbox`)
    })
})
