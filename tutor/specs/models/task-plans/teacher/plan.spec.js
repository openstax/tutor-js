import Plan from '../../../../src/models/task-plans/teacher/plan';
import { Factory } from '../../../helpers';

describe('CourseCalendar Header', function() {
  let plan;

  beforeEach(() => {
    plan = Factory.teacherTaskPlan();
  });

  it('tasking plan changed', () => {
    expect(plan.hasTaskingDatesChanged).toBe(false);
    plan.tasking_plans[0].opens_at = '2018-01-20';
    expect(plan.hasTaskingDatesChanged).toBe(true);
    plan.onApiRequestComplete({
      data: {
        tasking_plans: [{
          opens_at: '2018-01-02', due_at: '2018-01-02',
        }],
      },
    });
    expect(plan.hasTaskingDatesChanged).toBe(false);
  });
});
