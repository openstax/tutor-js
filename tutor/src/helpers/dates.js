import moment from 'moment';
import 'twix';
import 'moment-timezone';
import { reduce } from 'lodash';

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
