import { visitPage, setTimeouts, setRole, modifyBootstrapData } from './helpers'

describe('My Courses', () => {
    beforeEach(async () => {
        await jestPlaywright.resetPage()
        await setTimeouts()
        await setRole('teacher')
    })

    it('displays course create page when no courses', async () => {
        await modifyBootstrapData(page, (data) => ({ ...data, courses: [] }))
        await visitPage(page, '/courses')
        await expect(page).toHaveSelector('testEl=new-teacher-screen')
        await expect(page).not.toHaveSelector('testEl=existing-teacher-screen', { timeout: 10 })
    })

    it('allows a new teacher select and suggest subjects', async () => {
        await visitPage(page, '/courses')
        await expect(page).toHaveSelector('testEl=existing-teacher-screen')
        await page.evaluate(() => {
            window._MODELS.store.dispatch({ type: 'bootstrap', payload: { courses: [], offerings: [] } })
        })
        await page.type('testEl=input-suggested-subject', 'test')
        await page.click('testEl=submit-suggested-subject')
        await page.waitForNavigation()
        await expect(page).not.toHaveSelector('testEl=existing-teacher-screen', { timeout: 100 })
        expect(
            await page.evaluate(() => document.location.search)
        ).toContain('onboarding=2')
        await page.click('testEl=back-to-select')
        expect(
            await page.evaluate(() => document.location.search)
        ).toContain('onboarding=0')
    })

    describe('unavailable messages', () => {

        it('displays pending message', async () => {
            await modifyBootstrapData(page, (data) => {
                data.courses = []
                data.user.can_create_courses = false
                data.user.created_at = (new Date()).toISOString()
                return data
            })
            await visitPage(page, '/courses')
            await expect(page).toHaveText('testEl=pending-verification', 'Pending faculty verification')
        })

        it('displays not available message', async () => {
            await modifyBootstrapData(page, (data) => {
                data.courses = []
                data.user.can_create_courses = false
                const now = new Date()
                now.setDate(now.getDate() - 7)
                data.user.created_at = now.toISOString()
                return data
            })
            await visitPage(page, '/courses')
            await expect(page).toHaveText('testEl="non-allowed-instructors"', 'not able to offer')
        })
    })

})
