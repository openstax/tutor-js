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

    describe('Teachers MyCourses UI', () => {
        it('shows new UI', async () => {
            await visitPage(page, '/courses')
            await expect(page).toHaveSelector('testEl=existing-teacher-screen')
            await expect(page).toHaveSelector('testEl=offering-container')
            //course card
            await expect(page).toHaveSelector('testEl=course-card')
            // //preview card
            await expect(page).toHaveSelector('testEl=preview-course-card')
            // //create course card
            await expect(page).toHaveSelector('testEl=add-course-card')
    
            //Resources
            await page.click('testEl=resources-tab')
            await expect(page).toHaveText('#instructor-getting-started', 'Instructor Getting Started Guide')
            await expect(page).toHaveText('#instructor-videos', ' Video Tutorials ')
        })
    
        it('enters edit mode', async () => {
            const getOfferingIds = () => {
                return Array.from(document.querySelectorAll<HTMLDivElement>('.offering-container'))
                    .reduce((current, el) => el.dataset?.offeringId 
                        ? current.concat(el.dataset.offeringId) : current, [] as string[])
            }

            await visitPage(page, '/courses')
            await expect(page).toHaveSelector('testEl=existing-teacher-screen')

            await page.click('.controls button')
            await expect(await page.$eval('.controls button', node => node.textContent)).toEqual('Exit settings')
            await expect(page).toHaveSelector('.edit-mode-icons')
            await expect(page).toHaveSelector('.add-subject-dropdown')

            // [1, 2]
            const offeringOrderIds = await page.evaluate(getOfferingIds)
            // ordering the offerings
            await page.click(`.offering-container[data-offering-id="${offeringOrderIds[0]}"] .ox-icon-arrow-down`)
            await expect(await page.evaluate(getOfferingIds)).toEqual(offeringOrderIds.reverse())

            const defaultOfferingContainersLength = await page.$$eval('.offering-container', node => node.length);
            await page.click('.add-subject-dropdown button')
            await page.waitForSelector('.dropdown-menu.show')
            await page.click('.dropdown-menu.show .offering-item:not(disabled)')
            // we added a new offering
            await expect(defaultOfferingContainersLength + 1).toEqual(await page.$$eval('.offering-container', node => node.length))

            await page.click('.controls button')
            await expect(await page.$eval('.controls button', node => node.textContent)).toEqual('Manage subjects')

        })
    })
})
