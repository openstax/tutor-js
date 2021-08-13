import { visitPage, test, expect, loaderNotVisible, findOrCreateTeacherAccount } from './test'


test.describe('Preview Courses', () => {

    test.skip() // FIXME

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext()
        const page = await context.newPage()
        await findOrCreateTeacherAccount({ page, userName: 'previewteacher' })
        await page.waitForSelector('.tutor-navbar')
        const onOfferingScreen = await page.$('data-test-id=new-teacher-screen')
        if (onOfferingScreen) {
            await page.click('testId=offering-0', { force: true })
            await page.click('testId=show-detail')
            await page.click('testId=create-preview')
        }
    })

    test('displays a collapsible side panel that creates a course', async ({ page }) => {
        await visitPage(page, '/courses')
        await page.click('testId=preview-course-card')
        await page.click('testId=preview-panel-create-course')
        await expect(page).toHaveSelector('testId=new-course-wizard')
        await expect(page).toHaveSelector('.select-dates')
    })

    test('hides preview panel for non-preview courses', async ({ page }) => {
        await visitPage(page, '/courses')
        await page.click('testId=preview-course-card')

        await page.goBack()
        await page.evaluate(() => {
            window._MODELS.offerings.array.forEach((a:any) => a.is_available = false)
        })
        await page.goForward()

        await expect(page).not.toHaveSelector('testId=side-panel >> testId=preview-panel-create-course', { timeout: 100 })
    })

    test('hides preview panel for non-available offerings', async ({ page }) => {
        await visitPage(page, '/courses')
        await page.click('testId=preview-course-card')
        await page.goBack()
        await page.evaluate(() => {
            window._MODELS.offerings.array.forEach((a:any) => a.is_preview_available = false)
        })
        await page.goForward()
        await loaderNotVisible()
        await expect(page).not.toHaveSelector('testId=side-panel >> testId=preview-panel-create-course', { timeout: 100 })
    })
})
