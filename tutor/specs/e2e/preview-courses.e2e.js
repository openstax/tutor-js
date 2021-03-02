import { visitPage, setTimeouts, setRole } from './helpers'

describe('Preview Courses', () => {
    beforeEach(async () => {
        await setTimeouts()
        await setRole('teacher')
    })

    it('displays a collapsible side panel if no course created in subject', async () => {
        await visitPage(page, '/course/7')
        await page.evaluate(() => {
            window._MODELS.feature_flags.set('tours', false)
        })
        await expect(page).toHaveSelector('testEl=preview-panel-create-course', { timeout: 10000 })
        await page.click('testEl=toggle-preview-panel')
        await expect(page).not.toHaveSelector('testEl=preview-panel-create-course', { timeout: 10 })
        await page.click('testEl=toggle-preview-panel')
        await expect(page).toHaveSelector('[data-test-id=preview-panel-create-course]', { timeout: 1000 })

        // Test auto-collapse when changing screens
        await page.click('[data-tour-anchor-id="question-library-button"]')
        await expect(page).not.toHaveSelector('testEl=preview-panel-create-course', { timeout: 10 })
    })

    it('does not display  a collapsible side panel if a course created in subject', async () => {
        await visitPage(page, '/course/6')
        await page.evaluate(() => {
            window._MODELS.feature_flags.set('tours', false)
        })
        await expect(page).not.toHaveSelector('testEl=preview-panel-create-course', { timeout: 1000 })
    })
})
