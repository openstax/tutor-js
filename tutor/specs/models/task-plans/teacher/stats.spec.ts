import type { TeacherTaskPlan } from '../../../../src/models'
import { Factory, ld } from '../../../helpers';

describe('Task Plan Stats', () => {

    let plan!: TeacherTaskPlan;
    let stat: ReturnType<typeof Factory.taskPlanStats>
    let exercises: ReturnType<typeof Factory.tutorExercise>[]

    beforeEach(() => {
        const course = Factory.course();
        exercises = ld.times(4).map(() => Factory.tutorExercise())
        plan = Factory.teacherTaskPlan({ course, exercises });
        stat = Factory.taskPlanStats({ task_plan: plan, exercises });
    });

    it('generats stats for periods', () => {
        expect(stat.stats.length).toEqual(plan.course.periods.length);
    });


    // it('calculates stats for question', () => {
    //     const question = exercises[1].content.questions[0]
    //     expect(stat.stats[0].statsForQuestion(question)).toMatchObject({
    //         question_id: question.id,
    //     });
    // });

});
