import { TimeMock, Factory, Time } from '../../../helpers';
import TeacherTaskPlan from '../../../../src/models/task-plans/teacher/plan';

describe('Task Plan for Teachers', () => {
    let plan: TeacherTaskPlan;

    const now = new Date('Thu Aug 3 2017 16:53:12 GMT-0500 (CDT)');
    TimeMock.setTo(now);

    beforeEach(() => {
        const course = Factory.course();
        const plans = Factory.teacherTaskPlans({ course });
        plan = plans.array[0];
    });

    it('calculates due range', () => {
        plan.tasking_plans.forEach((tp, i) => {
            tp.due_at = Time.now.plus({ day: i }).asISOString
        });
        expect(
            Time.now.isSame(plan.interval.start, 'minute')
        ).toBe(true);
        expect(
            Time.now.plus({ day: plan.tasking_plans.length - 1 }).isSame(
                plan.interval.end, 'minute'
            )
        ).toBe(true);
    });

});
