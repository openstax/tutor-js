import { visitPage, setTimeouts } from './helpers'

// the BE mock api server is primarily in backend/exercises and backend/terms

describe('Add/Edit Questions', () => {

  beforeEach(async () => {
    await setTimeouts()
    await visitPage(page, '/course/1/questions')
    await page.waitForSelector('[data-tour-region-id="question-library-sections-chooser"]')
    await page.evaluate(() => {
      window._MODELS.user.terms.get('exercise_editing').is_signed = true;
      window._MODELS.feature_flags.set('tours', false);
    })
    await page.click('[data-section-id] .tri-state-checkbox')
    await page.click('testEl=show-questions')
  });

  it('shows terms before editing exercise', async () => {
    await page.evaluate(() => {
      window._MODELS.user.terms.get('exercise_editing').is_signed = false;
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
  });

  it('edits an existing exercise', async () => {
    // make page larger so it doesn't scroll when hovering card controls
    // scrolling will unfocus, making controls unclickable
    await page.setViewportSize({ width: 1280, height: 1600 })
    await expect(page).toHaveSelector('.openstax-exercise-preview')
    const exId = await page.$eval('.openstax-exercise-preview' , ex => ex.dataset.exerciseId)
    const ex = `.openstax-exercise-preview[data-exercise-id="${exId}"]`
    const stem = await page.$eval(`${ex} .question-stem`, s => s.innerText)
    await page.hover(`${ex} .card-body`)
    await page.click(`${ex} .copyEdit`)
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
  })
})
