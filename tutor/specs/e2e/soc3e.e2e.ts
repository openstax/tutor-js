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
        })
    })

    it('displays a banner on a Sociology 2e dashboard before 3e is available', async () => {
        await expect(page).toHaveText('Introduction to Sociology 3e')
    })

    it('does not display a banner after 3e is available', async () => {
        await page.evaluate(() => {
            const offering = window._MODELS.offerings.get(2)
            offering.os_book_id = offering.SOC3E_BOOK_ID
        })
        await expect(page).not.toHaveText('Introduction to Sociology 3e')
    })

})
