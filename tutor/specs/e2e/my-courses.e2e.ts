import { visitPage, setTimeouts } from './helpers'

describe('My Courses', () => {
    beforeEach(async () => {
        await setTimeouts()
    })

    it('displays course create page when no courses', async () => {
        await visitPage(page, '/courses')
        await expect(page).toHaveSelector('testEl=existing-teacher-screen')
        await page.evaluate(() => {
            window._MODELS.store.dispatch({ type: 'bootstrap', payload: { courses: [] } })
        })
        await expect(page).toHaveSelector('testEl=new-teacher-screen')
        await expect(page).not.toHaveSelector('testEl=existing-teacher-screen', { timeout: 10 })
    })
})
