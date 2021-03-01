import { visitPage, setTimeouts, setRole } from './helpers'

describe('My Courses', () => {
    beforeEach(async () => {
        await setTimeouts()
        await setRole('teacher')
    })

    it.skip('displays course create page when no courses', async () => {
        await visitPage(page, '/courses')
        await expect(page).toHaveSelector('testEl=existing-teacher-screen')
        await page.evaluate(() => {
            window._MODELS.store.dispatch({ type: 'bootstrap', payload: { courses: [], offerings: [] } })
        })
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
        await expect(page).not.toHaveSelector('testEl=existing-teacher-screen', { timeout: 100 })
        expect(
            await page.evaluate(() => document.location.search)
        ).toContain('onboarding=2')
        await page.click('testEl=back-to-select')
        expect(
            await page.evaluate(() => document.location.search)
        ).toContain('onboarding=0')
    })

    describe('New Courses UI', () => {
        it('shows new UI', async () => {
            await visitPage(page, '/courses')
            await expect(page).toHaveSelector('testEl=existing-teacher-screen')
            await expect(page).toHaveSelector('.offering-container')
            //course card
            await expect(page).toHaveSelector('.offering-container .course-cards .my-courses-item-wrapper .my-courses-item')
            //preview card
            await expect(page).toHaveSelector('.offering-container .course-cards .preview')
            //create course card
            await expect(page).toHaveSelector('.offering-container .my-courses-add-zone')
    
            //Resources
            await page.click('testEl=r-e-s-o-u-r-c-e-s-tab')
            await expect(await page.$eval('#instructor-getting-started', node => node.textContent)).toEqual('Instructor Getting Started Guide')
            await expect(await page.$eval('#instructor-videos', node => node.textContent)).toEqual(' Video Tutorials ')
        })
    
        it.only('enters edit mode', async () => {
            await visitPage(page, '/courses')
            await expect(page).toHaveSelector('testEl=existing-teacher-screen')

            await page.click('.controls button')
            await expect(await page.$eval('.controls button', node => node.textContent)).toEqual('Exit settings')
            await expect(page).toHaveSelector('.edit-mode-icons')
            await expect(page).toHaveSelector('.add-subject-dropdown')

            const defaultOfferingContainersLength = await page.$$eval('.offering-container', node => node.length);
            await page.click('.add-subject-dropdown button')
            await page.waitForSelector('.dropdown-menu.show')
            await page.click('.dropdown-menu.show .offering-item:not(disabled)')
            // we added a new offering
            await expect(defaultOfferingContainersLength + 1).toEqual(await page.$$eval('.offering-container', node => node.length))
        })
    })
})
