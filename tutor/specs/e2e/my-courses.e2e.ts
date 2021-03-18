import { visitPage, Mocker, setTimeouts } from './helpers'

describe('My Courses', () => {

    const mock = Mocker.mock({
        page,
        routes: {},
    })

    beforeEach(async () => {
        await setTimeouts()
    })

    describe('Onboarding', () => {
        it('allows a new teacher select and suggest subjects', async () => {
            mock.current.bootstrapData.courses = []
            await visitPage(page, '/courses')
            await expect(page).toHaveSelector('testEl=new-teacher-screen')
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
            await expect(page).toHaveSelector('testEl=show-detail')
            await expect(page).not.toHaveSelector('testEl=submit-suggested-subject', { timeout: 100 })
            await page.type('testEl=input-suggested-subject', 'test')
            await expect(page).not.toHaveSelector('testEl=show-detail', { timeout: 100 })
            await page.click('testEl=offering-0', { force: true })
            await page.click('testEl=show-detail')
        })
    })

    describe('Dashboard', () => {
        it('shows new UI', async () => {
            mock.current.bootstrapData.courses.forEach((c: any) => {
                c.offering_id = mock.current.bootstrapData.offerings[0].id
            })
            await visitPage(page, '/courses')
            await expect(page).toHaveSelector('testEl=existing-teacher-screen')
            await expect(page).toHaveSelector('testEl=offering-container')
            //course card
            await expect(page).toHaveSelector('testEl=course-card')
            // //preview card
            await expect(page).toHaveSelector('testEl=preview-course-card')
            // //create course card
            await expect(page).toHaveSelector('testEl=create-course')
    
            //Resources
            await page.click('testEl=resources-tab')
            await expect(page).toHaveText('testEl=getting-started-guide', 'Instructor Getting Started Guide')
            await expect(page).toHaveText('testEl=getting-started-video', ' Video Tutorials ')
        })
    
        it('enters edit mode', async () => {
            const getOfferingIds = () => {
                return Array.from(document.querySelectorAll<HTMLDivElement>('.offering-container'))
                    .reduce((current, el) => el.dataset?.offeringId 
                        ? current.concat(el.dataset.offeringId) : current, [] as string[])
            }

            mock.current.bootstrapData.courses.forEach((c: any, index: number) => {
                //grouping courses with the first two offerings, id 1 and id 2
                c.offering_id = mock.current.bootstrapData.offerings[index % 2].id
            })
            await visitPage(page, '/courses')
            await expect(page).toHaveSelector('testEl=existing-teacher-screen')

            await page.click('testEl=dashboard-settings-btn')
            expect(page).toHaveText('testEl=dashboard-settings-btn', 'Exit settings')
            await expect(page).toHaveSelector('testEl=edit-mode-icons')
            await expect(page).toHaveSelector('testEl=add-subject-dropdown')

            // [1, 2]
            const offeringOrderIds = await page.evaluate(getOfferingIds)
            // ordering the offerings
            await page.click(`.offering-container[data-offering-id="${offeringOrderIds[0]}"] .ox-icon-arrow-down`)
            expect(await page.evaluate(getOfferingIds)).toEqual(offeringOrderIds.reverse())

            const offerings = await page.$$('testEl=offering-container')
            await page.click('testEl=add-subject-dropdown-btn')
            // there is a delay between clicking the offering and scrolling to the top
            await page.click('.dropdown-menu.show .offering-item:not(.disabled)', { timeout: 500 })
            const updatedOfferings = await page.$$('testEl=offering-container')
            // we added a new offering
            expect(updatedOfferings).toHaveLength(offerings.length + 1)

            await page.click('testEl=dashboard-settings-btn')
            expect(await page.$eval('testEl=dashboard-settings-btn', node => node.textContent)).toEqual('Manage subjects')
        })

        it('displays a preview course', async () => {
            mock.current.bootstrapData.courses.forEach((c: any) => {
                c.offering_id = mock.current.bootstrapData.offerings[0].id
            })
            await visitPage(page, '/courses')
            await page.click('testEl=preview-course-item-title')
            await page.waitForNavigation()
            expect(
                await page.evaluate(() => window.location.pathname)
            ).toMatch(/course\/\d+/)
        })
    
        it('hides concept coach courses', async () => {
            const c = mock.current.course(1)
            c.is_concept_coach = true
            c.name = 'ConceptCoach'
            await visitPage(page, '/courses')
            await expect(page).toHaveSelector('testEl=existing-teacher-screen')
            await expect(page).not.toHaveText('testEl=course-card', 'ConceptCoach', { timeout: 100 })
        })
    })

    describe('unavailable messages', () => {
        it('displays pending message', async () => {
            mock.current.bootstrapData.courses = []
            mock.current.bootstrapData.user.can_create_courses = false
            mock.current.bootstrapData.user.created_at = (new Date()).toISOString()

            await visitPage(page, '/courses')
            await expect(page).toHaveText('testEl=pending-verification', 'Pending faculty verification')
        })

        it('displays not available message', async () => {
            mock.current.bootstrapData.courses = []
            mock.current.bootstrapData.user.can_create_courses = false
            const now = new Date()
            now.setDate(now.getDate() - 7)
            mock.current.bootstrapData.user.created_at = now.toISOString()
            await visitPage(page, '/courses')
            await expect(page).toHaveText('testEl="non-allowed-instructors"', 'not able to offer')
        })
    })

})
