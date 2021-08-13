import { test, visitPage, expect, withUser, disableTours } from './test'

test.describe('Soc3e Announcement and Launch', () => {

    withUser('teacher01')

    test.beforeEach(async ({ page }) => {

        await visitPage(page, '/course/1')
        await page.waitForSelector('css=.course-page')
        await disableTours(page)
        await page.evaluate(() => {
            const offering = window._MODELS.courses.get(1).offering
            offering.os_book_id = offering.SOC2E_BOOK_ID
            offering.appearance_code = 'intro_sociology'
            window._MODELS.offerings.get(2).os_book_id = ''
            window._MODELS.offerings.get(2).is_available = false
            window._MODELS.settings.set('soc3eBannerDismissed', null)
            window._MODELS.settings.set('soc3eOverlayViewedAt', null)
        })
    })

    test('displays an overlay on a Sociology 2e offering and dashboard when 3e is available', async ({ page }) => {
        await page.evaluate(() => {
            const offering = window._MODELS.offerings.get(2)
            offering.os_book_id = offering.SOC3E_BOOK_ID
            offering.is_available = true
        })
        await expect(page).toHaveSelector('testId=sociology-3e-overlay')
        await page.click('testId=soc3e-close-overlay')
        await expect(page).not.toHaveSelector('testId=sociology-3e-overlay', { timeout: 100 })
        await page.evaluate(() => {
            const date = new Date()
            date.setDate(date.getDate() - 120)
            window._MODELS.settings.set('soc3eOverlayViewedAt', date)
        })
        await expect(page).toHaveSelector('testId=sociology-3e-overlay')
    })
})
