import {
    test, visitPage, withUser, expect, getCourseIdFromURL, Page,
    openCalendarSideBar, disableTours,
} from './test'

withUser('teacher01')

const removeSelfFromCourse = async (page: Page, courseId: string) => {
    await visitPage(page, `/course/${courseId}/roster`)
    await expect(page).toHaveSelector('.teachers-table')
    const userId = await page.evaluate(
        (courseId) => window._MODELS.courses.get(courseId).primaryRole.id,
        courseId,
    )
    await page.click(`tr[data-teacher-id="${userId}"] >> a.remove`)
    await expect(page).toMatchText('.popover-body >> .warning', /remove yourself/)

    await page.click('testId=remove-confirm-btn')
    await page.waitForURL(/courses/)
}


test('pre-fills offering and goes to the term step', async ({ page }) => {
    await visitPage(page, '/courses')
    await page.click('testId=create-course')
    await expect(page).toHaveSelector('testId=new-course-wizard')
    await expect(page).toHaveSelector('.select-dates')
    await page.click('testId=cancel-x')
    expect(
        await page.evaluate(() => document.location.pathname)
    ).toEqual('/courses')
})

test('selects from menu', async ({ page }) => {
    await visitPage(page, '/courses')
    await page.click('.tutor-navbar .actions-menu .dropdown-toggle')
    await page.click('[data-item=createNewCourse]')
    await expect(page).toHaveSelector('testId=new-course-wizard')
    await expect(page).not.toHaveSelector('.choice.active')
})


test('creating a new then deletes it', async ({ page }) => {
    await visitPage(page, '/new-course')
    await page.click('[role=button][data-appearance=college_physics]')

    await page.click('testId=next-btn')
    await page.click('.choice:nth-child(2)')
    await page.click('testId=next-btn')

    // this set only shows if the teacher has an existing course of that type
    if (await page.$('[data-new-or-copy=new]')) {
        await page.click('[data-new-or-copy=new]')
        await page.click('testId=next-btn')
    }

    await page.type('.course-details-name input', 'my test course')
    await page.click('testId=next-btn')

    await page.fill('#number-sections', '3')
    await page.fill('#number-students', '10')
    await expect(page).toMatchText('testId=next-btn', /Finish/)

    await page.click('testId=next-btn')
    await page.waitForURL(/course\/\d+/)

    const courseId = await getCourseIdFromURL(page)
    expect(courseId).toBeTruthy()
    await removeSelfFromCourse(page, courseId!)
})

test('cloning a course', async ({ page }) => {
    // now clone the course
    await visitPage(page, '/courses')

    await page.click('testId=course-card-item-actions-1')
    await page.click('testId=course-card-item-actions-create-course-1')

    await expect(page).toMatchText('testId=new-course-wizard', /When will you teach/)
    await page.click('.choice:nth-child(2)')
    await page.click('testId=next-btn')

    await expect(page).toMatchText('testId=new-course-wizard', /Choose a name/)
    await page.fill('.course-details-name input', 'my test copied course')
    await page.click('testId=next-btn')

    await page.fill('#number-sections', '3')
    await page.fill('#number-students', '10')
    await expect(page).toMatchText('testId=next-btn', /Finish/)

    await page.click('testId=next-btn')
    await page.waitForURL(/course\/\d+/)

    disableTours(page)
    await openCalendarSideBar(page)

    await expect(page).toHaveSelector('.past-assignments')

    const courseId = await getCourseIdFromURL(page)
    expect(courseId).toBeTruthy()
    await removeSelfFromCourse(page, courseId!)
})
