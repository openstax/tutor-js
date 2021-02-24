import * as Dates from '../../src/helpers/dates';
import moment from 'moment';


describe('Date Helpers', () => {
    it('finds earliest date', () => {
        const first = Dates.findEarliest([
            '2010-01-01',
            new Date('2020-01-01'),
            moment('2000-01-01T00:00:00.001Z'),
        ]);
        expect(first.toISOString()).toBe('2000-01-01T00:00:00.001Z');
    });

    it('finds latest date', () => {
        const last = Dates.findLatest([
            '2010-01-01',
            new Date('2020-01-01'),
            moment('2000-01-01T00:00:00.001Z'),
        ]);
        expect(last.toISOString()).toBe('2020-01-01T00:00:00.000Z');
    });
});
