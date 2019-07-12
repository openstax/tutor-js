import moment from 'moment';
import 'twix';
import 'moment-timezone';
import { compact, reduce, min, max, map } from 'lodash';

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
  const time = moment(t);
  return moment(date)
    .hour(time.hour()).minute(time.minute()).seconds(time.seconds()).millisecond(0);
}
