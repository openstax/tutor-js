import { loginAs, visitPage, setTimeouts } from './helpers'

describe('Course Roster', () => {

    beforeEach(async () => {
        await setTimeouts()
        await loginAs('teacher02')
        await visitPage(page, '/course/2/roster')
    })

    it('can remove self from course', async () => {
        await expect(page).toHaveSelector('body')
        await expect(page).toHaveSelector('.teachers-table')
        const userId = await page.evaluate(() => window._MODELS.courses.get(2).primaryRole.id)
        await page.click(`tr[data-teacher-id="${userId}"] >> a.remove`)
        await expect(page).toHaveText('.popover-body >> .warning', 'remove yourself')
        await page.click('testEl=remove-confirm-btn')
        await page.waitForNavigation({ url: /courses/ })
    });

})
