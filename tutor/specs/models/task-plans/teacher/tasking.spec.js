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

  it('sets open/due but not past the opposing open/due', () => {
    tasking.setOpensDate(moment(now).year(2016));

    tasking.due_at = '2016-10-14T12:00:00.000Z';
    tasking.setOpensDate('2016-10-20T12:00:00.000Z');
    expect(tasking.opens_at).toEqual('2016-10-14T12:00:00.000Z');

    tasking.setOpensTime('2016-10-20T19:42:00.000Z');
    expect(tasking.opens_at).toEqual('2016-10-14T12:00:00.000Z');

    tasking.setOpensDate('2016-10-10T18:18:00.000Z');

    expect(tasking.opens_at).toEqual('2016-10-10T12:00:00.000Z');

    tasking.setDueDate('2016-01-20T12:00:00.000Z');
    expect(tasking.due_at).toEqual('2016-10-10T12:00:00.000Z');

    tasking.setDueTime('2016-10-10T22:42:00.000Z');
    expect(tasking.due_at).toEqual('2016-10-10T12:42:00.000Z');
  });

  it('#defaultOpensAt', () => {
    const [ hour, minute ] = plan.course.default_open_time.split(':');
    const inCourseTime = (date) => moment(date).hour(hour).minute(minute).startOf('minute').toISOString();
    plan.course.starts_at = moment(now).subtract(1, 'week');
    plan.course.ends_at = moment(now).add(1, 'week');

    expect(tasking.defaultOpensAt()).toEqual(inCourseTime(moment(now).add(1, 'day')));

    course.ends_at = moment(now); // should not add a day
    expect(tasking.defaultOpensAt()).toEqual(inCourseTime(plan.course.ends_at));

    // should start on first day open
    course.starts_at = moment(now).add(1, 'week');
    expect(tasking.defaultOpensAt()).toEqual(inCourseTime(plan.course.starts_at));
  });

});
