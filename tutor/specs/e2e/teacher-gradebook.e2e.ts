import { Factory, visitPage, Mocker, setTimeouts, setRole, deleteText } from './helpers'

xdescribe('Teacher Gradebook', () => {
    Mocker.mock({
        page,
        options: {
            feature_flags: { tours: false },
        },
        routes: {
            '/api/courses/:id/performance': async ({ mock, params: { id } }) => {
                const course = mock.course(id)
                const scores = course.periods.map(
                    period =>Factory.create('ScoresForPeriod', { period }),
                );
                return scores
            },
        },
    })

    beforeEach(async () => {
        await setTimeouts()
        await setRole('teacher')
        await visitPage(page, '/course/1/gradebook')
    });

    it('loads and views grades', async () => {
        await expect(page).toHaveText('testEl=page-title', 'Gradebook')
    })

    it('switches tabs', async () => {
        await page.click('testEl=tabs')
    })

    it('searches', async () => {
        await page.type('testEl=search-by-name-input', 'horse with no name')
        await expect(page).not.toHaveSelector('testEl=student-name', { timeout: 100 })
        await deleteText(page, 'testEl=search-by-name-input')
        //need to add a timeout so it waits for the table to be filtered
        await expect(page).toHaveSelector('testEl=student-name', { timeout: 500 })
    })

    it('sets preferences', async () => {
        await page.click('testEl=settings-btn')
        const settings = ['displayScoresAsPoints', 'arrangeColumnsByType','showDroppedStudents']
        await page.click(`testEl=${settings[0]}-checkbox`, { timeout: 500, force: true })
        await page.click(`testEl=${settings[1]}-checkbox`, { timeout: 500, force: true })
        await page.click(`testEl=${settings[2]}-checkbox`, { timeout: 500, force: true })
    })
})
