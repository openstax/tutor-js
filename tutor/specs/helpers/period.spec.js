import { each, shuffle, map } from 'lodash';

import PeriodHelper from '../../src/helpers/period';

const sortPeriods = [
    [
        {
            name: '0th',
        },
        {
            name: '0',
        },
        {
            name: '1st',
        },
        {
            name: '1th',
        },
        {
            name: '1',
        },
        {
            name: 'Period 2',
        },
        {
            name: '2',
        },
        {
            name: '9th',
        },
        {
            name: 'Period 10',
        },
        {
            name: '10th',
        },
        {
            name: '10th',
        },
        {
            name: '10.25',
        },
        {
            name: '10.5th',
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
            name: 'th',
        },
    ],
];


describe('Period helpers', () => {

    it('helps sort strings and numbers', function() {
        each(sortPeriods, function(periods) {
            const randoedPeriods = shuffle(periods);
            const sortedByFunction = PeriodHelper.sort(randoedPeriods);

            expect(map(sortedByFunction, 'name').join())
                .toEqual(map(periods, 'name').join());
        });
    });

});
