import { visitPage, setTimeouts, loginAs } from './helpers'

xdescribe('Create Course wizard', () => {

    beforeEach(async () => {
        await loginAs({ page, userName: 'reviewteacher' })
        await setTimeouts()
    })


    it('pre-fills offering and goes to the term step', async () => {
        await visitPage(page, '/courses')
        await page.click('testEl=create-course')
        await expect(page).toHaveSelector('testEl=new-course-wizard')
        await expect(page).toHaveSelector('.select-dates')
        await page.click('testEl=cancel-x')
        expect(
            await page.evaluate(() => document.location.pathname)
        ).toEqual('/courses')

    })

    it('selects from menu', async () => {
        await visitPage(page, '/courses')
        await page.click('.tutor-navbar .actions-menu .dropdown-toggle')
        await page.click('[data-item=createNewCourse]')
        await expect(page).toHaveSelector('testEl=new-course-wizard')
        await expect(page).not.toHaveSelector('.choice.active', { timeout: 100 })
    })

    xdescribe('create course', () => {
        beforeEach(async () => {
            await visitPage(page, '/new-course')
            await page.click('[role=button][data-appearance=college_physics]')
            await page.click('testEl=next-btn')
            await page.click('.choice:nth-child(2)')
            await page.click('testEl=next-btn')
        })
        it('creates a new course', async () => {
            await page.click('[data-new-or-copy=new]')
            await page.click('testEl=next-btn')
            await page.type('.course-details-name input', 'my test course')
            await page.click('testEl=next-btn')
            await page.fill('#number-sections', '3')
            await page.fill('#number-students', '10')
            await expect(page).toHaveText('testEl=next-btn', 'Finish')
            await page.click('testEl=next-btn')
            await page.waitForNavigation()
            expect(
                await page.evaluate(() => document.location.pathname)
            ).toMatch(/course\/\d+/)
        })
        it('clones a a course', async () => {
            await page.click('[data-new-or-copy=copy]')
            await page.click('testEl=next-btn')
            await expect(page).toHaveText('Which course')
            await page.click('.choice')
            await page.click('testEl=next-btn')

            await page.type('.course-details-name input', 'my test course')
            await page.click('testEl=next-btn')

            await page.fill('#number-sections', '30')
            await expect(page).toHaveText('.alert', 'More than 10 sections is not supported')
            await page.fill('#number-sections', '3')
            await page.fill('#number-students', '10')
            await expect(page).toHaveText('testEl=next-btn', 'Finish')
            await page.click('testEl=next-btn')
            await page.waitForNavigation()
            expect(
                await page.evaluate(() => document.location.pathname)
            ).toMatch(/course\/\d+/)
        })
    })
})
