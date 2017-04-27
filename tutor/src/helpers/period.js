import S from './string';
import { filter, isEmpty, sortBy, toNumber, isNumber } from 'lodash';

// Used to filter periods by helper methods
const isArchivedCheckFn = period => period.is_archived;
const isActiveCheckFn   = period => !period.is_archived;

const NumberLike = /[^0-9]+/;

const PeriodHelper = {
  getOrder(period) {
    return S.getNumberAndStringOrder(period.name);
  },

  sort(periods) {
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
        if (number) {
          return parseFloat(number);
        }
      } else {
        return period.name;
      }
    });
  },

  activePeriods(course) {
    return filter(course.periods, isActiveCheckFn);
  },

  hasPeriods(course) {
    return !isEmpty(this.activePeriods(course));
  },

  archivedPeriods(course) {
    return filter(course.periods, isArchivedCheckFn);
  },
};

export default PeriodHelper;
