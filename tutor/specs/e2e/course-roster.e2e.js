import { visitPage, setTimeouts } from './helpers'

// the BE mock api server is primarily in backend/task-plans

describe('Course Roster', () => {

    beforeEach(async () => {
        await setTimeouts()
    })

    it('can remove self from course', async () => {
        await visitPage(page, '/course/1/roster')
        await expect(page).toHaveSelector('.teachers-table')
        await page.click('tr[data-teacher-id][data-is-self="true"] >> a.remove')
        await expect(page).toHaveText('.popover-body >> .warning', 'remove yourself')
        await page.click('testEl=remove-confirm-btn')
        await page.waitForNavigation({ url: /courses/ })
    });

})
