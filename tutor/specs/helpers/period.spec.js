import { each, shuffle, map } from 'lodash';

import PeriodHelper from '../../src/helpers/period';

const sortPeriods = [
    [
        {
            name: '0',
        },
        {
            name: '0th',
        },
        {
            name: '1',
        },
        {
            name: '1st',
        },
        {
            name: '1th',
        },
        {
            name: '2',
        },
        {
            name: '9th',
        },
        {
            name: '10.5th',
        },
        {
            name: '10.25',
        },
        {
            name: '10th',
        },
        {
            name: '10th',
        },
        {
            name: '12.245th',
        },
        {
            name: '12.246th',
        },
        {
            name: '90',
        },
        {
            name: 'Block B',
        },
        {
            name: 'Block b',
        },
        {
            name: 'monKeys',
        },
        {
            name: 'monkeys',
        },
        {
            name: 'Period 2',
        },
        {
            name: 'Period 2-1',
        },
        {
            name: 'Period 2-2',
        },
        {
            name: 'Period 10',
        },
        {
            name: 'th',
        },
    ],
];


describe('Period helpers', () => {

    it('helps sort strings and numbers', function() {
        each(sortPeriods, function(periods) {
            const randoedPeriods = shuffle(periods);
            const sortedByFunction = PeriodHelper.sort(randoedPeriods);

            expect(map(map(sortedByFunction, 'name'), 'toLowerCase').join()).toEqual(
                map(map(periods, 'name'), 'toLowerCase').join()
            );
        });
    });

});
