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
            closes_at: '2015-10-19 07:00',
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

    it('sets the closes_at the same as due_at if the plan type is an event', () => {
        const due_at = '2015-10-15 07:00';
        plan.type = 'event';
        tasking.setDueDate(moment(due_at));

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

    it('should return invalid if dates are not in order', () => {
    // opens_at is after due_at
        let opens_at = '2015-10-17T12:00:00.000Z';
        let due_at = '2015-10-15T12:00:00.000Z';
        let closes_at = '2015-10-16T12:00:00.000Z';
    
        tasking.setOpensDate(moment(opens_at));
        tasking.setDueDate(moment(due_at));
        tasking.setClosesDate(moment(closes_at));
        expect(tasking.isValid).toEqual(false);

        // closes_at is after due_at
        opens_at = '2015-10-15T12:00:00.000Z';
        due_at = '2015-10-18T12:00:00.000Z';
        closes_at = '2015-10-16T12:00:00.000Z';
    
        tasking.setOpensDate(moment(opens_at));
        tasking.setDueDate(moment(due_at));
        tasking.setClosesDate(moment(closes_at));
        expect(tasking.isValid).toEqual(false);

        // due_at is before current time
        opens_at = '2015-10-11T12:00:00.000Z';
        due_at = '2015-10-13T12:00:00.000Z';
        closes_at = '2015-10-14T12:00:00.000Z';
    
        tasking.setOpensDate(moment(opens_at));
        tasking.setDueDate(moment(due_at));
        tasking.setClosesDate(moment(closes_at));
        expect(tasking.isValid).toEqual(false);

    });

    it('should return valid if dates are in order', () => {
        let opens_at = '2015-10-18T12:00:00.000Z';
        let due_at = '2015-10-20T12:00:00.000Z';
        let closes_at = '2015-10-31T12:00:00.000Z';
    
        tasking.setOpensDate(moment(opens_at));
        tasking.setDueDate(moment(due_at));
        tasking.setClosesDate(moment(closes_at));
        expect(tasking.isValid).toEqual(true);
    });
});
