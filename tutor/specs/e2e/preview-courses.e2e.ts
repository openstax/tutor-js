import { visitPage, setTimeouts, setRole } from './helpers'

describe('Preview Courses', () => {
    beforeEach(async () => {
        await setTimeouts()
        await setRole('teacher')
        await visitPage(page, '/course/6')
        await page.evaluate(() => {
            window._MODELS.feature_flags.set('tours', false)
        })
        await page.click('.onboarding-nag button')
    })

    it('displays a collapsible side panel', async () => {

        await page.click('testEl=preview-panel-toggle-panel')
        await expect(page).toHaveSelector('testEl=preview-panel-create-course', { timeout: 10 })
        await page.click('testEl=preview-panel-toggle-panel')
        await expect(page).not.toHaveSelector('testEl=preview-panel-create-course', { timeout: 10 })

    })
})
