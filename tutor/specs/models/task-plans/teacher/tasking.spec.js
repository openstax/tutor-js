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
      closes_at: '2015-10-15 07:00',
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

    // tasking.setOpensTime('1:42');
    // expect(tasking.opens_at).toEqual('2016-10-14T06:42:00.000Z');

    // tasking.setOpensTime('15:00'); // past due date, clips to that
    // expect(tasking.opens_at).toEqual('2016-10-14T11:59:00.000Z');

    tasking.setOpensDate('2016-10-11T21:18:00.000Z');
    // should have been accepted without changes
    expect(tasking.opens_at).toEqual('2016-10-11T21:18:00.000Z');

    expect(tasking.closes_at).toEqual('2015-10-15T12:00:00.000Z')

    // test setting due date to after closes_at: it clips to same as closes_at
    tasking.setDueDate('2016-01-20T12:00:00.000Z');
    expect(tasking.due_at).toEqual('2015-10-15T12:00:00.000Z');
  });

  it('#initializeWithDueAt', () => {
    expect(course.timezone).toEqual('US/Central');

    const defaults = {
      defaultOpenTime: '10:20',
      defaultDueTime: '15:40',
    }

    tasking.opens_at = '2015-10-21T12:00:00.000Z';

    // simple case, no conflict with opens
    tasking.initializeWithDueAt({ dueAt: '2015-10-25T12:00:00.000Z', ...defaults });
    expect(tasking.due_at).toEqual('2015-10-25T20:40:00.000Z'); // same date but -5hours tz
    expect(tasking.opens_at).toEqual('2015-10-21T12:00:00.000Z'); // unchanged

    // set to before the opens_at
    tasking.initializeWithDueAt({ dueAt: '2015-10-20T12:00:00.000Z', ...defaults });
    expect(tasking.due_at).toEqual('2015-10-20T20:40:00.000Z'); // same date but -5hours tz
    expect(tasking.opens_at).toEqual('2015-10-14T15:20:00.000Z'); // set to Time.now but with time -5hours tz

    // set to before the now
    tasking.initializeWithDueAt({ dueAt: '2015-10-01T12:00:00.000Z', ...defaults });
    expect(tasking.due_at).toEqual(moment(now).add(30, 'minutes').toISOString());
    expect(tasking.opens_at).toEqual(moment(now).add(29, 'minutes').toISOString());
  });
});
