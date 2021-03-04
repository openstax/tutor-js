import { visitPage, disableTours, setRole, setTimeouts, SCREENS } from './helpers'
import { forEach } from 'lodash'

describe('Student Dashboard', () => {
    beforeEach(async () => {
        await setRole('student')
        await setTimeouts()
        await visitPage(page, '/course/2');
        await disableTours()
    })

    it('switches tabs', async () => {
        await page.click('testEl=all-past-work-tab')
    });

    //https://github.com/facebook/jest/issues/1619
    forEach(SCREENS, (screen, type) => {
        const [width, height] = screen

        it(`loads assignment with screen width: ${width} and height: ${height}`, async () => {
            await page.setViewportSize({ width, height })
            await page.click('testEl=all-past-work-tab');
            if(type === 'mobile') {
                await page.click(':nth-match(.task.homework a, 1)');
            }
            else {
                await page.click(':nth-match(.task.homework, 1)');
            }
            await expect(page).toHaveSelector('testEl=student-task')
        })
    })


})
