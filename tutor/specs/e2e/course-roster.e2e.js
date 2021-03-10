import { visitPage, setTimeouts } from './helpers'

// the BE mock api server is primarily in backend/task-plans

describe('Course Roster', () => {

    beforeEach(async () => {
        await setTimeouts()
        await visitPage(page, '/course/1/roster')

    })

    it('can remove self from course', async () => {
        await expect(page).toHaveSelector('.teachers-table')
        const roleId = await page.evaluate(() => window._MODELS.courses.get(1).primaryRole.id)
        await expect(page).toHaveSelector(`tr[data-teacher-id="${roleId}"]`)
        await page.click(`tr[data-teacher-id="${roleId}"] >> a.remove`)
        await expect(page).toHaveText('.popover-body >> .warning', 'remove yourself')
        await page.click('testEl=remove-confirm-btn')
        await page.waitForNavigation({ url: /courses/ })
    });

})
