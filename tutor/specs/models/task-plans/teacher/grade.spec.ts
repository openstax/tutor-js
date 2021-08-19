import { TeacherTaskStepGrade, TaskPlanScoreStudentQuestion } from '../../../../src/models'
import { fetchMock } from '../../../helpers'


describe(TeacherTaskStepGrade, () => {
    let grade!: TeacherTaskStepGrade
    let points: number
    let comment: string
    const response = new TaskPlanScoreStudentQuestion()

    beforeEach(() => {
        points = 1.0
        comment = 'Good job'
        response.update({
            'task_step_id': 42,
            'attempt_number': 2,
            'free_response': 'An answer explaining all the things!',
        })
        grade = new TeacherTaskStepGrade({ points, comment, response })
    })

    it('echoes back the attempt_number when saving', async () => {
        const saveResponse = new TaskPlanScoreStudentQuestion()
        saveResponse.update({
            'task_step_id': 42,
            'attempt_number': 2,
            'free_response': 'An answer explaining all the things!',
            'grader_points': points,
            'grader_comments': comment,
        })
        fetchMock.mockResponseOnce(JSON.stringify(saveResponse))
        await grade.save()
        expect(fetchMock).toHaveBeenCalled()
        expect(fetchMock.mock.calls[0][0]).toEqual('http://localhost/api/steps/42/grade')
        expect((fetchMock.mock.calls[0][1] || {})['method']).toEqual('PUT')
        const body = JSON.parse(((fetchMock.mock.calls[0][1] || {})['body'] || '{}').toString())
        expect(body['attempt_number']).toEqual(2)
        expect(body['grader_comments']).toEqual('Good job')
        expect(body['grader_points']).toEqual(1)
    })
})
