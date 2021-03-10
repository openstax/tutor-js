import { visitPage, setRole, setTimeouts } from './helpers'

// the BE mock api server is primarily in backend/task-plans

describe('Course Roster', () => {

    beforeEach(async () => {
        await setTimeouts()
        await setRole('teacher')
    })

    it('can remove self from course', async () => {
        // await modifyBootstrapData(page, (data) => {
        //     Object.assign(data.courses.find(c => c.id == 1).roles[0], { id: 1, type: 'teacher' })
        //     return data
        // })
        await visitPage(page, '/course/1/roster')
        await expect(page).toHaveSelector('.teachers-table')
        const teach = await page.$$('tr[data-teacher-id]')
        teach.forEach(async e => {
            // eslint-disable-next-line
            console.log(
                await e.getAttribute('data-is-self'),
                await e.getAttribute('data-teacher-id'),
            )
        })

        await page.click('tr[data-teacher-id][data-is-self="true"] >> a.remove')
        await expect(page).toHaveText('.popover-body >> .warning', 'remove yourself')
        await page.click('testEl=remove-confirm-btn')
        await page.waitForNavigation({ url: /courses/ })
    });

})
