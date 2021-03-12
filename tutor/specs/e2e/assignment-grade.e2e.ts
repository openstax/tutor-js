import { visitPage, setTimeouts, setRole, disableTours, resetState } from './helpers'

describe('Assignment Grade', () => {
    beforeAll(async () => {
        await resetState()
    })

    beforeEach(async () => {
        await setTimeouts()
        await setRole('teacher')
        await visitPage(page, '/course/1/assignment/grade/3')
        await disableTours()
    })

    it('loads and views questions', async () => {
        await expect(page).toHaveSelector('testEl=question-7')
    })

    it('changes focused student once graded', async () => {
        await page.click('testEl=question-1')
        await expect(page).toHaveSelector('testEl=student-answer')
        await page.type('[data-test-id=student-answer] input[name=score]', '0.9')
        await page.type('[data-test-id=student-answer] textarea[name=comment]', 'i like this answer a lot!')
        await page.click('[data-test-id=save-grade-btn]')
        await page.waitForTimeout(100)
        // the currently focused student should have changed and fields reset
        expect(await page.evaluate(() =>
            document.querySelector('[data-test-id=student-answer]')?.getAttribute('data-student-id')
        )).toBeNull()
        expect(await page.evaluate(() =>
            (<HTMLInputElement>document.querySelector('[data-test-id=student-answer] input[name=score]')).value
        )).toBe('')
        expect(await page.evaluate(() =>
            (<HTMLInputElement>document.querySelector('[data-test-id=student-answer] textarea[name=comment]')).value
        )).toBe('')
    })

})
