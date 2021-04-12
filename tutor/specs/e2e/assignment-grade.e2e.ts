import { Factory, visitPage, Mocker, setTimeouts } from './helpers'
import { times, merge, isNil } from 'lodash'

describe('Assignment Grade', () => {
    const COURSE_ID = 1
    const is_teacher = true
    const PLAN_SETTINGS = {
        1: { type: 'reading' },
        2: { type: 'homework' },
        3: { type: 'homework-wrm' },
    }
    let GRADES = {}

    Mocker.mock({
        page,
        options: { is_teacher },
        data: {
            plan: (id, mock) => Factory.create('TeacherTaskPlan', {
                course: mock.course(COURSE_ID),
                id, ...PLAN_SETTINGS[id], days_ago: Number(id) < 5 ? 30 : Number(id) * -1,
            }),
            exercises: (planId, mock) => (
                mock.data.plan(planId).type.match(/homework/) ? times(16).map((id) => mock.data.exercise(id)) : []
            ),
            exercise: (id) => (
                Factory.create('OpenEndedTutorExercise', { id })
            ),
            scores: (id, mock) => (
                Factory.create('TaskPlanScores', {
                    task_plan: mock.data.plan(id),
                    grades: {},
                    course: mock.course(COURSE_ID),
                    exercises: mock.data.exercises(id),
                })
            ),
        },
        routes: {
            '/api/steps/:id/grade': async ({ request, mock, params: { id } }) => {
                GRADES[id] = request.postDataJSON()
                return merge({}, mock.data.plan(id), request.postDataJSON())
            },
            '/api/plans/:id/scores*': async ({ mock, params: { id } }) => {
                // const _scores = mock.data.scores(id)
                const _scores = Factory.create('TaskPlanScores', {
                    task_plan: mock.data.plan(id),
                    grades: {},
                    course: mock.course(COURSE_ID),
                    exercises: mock.data.exercises(id),
                })
                _scores.tasking_plans.forEach((tp: any) => {
                    // tp.question_headings.forEach((qh: any) => {
                    //     qh.question_id = qh.exercise.content.questions[0].id
                    // })
                    tp.students.forEach((s: any) => {
                        s.questions.forEach((q: any) => {
                            const grade = GRADES[q.task_step_id]
                            if (grade) {
                                Object.assign(q, grade);
                                q.needs_grading = isNil(grade.grader_points)
                            }
                        })
                    })
                })
                return _scores
            },
            '/api/plans/:planId/stats': async ({ mock, params: { planId } }) => (
                Factory.create('TaskPlanStat', {
                    task_plan: mock.data.plan(planId),
                    exercises: mock.data.exercises(planId),
                })
            ),
            '/api/courses/:courseId/roster': async ({ mock }) => {
                const course = mock.course(COURSE_ID)
                const roster = Factory.create('CourseRoster', { course })
                const [ t ] = roster.teachers
                t.role_id = course?.roles?.find(r => r.type == 'teacher')?.id
                t.is_active = true

                return roster
            },
        },
    })

    beforeEach(async () => {
        await setTimeouts()
    })

    it('loads and views questions', async () => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/grade/3`)
        await expect(page).toHaveSelector('testEl=question-0')
        // await page.waitForTimeout(9999100)
    })

    it('changes focused student once graded', async () => {
        await visitPage(page, `/course/${COURSE_ID}/assignment/grade/3`)
        await page.click('testEl=question-0')
        await expect(page).toHaveSelector('testEl=student-answer')
        await page.type('[data-test-id=student-answer] input[name=score]', '0.9')
        await page.type('[data-test-id=student-answer] textarea[name=comment]', 'i like this answer a lot!')
        await page.click('[data-test-id=save-grade-btn]')
        await page.waitForTimeout(100)
        // the currently focused student should have changed and fields reset
        expect(await page.evaluate(() =>
            document.querySelector('[data-test-id=student-answer]')?.getAttribute('data-student-id')
        )).toBeNull()
        expect(await page.evaluate(() =>
            (<HTMLInputElement>document.querySelector('[data-test-id=student-answer] input[name=score]')).value
        )).toBe('')
        expect(await page.evaluate(() =>
            (<HTMLInputElement>document.querySelector('[data-test-id=student-answer] textarea[name=comment]')).value
        )).toBe('')
    })

})
