import moment from 'moment';
import 'twix';
import 'moment-timezone';
import { isNaN, compact, isDate, reduce, flatten, min, max, map } from 'lodash';

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

export function toDate(dateThing) {
    if (isDate(dateThing) && !isNaN(dateThing.getTime())){
        return dateThing;
    }
    const m = moment(dateThing);
    return m.isValid() ? m : null;
}

export function findEarliest(...dateThings) {
    return min(compact(map(flatten(dateThings), toDate)));
}

export function findLatest(...dateThings) {
    return max(compact(map(flatten(dateThings), toDate)));
}


export function dateWithUnchangedTime(date, t) {
    const time = moment(t);
    return moment(date)
        .hour(time.hour()).minute(time.minute()).seconds(time.seconds()).millisecond(0);
}
