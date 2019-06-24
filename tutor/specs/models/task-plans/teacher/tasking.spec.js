import moment from 'moment';
import { Factory, TimeMock } from '../../../helpers';

describe('Teacher tasking plan tasking', () => {
  let course, plan, tasking;

  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(() => {
    course = Factory.course({ now, is_teacher: true });
    plan = Factory.teacherTaskPlan({ now, course });
    tasking = plan.tasking_plans[0];
    tasking.due_at = now.toISOString();
    tasking.opens_at = now.toISOString();
  });

  it('sets open/due', () => {
    tasking.setOpensDate(moment(now).year(2016));
    expect(tasking.opens_at).toEqual(
      '2016-10-14T12:00:00.000Z'
    );

    const n = moment(now).hour(2).minute(18).second(23);
    tasking.setOpensTime(n);
    expect(tasking.opens_at).toEqual(
      '2016-10-14T07:18:23.000Z'
    );
  });
});
