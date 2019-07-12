import moment from 'moment';
import 'twix';
import 'moment-timezone';
import { compact, reduce, min, max, map } from 'lodash';
import TimeHelper from './time';

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

export function findEarliest(dateThings) {
  return min(compact(map(dateThings, d =>
    moment.isMoment(d) ? d ? d.toDate() : new Date(Date.parse(d)) : null,
  )));
}

export function findLatest(dateThings) {
  return max(compact(map(dateThings, d =>
    moment.isMoment(d) ? d ? d.toDate() : new Date(Date.parse(d)) : null,
  )));
}


export function dateWithUnchangedTime(date, t) {
  if (moment.isMoment(date)) {
    date = date.format(TimeHelper.ISO_DATE_FORMAT);
  }
  return TimeHelper.getDateOnly(date);
}
