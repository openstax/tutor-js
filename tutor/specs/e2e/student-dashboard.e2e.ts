import { visitPage, disableTours, setRole, setTimeouts, withScreenSize } from './helpers'

describe('Student Dashboard', () => {
    beforeEach(async () => {
        await setRole('student')
        await setTimeouts()
        await visitPage(page, '/course/2')
        await disableTours()
    })

    it('switches tabs', async () => {
        await page.click('testEl=all-past-work-tab')
    });

    withScreenSize('loads assignment', async (screen) => {
        await page.click('testEl=all-past-work-tab')
        if(screen === 'mobile') {
            await page.click(':nth-match(.task.homework a, 1)')
        }
        else {
            await page.click(':nth-match(.task.homework, 1)')
        }
        await expect(page).toHaveSelector('testEl=student-task')
    })

})
