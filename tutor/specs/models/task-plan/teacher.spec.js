import Factory from '../../factories';
import moment from 'moment';
import { TimeMock } from '../../helpers';

describe('Task Plan for Teachers', () => {
  let plan;

  const now = new Date('Thu Aug 3 2017 16:53:12 GMT-0500 (CDT)');
  TimeMock.setTo(now);

  beforeEach(() => {
    const course = Factory.course();
    const plans = Factory.taskPlans({ course });
    plan = plans.array[0];
  });

  it('calculates due range', () => {
    plan.tasking_plans.forEach((tp, i) => {
      tp.due_at = moment(now).add(i, 'day').toDate();
    });
    expect(
      moment(now).isSame(plan.dueRange.start),
    ).toBe(true);
    expect(
      moment(now).add(plan.tasking_plans.length-1, 'day').isSame(
        plan.dueRange.end
      ),
    ).toBe(true);
  });


});
