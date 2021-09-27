import { test, visitPage, expect, withUser, disableTours, signTerm } from './test'


test.describe('Add/Edit Questions', () => {

    withUser('teacher01')

    test.beforeEach(async ({ page }) => {
        await visitPage(page, '/course/1/questions')
        await signTerm(page, 'exercise_editing')
        await page.evaluate(() => {
            window.localStorage.clear()
        })
        await page.waitForSelector('[data-tour-region-id="question-library-sections-chooser"]')
        await disableTours(page)
        await page.click('[data-section-id] .tri-state-checkbox')
        await page.click('testId=show-questions')
    });

    test('shows terms before editing exercise', async ({ page }) => {
        await page.route(/terms/, route => route.fulfill({
            status: 200,
            headers: { 'access-control-allow-origin': '*' },
            body: JSON.stringify([{ name: 'exercise_editing', is_signed: false, content: 'i will edit only good things' }]),
        }));

        await page.evaluate(() => {
            const term = (window as any)._MODELS?.user.terms.get('exercise_editing')
            if (term) { term.is_signed = false }
        })
        await page.click('testId=create-question')
        await page.waitForSelector('testId=terms-modal >> [data-is-loaded="true"]')
        await expect(page).toHaveText('testId=terms-modal', 'edit only good things')
        await page.click('input.i-agree + label')
        await page.click('testId=agree-to-terms')
        await expect(page).not.toHaveSelector('testId=terms-modal')
        await page.click('.close')
    });

    test('edits an existing exercise', async ({ page }) => {
        // make page larger so it doesn't scroll when hovering card controls
        // scrolling will unfocus, making controls unclickable
        //await page.setViewportSize({ width: 1280, height: 1600 })
        await expect(page).toHaveSelector('.openstax-exercise-preview')
        const exId = await page.$eval('.openstax-exercise-preview' , ex => ex.dataset.exerciseId)
        const ex = `.openstax-exercise-preview[data-exercise-id="${exId}"]`
        const stem = await page.$eval(`${ex} .question-stem`, (s: HTMLElement) => s.innerText)
        // not sure why click with {force: true} doesn't work here
        await page.$eval(`${ex} >> .copyEdit` , (cped: HTMLElement) => cped.click())
        const stemSel = 'testId=add-edit-question >> .question-text >> .editor'
        await expect(page).toHaveText(stemSel, stem)
        await page.click(stemSel)
        await expect(page).toHaveSelector(`${stemSel} >> .isEditing`)
        const editorSel = `${stemSel} >> .pw-prosemirror-editor`
        await page.focus(editorSel)
        await page.press(editorSel, 'Control+a')
        await page.type(editorSel, 'Hello World!')
        await page.click('.tag-form button:first-child') // trigger focus blur for validation
        await page.click('testId=publish-btn')
        await page.waitForTimeout(1000)
    })

    test('autosaves', async({ page }) => {
        await page.click('testId=create-question')
        const stemSel = 'testId=add-edit-question >> .question-text >> .editor'
        await page.click(stemSel)
        const editorSel = `${stemSel} >> .pw-prosemirror-editor`
        await page.focus(editorSel)
        await page.type(editorSel, 'Hello World!')
        await page.click('testId=add-edit-question >> .detailed-solution')
        await page.waitForTimeout(10) // Give the autosave time
        await page.reload()
        await disableTours(page)
        await page.waitForSelector('testId=create-question')
        await page.evaluate(() => {
            window._MODELS.user.terms.get('exercise_editing').is_signed = true
            window._MODELS.feature_flags.set('tours', false)
        })
        await page.click('testId=create-question')
        await expect(page).toHaveText('testId=add-edit-question >> .question-text', 'Hello World!')
        await page.click('.close')
    })

    test('requires Question to be present', async ({ page }) => {
        await page.click('testId=create-question')
        await page.click('testId=switch-wrm')
        const stemSel = 'testId=add-edit-question >> .question-text >> .editor'
        await page.click(stemSel)
        let editorSel = `${stemSel} >> .pw-prosemirror-editor`
        await page.focus(editorSel)
        await page.press(editorSel, 'Control+a')
        await page.press(editorSel, 'Backspace')
        await page.click('.tag-form button:first-child') // trigger focus blur for validation
        await expect(page).toHaveText('Question field cannot be empty')
        await page.click('.close')
    })

    test('requires Answer Key to be present for WRMs', async ({ page }) => {
        await page.click('testId=create-question')
        await page.click('testId=switch-wrm')
        const stemSel = 'testId=add-edit-question >> .question-text >> .editor'
        await page.click(stemSel)
        let editorSel = `${stemSel} >> .pw-prosemirror-editor`
        await page.focus(editorSel)
        await page.type(editorSel, 'Hello World!')
        const solutionSel = 'testId=add-edit-question >> .question-answer-key >> .editor'
        await page.click(solutionSel)
        editorSel = `${solutionSel} >> .pw-prosemirror-editor`
        await page.focus(editorSel)
        await page.press(editorSel, 'Control+a')
        await page.press(editorSel, 'Backspace')
        await page.click('.tag-form button:first-child') // trigger focus blur for validation
        await expect(page).toHaveText('Answer key field cannot be empty')
        await page.click('.close')
    })
})
