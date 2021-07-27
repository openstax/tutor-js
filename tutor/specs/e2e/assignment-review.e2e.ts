// Factory
import { visitPage, setTimeouts, loginAs, execRailsCmd } from './helpers'

//import { Mocker } from './mocker'
//import { times, merge } from 'lodash'

const COURSE_ID = 1
const REVIEW_ID = 3
//const is_teacher = true
// const PLAN_SETTINGS = {
//     1: { type: 'reading' },
//     2: { type: 'homework' },
//     3: { type: 'homework-wrm' },
//     4: { type: 'external' },
//     5: { type: 'event' },
//     6: { type: 'homework', exercises: [] },
//     7: { type: 'homework', exercises: [] },
// }

describe('Assignment Review', () => {

    // Mocker.mock({
    //     page,
    //     options: { is_teacher },
         //     data: {
    //         plan: (id, mock) => Factory.create('TeacherTaskPlan', {
    //             course: mock.course(COURSE_ID),
         //             id, ...PLAN_SETTINGS[id], days_ago: Number(id) < 5 ? 30 : Number(id) * -1,
         //         }),
         //         exercises: (planId, mock) => (
    //             mock.data.plan(planId).type.match(/homework/) ? times(8).map((id) => mock.data.exercise(id)) : []
    //         ),
         //         exercise: (id) => (
    //             Factory.create(Number(id) % 3 == 0 ? 'OpenEndedTutorExercise' : 'TutorExercise', { id })
    //         ),
         //         scores: (id, mock) => (
    //             Factory.create('TaskPlanScores', {
    //                 task_plan: mock.data.plan(id),
         //                 grades: {},
         //                 course: mock.course(COURSE_ID),
         //                 exercises: mock.data.exercises(id),
         //             })
    //         ),
         //     },
         //     routes: {
    //         '/api/courses/:courseId/grading_templates': async ({ mock, params: { courseId } }) => ({
    //             total_count: 3,
    //             items: ['reading', 'homework', 'homework'].map((task_plan_type, i) =>
        //                 Factory.create('GradingTemplate', {
    //                     name: i == 2 ? 'Second Homework' : undefined,
    //                     task_plan_type, course: mock.course(courseId),
         //                 })
    //             ),
         //         }),
         //         '/api/plans/:id/scores*': async ({ mock, params: { id } }) => {
    //             return mock.data.scores(id)
    //         },
         //         '/api/ecosystems/:id/readings': async ({ params: { id } }) => (
    //             Factory.create('Book', { type: ((0 == Number(id) % 2) ? 'physics' : 'biology'), id })
    //         ),
         //         '/api/ecosystems/:id/exercises*': async ({ mock, query }) => {
    //             return {
    //                 total_count: query.exercise_ids.length,
    //                 items: (query.exercise_ids as string[]).map((exId: string) => mock.data.exercise(exId)),
         //             }
    //         },
         //         '/api/plans/:id': async ({ request, mock, params: { id } }) => {
    //             const method = request.method()
    //             if (method == 'GET') { return mock.data.plan(id) }
    //             if (method == 'PUT') { return merge({}, mock.data.plan(id), request.postDataJSON()) }
    //             if (method == 'DELETE') { return {} }
    //         },
         //         '/api/plans/:planId/stats': async ({ mock, params: { planId } }) => (
    //             Factory.create('TaskPlanStat', {
    //                 task_plan: mock.data.plan(planId),
         //                 exercises: mock.data.exercises(planId),
         //             })
    //         ),
         //     },
         // })

    beforeEach(async () => {
        await setTimeouts()
        await loginAs('teacher01')
    });

    it('loads and views feedback', async () => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${REVIEW_ID}`)
        await expect(page).toHaveSelector('body')
        await page.click('testEl=submission-overview-tab')
        await expect(page).toHaveSelector('testEl=student-free-responses')
    });

    it('loads and views scores', async () => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${REVIEW_ID}`)
        await page.click('testEl=assignment-scores-tab')
        await expect(page).toHaveSelector('testEl=scores')
    });

    it('can grade WRM', async () => {
        await execRailsCmd(
            `puts Tasks::Models::TaskedExercise.find(14).update_attributes(grader_points: nil, grader_comments: nil, last_graded_at: nil)`
        )
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${REVIEW_ID}`)
        await page.route('/api/courses/1/grading_templates*', req => req.continue())
        await page.click('testEl=grade-answers-btn')
        // if this times out, restart the backend server
        // the specs may have ran to many times and graded all the responses
        await page.fill('input[name="score"]', '1')
        await page.fill('textarea[name="comment"]', 'good answer!')
        await page.click('testEl=save-grade-btn')
    });

    fit('can drop questions', async () => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${REVIEW_ID}`)
        await page.click('testEl=submission-overview-tab')
        await page.click('[data-question-id=139016] [data-test-id=delete-assignment]')
        // const qId = await page.$eval('testEl=drop-question-row >> input[type="checkbox"]:not(:checked)', el => el.id)
        // await page.click(`label[for="${qId}"] >> svg`)
        // await page.click('testEl=save-btn')
        // await expect(page).toHaveSelector('[data-test-id="dropped-question-indicator"]')
    })


    it('can render grading template preview', async () => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${REVIEW_ID}`)
        await expect(page).not.toHaveSelector('testEl=grading-template-card', { timeout: 10 })
        await page.click('testEl=preview-card-trigger')
        await expect(page).toHaveSelector('testEl=grading-template-card')
    });

    it('can delete assignment', async () => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${REVIEW_ID}`)
        await page.click('testEl=delete-assignment')
        await page.click('testEl=confirm-delete-assignment')
        await page.waitForNavigation()
        expect(
            await page.evaluate(() => document.location.pathname)
        ).toMatch('/course/1/t/month/')
    });

    it('can update details', async () => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${REVIEW_ID}`)
        await page.click('testEl=edit-assignment')
        await page.fill('testEl=edit-assignment-name', 'Update')
        await page.click('testEl=confirm-save-assignment')
        await expect(page).toHaveText('testEl=assignment-name', 'Update')
    });

    it('requires confirmation when changing grading template', async () => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${REVIEW_ID}`)
        await page.click('testEl=edit-assignment')
        await page.click('testEl=grading-templates')
        await page.click('testEl="Second Homework"')
        await page.click('testEl=confirm-change-template')
        await expect(page).toHaveText('testEl=grading-templates', 'Second Homework')

        // Can cancel
        await page.click('testEl=grading-templates')
        await page.click('testEl="Default Homework"')
        await page.click('testEl=cancel-confirm-change-template')
        await expect(page).toHaveText('testEl=grading-templates', 'Second Homework')
    });

    it('renders appropriate template and grading blocks for plan types', async () => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${REVIEW_ID}`)
        // the beforeEach will visit review/2 which is gradable
        // IMPORTANT must set timeout on a not exists, otherwise it keeps trying forever
        await expect(page).toHaveText('testEl=grading-template-name', 'Default Homework')
        await expect(page).toHaveText('testEl=grading-block', 'Grade answers')
        await expect(page).not.toHaveText('testEl=grading-block', 'View submissions', { timeout: 100 })

        // now visit review/1 which is a reading
        await visitPage(page, '/course/1/assignment/review/2')
        await expect(page).toHaveText('testEl=grading-template-name', 'Default Reading')
        await expect(page).not.toHaveText('testEl=grading-block', 'Grade answers', { timeout: 100 })
        await expect(page).toHaveText('testEl=grading-block', 'View submissions')

        // review/4 is external
        await visitPage(page, '/course/1/assignment/review/4')
        await expect(page).not.toHaveSelector('testEl=grading-block', { timeout: 100 })
        await expect(page).not.toHaveSelector('testEl=grading-template-name', { timeout: 100 })

        // review/4 is event
        await visitPage(page, '/course/1/assignment/review/5')
        await expect(page).not.toHaveSelector('testEl=grading-block', { timeout: 100 })
        await expect(page).not.toHaveSelector('testEl=grading-template-name', { timeout: 100 })
    });

    it('edits unopened assigments in edit view', async () => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${REVIEW_ID}`)
        await expect(page).toHaveText('testEl=grading-template-name', 'Default Homework')
        // the beforeEach will visit review/2 which is closed and non-editable
        const docPath = await page.evaluate(() => document.location.pathname)
        const name = await page.$eval('testEl=assignment-name', (el: HTMLElement) => el.innerText)
        await page.click('testEl=edit-assignment')
        await expect(page).toHaveText('css=.modal-dialog', `Edit ${name} details`)
        expect(
            await page.evaluate(() => document.location.pathname)
        ).toMatch(docPath)
        await page.click('testEl=cancel-save-assignment')

        // review/7 is unopened hw
        await visitPage(page, '/course/1/assignment/review/7')
        await page.click('testEl=edit-assignment')
        expect(
            await page.evaluate(() => document.location.pathname)
        ).toMatch('/assignment/edit/homework/7')
    });

    it('hides overview and scores tabs if not reading or homework', async () => {
        //        await visitPage(page, `/course/${COURSE_ID}/assignment/review/2`)
        // Homework
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${REVIEW_ID}`)
        await expect(page).toHaveSelector('testEl=submission-overview-tab')
        await expect(page).toHaveSelector('testEl=assignment-scores-tab')

        // Reading
        await visitPage(page, '/course/1/assignment/review/1')
        await expect(page).toHaveSelector('testEl=submission-overview-tab')
        await expect(page).toHaveSelector('testEl=assignment-scores-tab')

        // External
        await visitPage(page, '/course/1/assignment/review/4')
        await expect(page).not.toHaveSelector('testEl=submission-overview-tab', { timeout: 100 })
        await expect(page).toHaveSelector('testEl=assignment-scores-tab')

        // Event
        await visitPage(page, '/course/1/assignment/review/5')
        await expect(page).not.toHaveSelector('testEl=submission-overview-tab', { timeout: 100 })
        await expect(page).not.toHaveSelector('testEl=assignment-scores-tab', { timeout: 100 })
    });

    it('cannot deselect sections', async () => {
        await visitPage(page, '/course/1/assignment/review/1')
        await page.click('testEl=edit-assignment')
        await page.click('testEl=select-sections', { force: true })
        await page.hover('testEl=tasking >> css=[data-icon="check-square"]')
        await expect(page).toHaveText('css=[role=tooltip]', 'cannot withdraw')
    });

    it('should go directly to the submission overview tab', async () => {
        await visitPage(page, '/course/1/assignment/review/2?tab=1')
        await expect(page).toHaveSelector('testEl=overview')
        await expect(page).toHaveSelector('testEl=student-free-responses')
    });

    it('should go directly to the assignment scores tab', async () => {
        await visitPage(page, '/course/1/assignment/review/2?tab=2')
        await expect(page).toHaveSelector('testEl=scores')
    });

    it('should hide the student names', async () => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/review/${REVIEW_ID}`)
        await page.click('testEl=submission-overview-tab')
        // names are shown first, so button label is "Hide student names"
        await expect(page).toHaveText('testEl=names-toogle-button', 'Hide student names')
        await expect(page).toHaveSelector('testEl=wrq-response-student-name')
        await page.click('testEl=names-toogle-button')
        await expect(page).toHaveText('testEl=names-toogle-button', 'Show student names')
        await expect(page).toHaveText('testEl=wrq-response-student-name', 'Student response')
    });
});
