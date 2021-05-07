import { Mocker, visitPage, setTimeouts } from './helpers'

xdescribe('Question Library', () => {

    Mocker.mock({
        page,
        routes: {},
    })

    beforeEach(async () => {
        await setTimeouts()
        await visitPage(page, '/course/1/questions')
    })

    it('can select a chapter and display questions', async () => {
        await page.click('testEl=section-chapter-chooser >> [data-chapter-section="1"] button')
        await page.click('testEl=show-questions')
        await expect(page).toHaveSelector('.exercises-display')
        // all exercises has 'science-practice:modeling' from the test server
        await expect(page).toHaveText('testEl=tag-type-science-practice', 'science-practice:modeling')
    });
})
