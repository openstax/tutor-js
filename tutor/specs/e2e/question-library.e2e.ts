import { visitPage, test, expect } from './test'

test.describe('Question Library', () => {

    test.skip() // FIXME

    test.beforeEach(async ({ page }) => {
        await visitPage(page, '/course/1/questions')
    })

    test('can select a chapter and display questions', async ({ page }) => {
        await page.click('testId=section-chapter-chooser >> [data-chapter-section="1"] button')
        await page.click('testId=show-questions')
        await expect(page).toHaveSelector('.exercises-display')
        // all exercises has 'science-practice:modeling' from the test server
        await expect(page).toMatchText('testId=tag-type-science-practice', /science-practice:modeling/)
    });
})
