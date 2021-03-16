import { visitPage, Mocker, setTimeouts } from './helpers'

describe('Preview Courses', () => {

    const mock = Mocker.mock({
        page,
        options: {
            feature_flags: { tours: false },
            num_courses: 1,
        },
        routes: {},
    })

    beforeEach(async () => {
        await setTimeouts()
    })

    it('displays a collapsible side panel that creates a course', async () => {
        mock.current.course(1).is_preview = true
        await visitPage(page, '/course/1')
        await expect(page).toHaveSelector('testEl=preview-message')
        await page.click('testEl=dismiss-preview-msg')
        await page.click('testEl=preview-panel-create-course')
        await expect(page).toHaveSelector('testEl=new-course-wizard')
        await expect(page).toHaveSelector('.select-dates')
    })

    it('hides preview panel for non-preview courses', async () => {
        mock.current.course(1).is_preview = false
        await visitPage(page, '/course/1')
        await expect(page).not.toHaveSelector('testEl=side-panel >> testEl=preview-panel-create-course', { timeout: 100 })
    })
})
