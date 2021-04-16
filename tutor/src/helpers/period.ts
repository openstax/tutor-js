import type { CoursePeriod } from '../models'
import { sortBy } from 'lodash';
import S from './string';


const PeriodHelper = {
    getOrder(period: CoursePeriod) {
        return S.getNumberAndStringOrder(period.name);
    },

    sort(periods: CoursePeriod[]) {
        // sort first by non number values, then by numbers
        periods = sortBy(periods, (period) => { // eslint-disable-line consistent-return
            const name = period.name.match(/[^0-9]+/ig);
            if (name) {
                return name;
            }
            return undefined
        });
        return sortBy(periods, (period ) => { // eslint-disable-line consistent-return
            const number = period.name.match(/[0-9.-]+/g);
            if (number) {
                return parseFloat(number[0]);
            }
            return undefined
        });
    },

};


export default PeriodHelper;
