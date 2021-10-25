import { keyboardShortcuts, faker, test, visitPage, expect, withUser, disableTours, signTerm } from './test'
import { Page } from '@playwright/test';

const incrementExerciseIdVersion = (selector: string) => {
    const versionString = selector.match(/\d+@\d+/)?.[0];
    if (!versionString) throw new Error('invalid exercise selector')
    const [id, version] = versionString.split('@');
    const newVersionString = id + '@' + (parseInt(version, 10) + 1)
    return selector.replace(versionString, newVersionString);
}

const clickEditExercise = async (page: Page, baseSelector: string) => {
    // make page larger so it doesn't scroll when hovering card controls
    // scrolling will unfocus, making controls unclickable
    await page.setViewportSize({ width: 1280, height: 1600 })
    await page.hover(baseSelector)
    await page.click(`${baseSelector} >> .copyEdit`)
}

const getFirstExerciseContainerWithEditButtonText = async (page: Page, text: string) => {
    await expect(page).toHaveSelector('.openstax-exercise-preview')

    const exId = await page.evaluate((text: string) => {
        const ex = Array.from(document.querySelectorAll('.openstax-exercise-preview')).find(preview => {
            const label = preview.querySelector('.copyEdit .label-message')
            return label && label.textContent === text
        }) as any;

        if (ex) {
            return ex.dataset.exerciseId;
        }
    }, text)

    if (exId) {
        return `.openstax-exercise-preview[data-exercise-id="${exId}"]`
    } else {
        throw new Error('could not find exercise with button text ' + text);
    }
};

const replaceQuestionStemInForm = async (page: Page, newValue: string, initialValue?: string) => {
    const stemSel = '[data-test-id=add-edit-question].modal-dialog >> .question-text >> .editor'

    if (initialValue) {
        await expect(page).toMatchText(stemSel, initialValue)
    }
    await page.click(stemSel)
    await expect(page).toHaveSelector(`${stemSel} >> .isEditing`)
    const editorSel = `${stemSel} >> .pw-prosemirror-editor`
    await page.focus(editorSel)
    //await page.pause();
    await keyboardShortcuts(page).selectAll(editorSel);
    await page.type(editorSel, newValue)

    await page.click('.tag-form button:first-child') // trigger focus blur for validation
};

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

    test.describe('shows terms', () => {

        test.beforeEach(async ({ page }) => {
            await page.route(/terms/, route => route.fulfill({
                status: 200,
                headers: { 'access-control-allow-origin': '*' },
                body: JSON.stringify([{ name: 'exercise_editing', is_signed: false, content: 'i will edit only good things' }]),
            }));

            await page.evaluate(() => {
                const term = (window as any)._MODELS?.user.terms.get('exercise_editing')
                if (term) { term.is_signed = false }
            })
        });

        test('C639439: before copying an exercise', async ({ page }) => {
            const ex = await getFirstExerciseContainerWithEditButtonText(page, 'Copy & Edit');
            await clickEditExercise(page, ex);
            await page.waitForSelector('testId=terms-modal >> [data-is-loaded="true"]')
            await expect(page).toMatchText('testId=terms-modal', /edit only good things/)
            await expect(page).toHaveSelector('button[data-test-id="agree-to-terms"][disabled]')
            await page.click('input.i-agree + label')
            await expect(page).toHaveSelector('button[data-test-id="agree-to-terms"]:not([disabled])')
            await page.click('testId=agree-to-terms')
            await expect(page).not.toHaveSelector('testId=terms-modal')
            const newValue = faker.lorem.sentences()
            await replaceQuestionStemInForm(page, newValue);
            await page.click('testId=publish-btn')
            await expect(page).toMatchText(new RegExp(newValue))
        });

        test('before creating an exercise', async ({ page }) => {
            await page.click('testId=create-question')
            await page.waitForSelector('testId=terms-modal >> [data-is-loaded="true"]')
            await expect(page).toMatchText('testId=terms-modal', /edit only good things/)
            await page.click('input.i-agree + label')
            await page.click('testId=agree-to-terms')
            await expect(page).not.toHaveSelector('testId=terms-modal')
            await page.click('.close')
        });
    });

    test('edits an existing exercise', async ({ page }) => {
        const ex = await getFirstExerciseContainerWithEditButtonText(page, 'Edit');
        const currentValue = await page.$eval(`${ex} .question-stem`, (s: HTMLElement) => s.innerText)
        const newValue = faker.lorem.sentences()
        await clickEditExercise(page, ex);
        await replaceQuestionStemInForm(page, newValue, currentValue)
        await page.click('testId=publish-btn')
        await page.waitForLoadState('networkidle')
        await expect(page).not.toHaveSelector(ex)
        await expect(page).toMatchText(`${incrementExerciseIdVersion(ex)} .question-stem`, newValue)
    })

    test('autosaves', async({ page }) => {
        await page.click('testId=create-question')
        const stemSel = 'testId=add-edit-question >> .question-text >> .editor'
        await page.click(stemSel)
        const editorSel = `${stemSel} >> .pw-prosemirror-editor`
        await page.focus(editorSel)
        await page.type(editorSel, 'Hello World!')
        await page.click('testId=add-edit-question >> .detailed-solution')
        await page.waitForTimeout(0) // Give the autosave time; There's no waitForLocalStorage()
        await page.reload()
        await disableTours(page)
        await page.waitForSelector('testId=create-question')
        await page.evaluate(() => {
            window._MODELS.user.terms.get('exercise_editing').is_signed = true
            window._MODELS.feature_flags.set('tours', false)
        })
        await page.click('testId=create-question')
        await expect(page).toMatchText(
            'testId=add-edit-question >> .question-text', 'QuestionHello World!'
        )
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
        await expect(page).toMatchText(/Question field cannot be empty/)
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
        await expect(page).toMatchText(/Answer key field cannot be empty/)
        await page.click('.close')
    })
})
