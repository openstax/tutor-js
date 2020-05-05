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

  it('converts to course time for save', () => {
    expect(course.timezone).toEqual('US/Central');
    expect(tasking.dataForSave).toEqual({
      target_type: 'period',
      target_id: course.periods[0].id,
      due_at: '2015-10-14 07:00',  // 12am - 5 hours
      opens_at: '2015-10-14 07:00',
    });
  });

  it('finds unmodified version', () => {
    const attrs = { target_id: '123', target_type: 'test' };
    plan.unmodified_plans.push(attrs);
    tasking.update(attrs);
    expect(tasking.unmodified).toEqual(attrs);
  });

  it('calculates if the opens_at can be edited', () => {
    plan.is_published = false;
    expect(tasking.canEditOpensAt).toBe(true);
    plan.is_published = true;
    tasking.unmodified.opens_at = '2015-10-10T12:00:00.000Z';
    expect(tasking.canEditOpensAt).toBe(false);
  });

  it('sets open/due but not past the opposing open/due', () => {
    tasking.setOpensDate(moment(now).year(2016));

    tasking.due_at = '2016-10-14T12:00:00.000Z';
    tasking.setOpensDate('2016-10-20T12:00:00.000Z');
    expect(tasking.opens_at).toEqual('2016-10-14T11:59:00.000Z');

    tasking.setOpensTime('1:42');
    expect(tasking.opens_at).toEqual('2016-10-14T06:42:00.000Z');

    tasking.setOpensTime('15:00'); // past due date, clips to that
    expect(tasking.opens_at).toEqual('2016-10-14T11:59:00.000Z');

    tasking.setOpensDate('2016-10-11T21:18:00.000Z');
    // only day changes, not time
    expect(tasking.opens_at).toEqual('2016-10-11T11:59:00.000Z');

    // test setting due date to before opens at
    tasking.setDueDate('2016-01-20T12:00:00.000Z');

    // clips to one minute after opens at
    expect(tasking.due_at).toEqual('2016-10-11T12:00:00.000Z');

    tasking.setDueTime('01:35'); // before the opens date, no change
    expect(tasking.due_at).toEqual('2016-10-11T12:00:00.000Z');

    tasking.setDueTime('22:15'); // converts to course time
    expect(tasking.due_at).toEqual('2016-10-12T03:15:00.000Z');
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

  it('#initializeWithDueAt', () => {
    expect(course.timezone).toEqual('US/Central');

    plan.course.default_open_time = '10:20';
    plan.course.default_due_time = '15:40';
    tasking.opens_at = '2015-10-21T12:00:00.000Z';

    // simple case, no conflict with opens
    tasking.initializeWithDueAt('2015-10-25T12:00:00.000Z');
    expect(tasking.due_at).toEqual('2015-10-25T20:40:00.000Z'); // same date but -5hours tz
    expect(tasking.opens_at).toEqual('2015-10-21T12:00:00.000Z'); // unchanged

    // set to before the opens_at
    tasking.initializeWithDueAt('2015-10-20T12:00:00.000Z');
    expect(tasking.due_at).toEqual('2015-10-20T20:40:00.000Z'); // same date but -5hours tz
    expect(tasking.opens_at).toEqual('2015-10-14T15:20:00.000Z'); // set to Time.now but with time -5hours tz

    // set to before the now
    tasking.initializeWithDueAt('2015-10-01T12:00:00.000Z');
    expect(tasking.due_at).toEqual(moment(now).add(30, 'minutes').toISOString());
    expect(tasking.opens_at).toEqual(moment(now).add(29, 'minutes').toISOString());
  });
});
