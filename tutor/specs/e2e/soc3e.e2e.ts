import { visitPage, setTimeouts, loginAs, disableTours } from './helpers'

describe('Soc3e Announcement and Launch', () => {

    beforeEach(async () => {
        await setTimeouts()
        await loginAs('reviewteacher')
        await visitPage(page, '/course/1')
        await page.waitForNavigation()
        await disableTours(page)
        await page.evaluate(() => {
            const offering = window._MODELS.courses.get(1).offering
            offering.os_book_id = offering.SOC2E_BOOK_ID
            offering.appearance_code = 'intro_sociology'
            window._MODELS.settings.set('soc3eBannerDismissed', null)
        })
    })

    it('displays a banner on a Sociology 2e dashboard before 3e is available', async () => {
        // Don't display it when Soc3e doesn't exist
        await expect(page).not.toHaveText('Introduction to Sociology 3e')

        // Display it when Soc3e exists but is not yet available
        await page.evaluate(() => {
            const offering = window._MODELS.offerings.get(2)
            offering.os_book_id = offering.SOC3E_BOOK_ID
            offering.is_available = false
        })

        await expect(page).toHaveText('Introduction to Sociology 3e')

        // Don't display it when Soc3e exists and is available
        await page.evaluate(() => {
            window._MODELS.offerings.get(2).is_available = true
        })
        await expect(page).not.toHaveText('Introduction to Sociology 3e')
    })
})
