import { visitPage, test, expect, faker, loginAs, findOrCreateTeacherAccount, withUser } from './test'


test.describe('Onboarding', () => {

    test.beforeEach(async ({ page }) => {
        await findOrCreateTeacherAccount({
            userName: faker.internet.userName(),
            agreeToTerms: true,
            page,
        })
        await visitPage(page, '/courses')
    })

    test('allows a new teacher select and suggest subjects', async ({ page }) => {
        await expect(page).toHaveSelector('testId=new-teacher-screen')
        await page.type('testId=input-suggested-subject', 'test')
        await page.click('testId=submit-suggested-subject')

        await page.waitForSelector('testId=new-teacher-screen')
        await page.waitForTimeout(100)
        expect(
            await page.evaluate(() => document.location.search)
        ).toContain('onboarding=2')
        await page.click('testId=back-to-select')
        await page.waitForTimeout(100)
        expect(
            await page.evaluate(() => document.location.search)
        ).toContain('onboarding=0')
        await expect(page).not.toHaveSelector('testId=show-detail', { timeout: 100 })
        await page.type('testId=input-suggested-subject', 'test')
        await page.click('testId=offering-0', { force: true })
        await expect(page).toHaveSelector('testId=show-detail')
        await expect(page).not.toHaveSelector('testId=submit-suggested-subject', { timeout: 100 })
        await page.type('testId=input-suggested-subject', 'test')
        await expect(page).not.toHaveSelector('testId=show-detail', { timeout: 100 })
        await page.click('testId=offering-0', { force: true })
        await page.click('testId=show-detail')
    })

})


test.describe('single course teacher', () => {
    withUser('teacher01')

    test('can add an offering', async ({ page }) => {
        await visitPage(page, '/courses')

        await page.click('testId=dashboard-settings-btn')
        expect(await page.$eval('testId=dashboard-settings-btn', node => node.textContent)).toEqual('Exit settings')

        const offerings = await page.$$('testId=offering-container')
        await page.click('testId=add-subject-dropdown-btn')
        // there is a delay between clicking the offering and scrolling to the top
        await page.click('.dropdown-menu.show .offering-item:not(.disabled)', { timeout: 500 })
        const updatedOfferings = await page.$$('testId=offering-container')
        // we added a new offering
        expect(updatedOfferings).toHaveLength(offerings.length + 1)

        await page.click('testId=dashboard-settings-btn')
        expect(await page.$eval('testId=dashboard-settings-btn', node => node.textContent)).toEqual('Manage subjects')
    })

})

test.describe('multi course teacher', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs('reviewteacher', page)
        await visitPage(page, '/courses')
    })

    test('shows new UI', async ({ page }) => {
        await expect(page).toHaveSelector('testId=existing-teacher-screen')
        await expect(page).toHaveSelector('testId=offering-container')
        //course card
        await expect(page).toHaveSelector('testId=course-card')
        // //preview card
        await expect(page).toHaveSelector('testId=preview-course-card')
        // //create course card
        await expect(page).toHaveSelector('testId=create-course')

        //Resources
        await page.click('testId=resources-tab')
        await expect(page).toMatchText('testId=getting-started-guide', /Instructor Getting Started Guide/)
        await expect(page).toMatchText('testId=getting-started-video', /Video Tutorials/)
    })

    test('moves offerings', async ({ page }) => {
        await expect(page).toHaveSelector('testId=existing-teacher-screen')

        await page.click('testId=dashboard-settings-btn')

        await page.click('testId=add-subject-dropdown-btn >> button')
        await page.click('css=.offering-item:not(.disabled)')
        expect(page).toMatchText('testId=dashboard-settings-btn', /Exit settings/)
        await expect(page).toHaveSelector('testId=edit-mode-icons')
        await expect(page).toHaveSelector('testId=add-subject-dropdown')

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

    test('displays a preview course', async ({ page }) => {
        await page.click('testId=preview-course-item-title')
        await page.waitForNavigation()
        expect(
            await page.evaluate(() => window.location.pathname)
        ).toMatch(/course\/\d+/)
    })


    test('goes to course settings details tab when clicking on "Course Settings" option', async ({ page }) => {
        await page.waitForSelector('testId=offering-container')
        const courseId = await page.$eval('.offering-container .my-courses-item' , ex => ex.dataset.courseId);
        await page.click(`testId=course-card-item-actions-${courseId}`)
        await page.click(`testId=course-card-item-actions-course-settings-${courseId}`)
        expect(
            await page.evaluate(() => `${document.location.pathname}${document.location.search}`)
        ).toMatch(`/course/${courseId}/settings?tab=1`)
    })
})


test.describe('invalid teacher', () => {
    test.beforeEach(async ({ page }) => {
        await findOrCreateTeacherAccount({
            userName: faker.internet.userName(),
            agreeToTerms: true,
            isVerified: false,
            page,
        })
    })

    test('displays pending message', async ({ page }) => {
        await visitPage(page, '/courses')
        await expect(page).toMatchText('testId=pending-verification', /Pending faculty verification/)
    })

    test('displays not available message when account is old', async ({ page }) => {
        await visitPage(page, '/courses')
        await page.waitForTimeout(100) // let page fully render so models are set up
        await page.evaluate(() => window._MODELS.user.created_at = '2010-01-01')
        await expect(page).toMatchText('testId="non-allowed-instructors"', /not able to offer/)
    })
})
