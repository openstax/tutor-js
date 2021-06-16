import { visitPage, setTimeouts, loginAs, disableTours } from './helpers'

describe('Soc3e Announcement and Launch', () => {

    beforeEach(async () => {
        await setTimeouts()
        await loginAs('reviewteacher')
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

    it('displays a banner on a Sociology 2e dashboard before 3e is available', async () => {
        // Don't display it when Soc3e doesn't exist
        await expect(page).not.toHaveSelector('testEl=sociology-3e-banner', { timeout: 30 })

        // Display it when Soc3e exists but is not yet available
        await page.evaluate(() => {
            const offering = window._MODELS.offerings.get(2)
            offering.os_book_id = offering.SOC3E_BOOK_ID
            offering.is_available = false
        })

        await expect(page).toHaveSelector('testEl=sociology-3e-banner')

        // Don't display it when Soc3e exists and is available
        await page.evaluate(() => {
            window._MODELS.offerings.get(2).is_available = true
        })
        await expect(page).not.toHaveSelector('testEl=sociology-3e-banner')
    })

    it('displays an overlay on a Sociology 2e offering and dashboard when 3e is available', async () => {
        await page.evaluate(() => {
            const offering = window._MODELS.offerings.get(2)
            offering.os_book_id = offering.SOC3E_BOOK_ID
            offering.is_available = true
        })
        await expect(page).toHaveSelector('testEl=sociology-3e-overlay')
        await page.click('testEl=soc3e-close-overlay')
        await expect(page).not.toHaveSelector('testEl=sociology-3e-overlay', { timeout: 10 })
        await page.evaluate(() => {
            const date = new Date()
            date.setDate(date.getDate() - 120)
            window._MODELS.settings.set('soc3eOverlayViewedAt', date)
        })
        await expect(page).toHaveSelector('testEl=sociology-3e-overlay')
    })
})
