import type { CoursePeriod } from '../models'
import S from './string';


const PeriodHelper = {
    getOrder(period: CoursePeriod) {
        return S.getNumberAndStringOrder(period.name);
    },

    sort(periods: CoursePeriod[]) {
        return periods.slice(0).sort(
            (firstPeriod, secondPeriod) => firstPeriod.name.toLowerCase().localeCompare(
                secondPeriod.name.toLowerCase(), 'en', { numeric: true }
            )
        )
    },

};


export default PeriodHelper;
