import { visitPage, setTimeouts, loginAs, disableTours } from './helpers'

describe('Add/Edit Questions', () => {

    beforeEach(async () => {
        await setTimeouts()
        await loginAs('reviewteacher')
        await visitPage(page, '/course/1/questions')
        await page.evaluate(() => {
            window.localStorage.clear()
        })
        await page.waitForSelector('[data-tour-region-id="question-library-sections-chooser"]')
        await disableTours(page)
        await page.click('[data-section-id] .tri-state-checkbox')
        await page.click('testEl=show-questions')
    });

    it('shows terms before editing exercise', async () => {
        await page.evaluate(() => {
            window._MODELS.user.terms.get('exercise_editing').is_signed = false
        })
        await page.route(/terms/, route => route.fulfill({
            status: 200,
            headers: { 'access-control-allow-origin': '*' },
            body: JSON.stringify([ { name: 'exercise_editing', is_signed: false, content: 'i will edit only good things' } ]),
        }));
        await page.click('testEl=create-question')
        await page.waitForSelector('testEl=terms-modal >> [data-is-loaded="true"]')
        await expect(page).toHaveText('testEl=terms-modal', 'edit only good things')
        await page.click('input.i-agree + label')
        await page.click('testEl=agree-to-terms')
        await expect(page).not.toHaveSelector('testEl=terms-modal', { timeout: 10 })
        await page.click('.close')
    });

    it('edits an existing exercise', async () => {
        // make page larger so it doesn't scroll when hovering card controls
        // scrolling will unfocus, making controls unclickable
        await page.setViewportSize({ width: 1280, height: 1600 })
        await expect(page).toHaveSelector('.openstax-exercise-preview')
        const exId = await page.$eval('.openstax-exercise-preview' , ex => ex.dataset.exerciseId)
        const ex = `.openstax-exercise-preview[data-exercise-id="${exId}"]`
        const stem = await page.$eval(`${ex} .question-stem`, s => s.innerText)
        // not sure why click with {force: true} doesn't work here
        await page.$eval(`${ex} >> .copyEdit` , cped => cped.click())
        const stemSel = 'testEl=add-edit-question >> .question-text >> .editor'
        await expect(page).toHaveText(stemSel, stem)
        await page.click(stemSel)
        await expect(page).toHaveSelector(`${stemSel} >> .isEditing`)
        const editorSel = `${stemSel} >> .pw-prosemirror-editor`
        await page.focus(editorSel)
        await page.press(editorSel, 'Control+a')
        await page.type(editorSel, 'Hello World!')
        await page.click('.two-step-info') // really just clicking outside editor
        await page.click('testEl=publish-btn')
        await page.waitForTimeout(1000)
    })

    it('autosaves', async() => {
        await page.click('testEl=create-question')
        const stemSel = 'testEl=add-edit-question >> .question-text >> .editor'
        await page.click(stemSel)
        const editorSel = `${stemSel} >> .pw-prosemirror-editor`
        await page.focus(editorSel)
        await page.type(editorSel, 'Hello World!')
        await page.click('testEl=add-edit-question >> .detailed-solution')
        await page.waitForTimeout(10) // Give the autosave time
        await page.reload()
        await disableTours(page)
        await page.waitForSelector('testEl=create-question')
        await page.evaluate(() => {
            window._MODELS.user.terms.get('exercise_editing').is_signed = true
            window._MODELS.feature_flags.set('tours', false)
        })
        await page.click('testEl=create-question')
        await expect(page).toHaveText('testEl=add-edit-question >> .question-text', 'Hello World!')
        await page.click('.close')
    })
})
