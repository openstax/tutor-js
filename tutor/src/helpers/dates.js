import moment from 'moment-timezone';
import 'twix';
import { reduce, pluck, union } from 'lodash';

export function getDay(oneMoment) {
  return moment(oneMoment)
    .startOf('day')
    .twix(moment(oneMoment).endOf('day'), { allDay: true });
}

export function getDurationFromMoments(listOfMoments) {
  return reduce(
    listOfMoments,
    (current, next) => current.union(getDay(next)),
    getDay(listOfMoments[0])
  );
}
