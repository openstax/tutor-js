import { TimeMock, Factory } from '../../../helpers';
import moment from 'moment';

describe('Task Plan for Teachers', () => {
  let plan;

  const now = new Date('Thu Aug 3 2017 16:53:12 GMT-0500 (CDT)');
  TimeMock.setTo(now);

  beforeEach(() => {
    const course = Factory.course();
    const plans = Factory.teacherTaskPlans({ course });
    plan = plans.array[0];
  });

  it('calculates due range', () => {
    plan.tasking_plans.forEach((tp, i) => {
      tp.due_at = moment(now).add(i, 'day').toDate();
    });
    expect(
      moment(now).isSame(plan.duration.start),
    ).toBe(true);
    expect(
      moment(now).add(plan.tasking_plans.length-1, 'day').isSame(
        plan.duration.end
      ),
    ).toBe(true);
  });


});
