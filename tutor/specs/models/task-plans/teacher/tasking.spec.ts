import TeacherTaskPlan from '../../../../src/models/task-plans/teacher/plan';
import TaskingPlan from '../../../../src/models/task-plans/teacher/tasking';
import { Factory, TimeMock, Time } from '../../../helpers';

describe('Teacher tasking plan tasking', () => {
    const now = TimeMock.setTo('2015-10-14T12:00:00.000Z')

    let course = Factory.course({ now, is_teacher: true });
    let plan!: TeacherTaskPlan
    let tasking!: TaskingPlan

    beforeEach(() => {
        plan = Factory.teacherTaskPlan({ now, course });
        tasking = plan.tasking_plans[0];
        tasking.due_at = now.toISOString();
        tasking.opens_at = now.toISOString();
    })

    it('converts to course time for save', () => {
        expect(tasking.closes_at).toEqual('2015-10-19T12:00:00.000Z')
        expect(Time.now.format('YYYY-MM-DD')).toEqual('2015-10-14')
        expect(tasking.due_at).toEqual('2015-10-14T12:00:00.000Z')
        expect(course.timezone).toEqual('US/Central');

        expect(tasking.dataForSave).toEqual({
            target_type: 'period',
            target_id: course.periods[0].id,
            due_at: '2015-10-14 07:00',  // 12am - 5 hours
            opens_at: '2015-10-14 07:00',
            closes_at: '2015-10-19 07:00',
        });
    });

    it('finds unmodified version', () => {
        const attrs = { target_id: '123', target_type: 'test' };
        plan.unmodified_plans.push(attrs as any);
        tasking.update(attrs);
        expect(tasking.unmodified).toEqual(attrs);
    });

    it('calculates if the opens_at can be edited', () => {
        plan.is_published = false;
        expect(tasking.canEditOpensAt).toBe(true);
        plan.is_published = true;
        tasking.unmodified!.opens_at = '2015-10-10T12:00:00.000Z';
        expect(tasking.canEditOpensAt).toBe(false);
    });

    it('sets the closes_at the same as due_at if the plan type is an event', () => {
        const due_at = '2015-10-15 07:00';
        plan.type = 'event';
        tasking.setDueDate(new Time(due_at))
        expect(tasking.due_at).toEqual(tasking.closes_at);
    });

    it('#initializeWithDueAt', () => {
        expect(course.timezone).toEqual('US/Central');

        const defaults = {
            defaultOpenTime: '10:20',
            defaultDueTime: '15:40',
        }

        tasking.opens_at = '2015-10-21T12:00:00.000Z';

        // simple case, no conflict with opens
        tasking.initializeWithDueAt({ dueAt: new Time('2015-10-25T12:00:00.000Z'), ...defaults });
        expect(tasking.due_at).toEqual('2015-10-25T20:40:00.000Z'); // same date but -5hours tz
        expect(tasking.opens_at).toEqual('2015-10-21T12:00:00.000Z'); // unchanged

        // set to before the opens_at
        tasking.initializeWithDueAt({ dueAt: new Time('2015-10-20T12:00:00.000Z'), ...defaults });
        expect(tasking.due_at).toEqual('2015-10-20T20:40:00.000Z'); // same date but -5hours tz
        expect(tasking.opens_at).toEqual('2015-10-14T15:20:00.000Z'); // set to now but with time -5hours tz

        // set to before the now
        tasking.initializeWithDueAt({ dueAt: new Time('2015-10-01T12:00:00.000Z'), ...defaults });
        expect(tasking.due_at).toEqual(Time.now.plus({ minutes: 30 }).toISOString());
        expect(tasking.opens_at).toEqual(Time.now.plus({ minutes: 29 }).toISOString());
    });

    it('should return invalid if dates are not in order', () => {
        // opens_at is after due_at
        let opens_at = new Time('2015-10-17T12:00:00.000Z');
        let due_at = new Time('2015-10-15T12:00:00.000Z');
        let closes_at = new Time('2015-10-16T12:00:00.000Z');
    
        tasking.setOpensDate(opens_at);
        tasking.setDueDate(due_at);
        tasking.setClosesDate(closes_at);
        expect(tasking.isValid).toEqual(false);

        // closes_at is before due_at
        opens_at = new Time('2015-10-15T12:00:00.000Z')
        due_at = new Time('2015-10-18T12:00:00.000Z')
        closes_at = new Time('2015-10-16T12:00:00.000Z')
    
        tasking.setOpensDate(opens_at)
        tasking.setDueDate(due_at)
        tasking.setClosesDate(closes_at)

        // 2015-10-18T12:00:00.000Z 2015-10-16T12:00:00.000Z
        expect(tasking.isValid).toEqual(false);

        // due_at is before current time
        opens_at = new Time('2015-10-11T12:00:00.000Z')
        due_at = new Time('2015-10-13T12:00:00.000Z')
        closes_at = new Time('2015-10-14T12:00:00.000Z')
    
        tasking.setOpensDate(opens_at)
        tasking.setDueDate(due_at)
        tasking.setClosesDate(closes_at)
        expect(tasking.isValid).toEqual(false);

    });

    it('should return valid if dates are in order', () => {
        let opens_at = new Time('2015-10-18T12:00:00.000Z')
        let due_at = new Time('2015-10-20T12:00:00.000Z')
        let closes_at = new Time('2015-10-31T12:00:00.000Z')
    
        tasking.setOpensDate(opens_at)
        tasking.setDueDate(due_at)
        tasking.setClosesDate(closes_at)
        expect(tasking.isValid).toEqual(true);
    });
});
