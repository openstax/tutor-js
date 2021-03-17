import faker from 'faker'
import { visitPage, setRole, setTimeouts } from './helpers'

describe('Student Tasks', () => {

    beforeEach(async () => {
        await page.setViewportSize({ width: 1200, height: 720 })
        await setTimeouts()
        setRole('student')
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

    it.only('can change and re-submit answers to questions', async () => {
        await visitPage(page, '/course/1/task/2')
        //Verify: after clicking on a two-step question, the two step question icon shows up, moving all the data-step-index by 1
        await page.click('.sticky-table [data-step-index="4"]')

        //check if text area for free response is available
        await page.waitForSelector('.exercise-step [data-test-id="free-response-box"]', { timeout: 2000 })
            .then(async () => {
                await page.type('.exercise-step [data-test-id="free-response-box"]', 'why do i need to fill this out?')
                await page.click('testEl=submit-answer-btn')
            })
            // free response is submitted
            .catch(() => {})

        //check if answer b is checked
        await page.waitForSelector('.answer-checked [data-test-id="answer-choice-b"]', { timeout: 2000 })
            .then(async () => {
                await page.click('testEl=continue-btn')
            })
            .catch(async () => {
                await page.click('testEl=answer-choice-b')
                await page.click('testEl=submit-answer-btn')
            })

        // go back and resubmit
        await page.click('.sticky-table [data-step-index="5"]')
        await expect(page).toHaveSelector('.answer-checked [data-test-id="answer-choice-b"]')
        await page.click('testEl=answer-choice-c')
        await expect(page).toHaveSelector('.answer-checked [data-test-id="answer-choice-c"]')
        await page.click('testEl=submit-answer-btn')
        await page.click('testEl=continue-btn')
    })
  
    it('should show late clock icon and the late points info, if task step is late', async () => {
        await visitPage(page, '/course/1/task/4')
        await expect(page).toHaveSelector('testEl=late-icon')
        await page.hover(':nth-match(.isLateCell, 1)')
        await expect(page).toHaveSelector('testEl=late-info-points-table')
    })

    it('should show word limit error message and disable submit button if response is over 500 words', async () => {
        await visitPage(page, '/course/1/task/3') // task id 3 is a hardcoded WRM task
        await expect(page).toHaveSelector('testEl=student-free-response')
        await page.type('testEl=free-response-box', longFreeResponseAnswer)
        await expect(page).toHaveSelector('.word-limit-error-info')
        expect(
            //@ts-ignore
            await page.isDisabled('testEl=submit-answer-btn')
        ).toBeTruthy()
    })

    it.skip('should be able to save question to my practice', async () => {
        await visitPage(page, '/course/1/task/2') 
        await page.click('.sticky-table [data-step-index="4"]')
        // start fresh - deleting the practice questions from course
        await page.evaluate(() => {
            window._MODELS.courses.get(1).practiceQuestions.clear()
        })

        await page.type('.exercise-step [data-test-id="free-response-box"]', 'why do i need to fill this out?')
        await page.click('testEl=submit-answer-btn')
        await expect(page).toHaveSelector('testEl=save-practice-button')
        await expect(page).toHaveText('testEl=save-practice-button', 'Save to practice')
    })
})