import { Factory, ld } from '../../../helpers';

describe('Task Plan Stats', () => {

    let stat, plan, exercises;

    beforeEach(() => {
        const course = Factory.course();
        exercises = ld.times(4).map(() => Factory.tutorExercise())
        plan = Factory.teacherTaskPlan({ course, exercises });
        stat = Factory.taskPlanStat({ task_plan: plan, exercises });
    });

    it('generats stats for periods', () => {
        expect(stat.stats.length).toEqual(plan.course.periods.length);
    });

    it('calculates stats for question', () => {
        const question = exercises[1].content.questions[0]
        expect(stat.stats[0].statsForQuestion(question)).toMatchObject({
            question_id: question.id,
        });
    });

});
