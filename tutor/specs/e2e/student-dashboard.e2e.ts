import { visitPage, test, expect, withUser, disableTours, screenSizes } from './test'

test.describe('Student Dashboard', () => {
    test.skip()

    withUser('reviewstudent1')

    test.beforeEach(async ({ page }) => {
        await visitPage(page, '/course/1')
        disableTours(page)
    })

    test('switches tabs', async ({ page }) => {
        await page.click('testId=all-past-work-tab')
    })

    test('loads assignment', async ({ page }) => {
        for await (const screen of screenSizes(page)) {
            await page.click('testId=all-past-work-tab')
            if(screen === 'mobile') {
                await page.click(':nth-match(.task.homework a, 1)')
            }
            else {
                await page.click(':nth-match(.task.homework, 1)')
            }
            await expect(page).toHaveSelector('testId=student-task')
        }
    })

})
