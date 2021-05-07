import { visitPage, setTimeouts, findOrCreateTeacherAccount } from './helpers'

describe('Preview Courses', () => {
    beforeAll(async () => {
        await findOrCreateTeacherAccount({ page, userName: 'previewteacher' })

        await page.waitForSelector('.tutor-navbar')
        const onOfferingScreen = await page.$('data-test-id=new-teacher-screen')
        if (onOfferingScreen) {
            await page.click('testEl=offering-0', { force: true })
            await page.click('testEl=show-detail')
            await page.click('testEl=create-preview')
        }
    })

    beforeEach(async () => {
        await setTimeouts()
    })

    it('displays a collapsible side panel that creates a course', async () => {
        await visitPage(page, '/courses')
        await page.click('testEl=preview-course-card=1')
        await page.click('testEl=preview-panel-create-course')
        await expect(page).toHaveSelector('testEl=new-course-wizard')
        await expect(page).toHaveSelector('.select-dates')
    })

    it('hides preview panel for non-preview courses', async () => {
        await visitPage(page, '/courses')
        await page.click('testEl=preview-course-card=1')

        await page.goBack()
        await page.evaluate(() => {
            window._MODELS.offerings.array.forEach((a:any) => a.is_available = false)
        })
        await page.goForward()

        await expect(page).not.toHaveSelector('testEl=side-panel >> testEl=preview-panel-create-course', { timeout: 100 })
    })

    it('hides preview panel for non-available offerings', async () => {
        await visitPage(page, '/courses')
        await page.click('testEl=preview-course-card=1')

        await page.goBack()
        await page.evaluate(() => {
            window._MODELS.courses.array[0].offering.is_preview_available = false
        })
        await page.goForward()
        await expect(page).not.toHaveSelector('testEl=side-panel >> testEl=preview-panel-create-course', { timeout: 100 })
    })
})
