import Helpers from '../src/helpers/task';

describe('TaskHelpers', function() {

    it('returns false if task is not late', function() {
        const lateness = Helpers.getLateness({
            due_at: '2015-07-22T12:00:00.000Z',
            last_worked_at: '2015-07-21T17:09:44.012Z',
        });
        expect( lateness.is_late ).toBe(false);
        expect( lateness.how_late ).toBeNull();
    });

    it('calculates time differences if task is late by a day', function() {
        const lateness = Helpers.getLateness({
            due_at: '2015-07-22T12:00:00.000Z',
            last_worked_at: '2015-07-23T12:00:00.000Z',
        });
        expect( lateness.is_late ).toBe(true);
        expect( lateness.how_late ).toEqual('a day');
    });

    it('calculates time differences if task is late by a few minutes', function() {
        const lateness = Helpers.getLateness({
            due_at: '2015-07-22T12:00:00.000Z',
            last_worked_at: '2015-07-22T12:30:20.000Z',
        });
        expect( lateness.is_late ).toBe(true);
        expect( lateness.how_late ).toEqual('30 minutes');
    });
});
