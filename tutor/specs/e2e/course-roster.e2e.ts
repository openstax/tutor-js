import { Factory, Mocker, visitPage, setTimeouts } from './helpers'

describe('Course Roster', () => {

    Mocker.mock(page, {
        'DELETE /api/teachers/1': {},

        'GET /api/courses/:id/roster': async ({ mock, params: { id } }) => (
            Factory.create('CourseRoster', { id, course: mock.course(id) })
        ),
    })

    beforeEach(async () => {
        await setTimeouts()
        await visitPage(page, '/course/1/roster')
    })

    it('can remove self from course', async () => {
        await expect(page).toHaveSelector('body') // .teachers-table')
        await expect(page).toHaveSelector('.teachers-table')
        const userId = await page.evaluate(() => window._MODELS.courses.get(1).primaryRole.id)
        await page.click(`tr[data-teacher-id="${userId}"] >> a.remove`)
        await expect(page).toHaveText('.popover-body >> .warning', 'remove yourself')
        await page.click('testEl=remove-confirm-btn')
        await page.waitForNavigation({ url: /courses/ })
    });

})
