
import { visitPage, faker, setTimeouts, loginAs, findOrCreateTeacherAccount } from './helpers'

describe('My Courses', () => {

    beforeEach(async () => {
        await setTimeouts()
    })

    describe('Onboarding', () => {

        beforeEach(async () => {
            await findOrCreateTeacherAccount({
                userName: faker.internet.userName(),
                agreeToTerms: true,
                page,
            })
            await visitPage(page, '/courses')
        })

        it('allows a new teacher select and suggest subjects', async () => {

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
        describe('single course teacher', () => {
            beforeEach(async () => {
                await loginAs('teacher01')
            })

            it('can add an offering', async () => {
                await page.click('testEl=dashboard-settings-btn')
                expect(await page.$eval('testEl=dashboard-settings-btn', node => node.textContent)).toEqual('Exit settings')

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

        })

        describe('multi course teacher', () => {


            beforeEach(async () => {
                await loginAs('reviewteacher')
                await visitPage(page, '/courses')
            })

            it('shows new UI', async () => {
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

            xit('moves offerings', async () => {
                await expect(page).toHaveSelector('testEl=existing-teacher-screen')

                await page.click('testEl=dashboard-settings-btn')
                expect(page).toHaveText('testEl=dashboard-settings-btn', 'Exit settings')
                await expect(page).toHaveSelector('testEl=edit-mode-icons')
                await expect(page).toHaveSelector('testEl=add-subject-dropdown')

                const getOfferingIds = () => {
                    return Array.from(document.querySelectorAll<HTMLDivElement>('.offering-container'))
                        .reduce((current, el) => el.dataset?.offeringId
                            ? current.concat(el.dataset.offeringId) : current, [] as string[])
                }

                // [1, 2]
                const offeringOrderIds = await page.evaluate(getOfferingIds)

                // ordering the offerings
                await page.click(`.offering-container[data-offering-id="${offeringOrderIds[0]}"] .ox-icon-arrow-down`)
                expect(await page.evaluate(getOfferingIds)).toEqual(offeringOrderIds.reverse())
            })

            it('displays a preview course', async () => {
                await page.click('testEl=preview-course-item-title')
                await page.waitForNavigation()
                expect(
                    await page.evaluate(() => window.location.pathname)
                ).toMatch(/course\/\d+/)
            })


            it('goes to course settings details tab when clicking on "Course Settings" option', async () => {
                await page.waitForSelector('testEl=offering-container')
                const courseId = await page.$eval('.offering-container .my-courses-item' , ex => ex.dataset.courseId);
                await page.click(`testEl=course-card-item-actions-${courseId}`)
                await page.click(`testEl=course-card-item-actions-course-settings-${courseId}`)
                expect(
                    await page.evaluate(() => `${document.location.pathname}${document.location.search}`)
                ).toMatch(`/course/${courseId}/settings?tab=1`)
            })
        })

    })

    describe('invalid teacher', () => {
        beforeEach(async () => {
            await findOrCreateTeacherAccount({
                userName: faker.internet.userName(),
                agreeToTerms: true,
                isVerified: false,
                page,
            })
        })

        it('displays pending message', async () => {
            await visitPage(page, '/courses')
            await expect(page).toHaveText('testEl=pending-verification', 'Pending faculty verification')
        })

        it('displays not available message when account is old', async () => {
            await visitPage(page, '/courses')
            await page.waitForTimeout(100) // let page fully render so models are set up
            await page.evaluate(() => window._MODELS.user.created_at = '2010-01-01')
            await expect(page).toHaveText('testEl="non-allowed-instructors"', 'not able to offer')
        })
    })

})
