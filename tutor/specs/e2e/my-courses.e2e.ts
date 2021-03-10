import { visitPage, setTimeouts, setRole, modifyBootstrapData } from './helpers'

describe('My Courses', () => {
    beforeEach(async () => {
        await jestPlaywright.resetPage()
        await setTimeouts()
        await setRole('teacher')
    })

    it('allows a new teacher select and suggest subjects', async () => {
        await visitPage(page, '/courses')
        // The 500ms timeouts may be too low when using DEBUG, temp set to 1000 if you see issues
        await expect(page).toHaveSelector('testEl=existing-teacher-screen', { timeout: 500 })
        await modifyBootstrapData(page, (data) => ({ ...data, courses: [] }))
        await visitPage(page, '/courses')
        await expect(page).toHaveSelector('testEl=new-teacher-screen', { timeout: 500 })
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
        await expect(page).not.toHaveSelector('testEl=show-detail', { timeout: 100 })
        await page.type('testEl=input-suggested-subject', 'test')
        await page.click('testEl=offering-0', { force: true })
        await expect(page).toHaveSelector('testEl=show-detail', { timeout: 100 })
        await expect(page).not.toHaveSelector('testEl=submit-suggested-subject', { timeout: 100 })
        await page.type('testEl=input-suggested-subject', 'test')
        await expect(page).not.toHaveSelector('testEl=show-detail', { timeout: 100 })
        await page.click('testEl=offering-0', { force: true })
        await page.click('testEl=show-detail')
    })

    it('displays a preview course', async () => {
        await visitPage(page, '/courses')
        await page.click('.my-courses-item.preview a')
        await page.waitForNavigation()
        expect(
            await page.evaluate(() => window.location.pathname)
        ).toMatch(/course\/\d+/)
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
