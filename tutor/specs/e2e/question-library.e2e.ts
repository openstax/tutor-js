import { visitPage, test, expect, withUser } from './test'

test.describe('Question Library', () => {

    withUser('teacher01')

    test.beforeEach(async ({ page }) => {
        await visitPage(page, '/course/1/questions')
    })

    test('can select a chapter and display questions', async ({ page }) => {
        await page.click('testId=section-chapter-chooser >> [data-section-id="1"] svg')
        await page.click('testId=show-questions')
        await expect(page).toHaveSelector('.exercises-display')
        // all exercises has 'science-practice:modeling' from the test server
        await expect(page).toMatchText('testId=tag-type-lo', /stax-phys/)
    });
})
