import type CoursePeriod from '../models/course/period'
import { sortBy, isNumber } from 'lodash';
import S from './string';

const PeriodHelper = {
    getOrder(period: CoursePeriod) {
        return S.getNumberAndStringOrder(period.name);
    },

    sort(periods: CoursePeriod[]): CoursePeriod[] {
        // expects either numbers, names with numbers or just names
        periods = sortBy(periods, (period) => { // eslint-disable-line consistent-return
            if (!isNumber(period.name)) {
                const name = period.name.match(/[^0-9]+/ig);
                if (name) {
                    return name;
                }
            }
        });
        return sortBy(periods, (period) => { // eslint-disable-line consistent-return
            if (!isNumber(period.name)) {
                const number = period.name.match(/[0-9.-]+/g);
                return number ? parseFloat(number) : null;
            } else {
                return period.name;
            }
        });
    },

};


export default PeriodHelper;
