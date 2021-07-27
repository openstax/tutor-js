import { visitPage, test, expect, findOrCreateTeacherAccount } from './test'


test.describe('Preview Courses', () => {
    test('displays a collapsible side panel that creates a course', async ({ page }) => {
        await findOrCreateTeacherAccount({ page, userName: 'previewteacher' })
        await page.waitForSelector('.tutor-navbar')
        const onOfferingScreen = await page.$('data-test-id=new-teacher-screen')
        if (onOfferingScreen) {
            await page.click('testId=offering-0', { force: true })
            await page.click('testId=show-detail')
            await page.click('testId=create-preview')
        }

        await visitPage(page, '/courses')
        await page.click('testId=preview-course-card')
        await page.click('testId=preview-panel-create-course')
        await expect(page).toHaveSelector('testId=new-course-wizard')
        await expect(page).toHaveSelector('.select-dates')

    })

    test('hides preview panel if the offering is not available for course creation', async ({ page }) => {
        await findOrCreateTeacherAccount({ page, userName: 'previewteacher' })
        await page.waitForSelector('.tutor-navbar')

        await visitPage(page, '/courses')
        await page.click('testId=preview-course-card')
        await page.evaluate(() => {
            window._MODELS.offerings.array.forEach((a:any) => a.is_available = false)
        })
        await expect(page).not.toHaveSelector('testId=side-panel >> testId=preview-panel-create-course')
    })

    test('hides preview panel for real courses and the associated preview course', async ({ page }) => {
        await findOrCreateTeacherAccount({ page, userName: 'teacher01' })

        await visitPage(page, '/courses')
        await page.click('testId=course-card-1')
        await expect(page).not.toHaveSelector('testId=side-panel >> testId=preview-panel-create-course')
        await visitPage(page, '/courses')
        await page.click('testId=preview-course-card')
        await expect(page).not.toHaveSelector('testId=side-panel >> testId=preview-panel-create-course')
    })
})
