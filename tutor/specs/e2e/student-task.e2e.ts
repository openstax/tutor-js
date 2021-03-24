import faker from 'faker'
import { visitPage, Mocker, setTimeouts, selectAnswer } from './helpers'

describe('Student Tasks', () => {

    Mocker.mock({
        page,
        options: { is_teacher: false },
        routes: {},
    })
    beforeEach(async () => {
        await setTimeouts()
    });

    const longFreeResponseAnswer = faker.lorem.words(510);

    it('advances after answering a free-response only question', async () => {
        await visitPage(page, '/course/1/task/3') // task id 3 is a hardcoded WRM task
        await page.evaluate(() => {
            window._MODELS.feature_flags.set('tours', false);
        })
        await page.click('.icon-instructions')
        await expect(page).toHaveSelector('testEl=homework-instructions')
        await page.click('testEl=value-prop-continue-btn')
        await expect(page).toHaveSelector('testEl=student-free-response')
        await page.type('testEl=free-response-box', 'this is a answer answering and fully explaining my reasoning for the question')
        await page.click('testEl=submit-answer-btn')
        expect(await page.evaluate(() => document.location.pathname)).toContain('/course/1/task/3/step')
        
    })

    it('can change and re-submit answers to questions', async () => {
        await visitPage(page, '/course/1/task/2')
        await page.evaluate(() => {
            window._MODELS.feature_flags.set('tours', false);
        })
        await page.click('.sticky-table [data-step-index="4"]')
        const stepUrl = await page.evaluate(() => document.location.pathname)
        await selectAnswer(page, 'b', 'why do i need to fill this out?')
        // go back and resubmit
        await visitPage(page, stepUrl)
        await expect(page).toHaveSelector('css=.answer-checked >> testEl=answer-choice-b')
        await page.click('testEl=answer-choice-c')
        await expect(page).toHaveSelector('css=.answer-checked >> testEl=answer-choice-c')
        await page.click('testEl=submit-answer-btn')
        await page.click('testEl=continue-btn')
    })
  
    it('should show late clock icon and the late points info, if task step is late', async () => {
        await visitPage(page, '/course/1/task/4')
        await page.evaluate(() => {
            window._MODELS.feature_flags.set('tours', false);
        })
        await expect(page).toHaveSelector('testEl=late-icon')
        await page.hover(':nth-match(.isLateCell, 1)')
        await expect(page).toHaveSelector('testEl=late-info-points-table')
    })

    it('should show word limit error message and disable submit button if response is over 500 words', async () => {
        await visitPage(page, '/course/1/task/3') // task id 3 is a hardcoded WRM task
        await page.evaluate(() => {
            window._MODELS.feature_flags.set('tours', false);
        })
        await expect(page).toHaveSelector('testEl=student-free-response')
        await page.type('testEl=free-response-box', longFreeResponseAnswer, { timeout: 30000 })
        await expect(page).toHaveSelector('.word-limit-error-info')
        expect(
            //@ts-ignore
            await page.isDisabled('testEl=submit-answer-btn')
        ).toBeTruthy()
    })

    it('should be able to save question to my practice', async () => {
        await visitPage(page, '/course/1/task/2') 
        await page.evaluate(() => {
            window._MODELS.feature_flags.set('tours', false);
        })
        await page.click('.sticky-table [data-step-index="3"]')
        // start fresh - deleting the practice questions from course
        await page.evaluate(() => {
            window._MODELS.courses.get(1).practiceQuestions.clear()
        })

        await page.type('css=.exercise-step >> testEl=free-response-box', 'why do i need to fill this out?')
        await page.click('testEl=submit-answer-btn')
        await expect(page).toHaveSelector('testEl=save-practice-button')
        await expect(page).toHaveText('testEl=save-practice-button', 'Save to practice')
    })
})
