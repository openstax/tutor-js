import Plan from '../../../src/screens/assignment-builder/plan';
import { Factory } from '../../helpers';


describe('CourseCalendar Header', function() {
  let course;
  let plan;

  beforeEach(() => {
    course = Factory.course();
    plan = new Plan(Factory.bot.create('TeacherTaskPlan'));
  });

  it('tasking plan changed', () => {
    expect(plan.isTaskingDateChanged).toBe(false);
    plan.onApiRequestComplete({
      tasking_plans: [{
        id: 1,
        opens_at: '2018-01-02', due_at: '2018-01-02',
      }]
    })
    //console.log(plan)
  });
});
