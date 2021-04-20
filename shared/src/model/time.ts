import { DateTime as LDT, DurationUnit, Interval as LDTInterval, DateObjectUnits, DurationObject, Zone } from 'luxon'
import { map, compact, flatten, max, min } from 'lodash';
import { readonly } from 'core-decorators'
import { isString, isNumber, isDate } from 'lodash'
import { modelize } from 'modeled-mobx'
import { observable } from 'mobx'
import moment from 'moment';
import { extendMoment } from 'moment-range';
import pluralize from 'pluralize';
import { now as getNow } from 'mobx-utils'

const { range } = extendMoment(moment as any);

//console.log({ range })

let shiftMs = 0;
const defaultResolution = 1000 * 60; // one minute resolution
let timeResolution = defaultResolution;

export function setNow(now: Date | string) {
    if (!isDate(now)) {
        now = now ? new Date(now) : new Date();
    }
    shiftMs = now.getTime() - (new Date()).getTime();
}

export function setResolution(r = defaultResolution) {
    timeResolution = r;
}

const Store = {
    DATE_FORMAT: 'MM/DD/YYYY',
    get now() {
        const now = getNow(timeResolution);
        return new Date(now + shiftMs);
    },
};


export type { DurationUnit }
export type ComparableValue = Date | Time | LDT
export type TimeInputs = Time | Date | string | number | LDT


export default class Time {
    static get now() {
        return new Time(Store.now)
    }

    @readonly static unknown = new Time(new Date(0))

    static hydrate(dateThing: TimeInputs) {
        return new Time(dateThing)
    }

    _value!: LDT

    constructor(dateThing: TimeInputs) {
        modelize(this, {
            _value: observable,
        })
        this._value = toLDT(dateThing)
    }

    // called by modeled-mobx to store value as json
    serialize() { return this.asISOString }

    diff(other: TimeInputs, unit: DurationUnit) {
        return Math.trunc(this._value.diff(toLDT(other), unit).get(unit))
    }
    distanceToNow(unit: DurationUnit) { return this.diff(Time.now, unit) }

    set(values: DateObjectUnits) { return new Time(this._value.set(values)) }

    startOf(unit: DurationUnit) { return new Time(this._value.startOf(unit)) }
    endOf(unit: DurationUnit) { return new Time(this._value.endOf(unit)) }

    get asISOString() { return this._value.toUTC().toISO() }
    get asMoment() { return moment(this._value.toJSDate()) }
    get asDate() { return this._value.toJSDate() }
    get asDateTime() { return this._value }

    get intervalToNow() { return new Interval(this, new Time(Time.now)) }
    intervalTo(other: TimeInputs) { return new Interval(this, toLDT(other)) }

    toISOString() { return this.asISOString }
    toString() { return this.asISOString }

    inZone(zone: Zone|string) { return new Time(this._value.setZone(zone)) }

    minus(duration: DurationObject) { return new Time(this._value.minus(duration)) }
    plus(duration: DurationObject) { return new Time(this._value.plus(duration)) }

    isBefore(compareTo: ComparableValue, unit: DurationUnit = 'millisecond') { return this.diff(compareTo, unit) < 0 }
    get isInPast() { return this.isBefore(Time.now) }

    isAfter(compareTo: ComparableValue, unit: DurationUnit = 'millisecond') { return this.diff(compareTo, unit) > 0 }
    get isInFuture() { return this.isAfter(Time.now) }

    isSame(other: ComparableValue, unit: DurationUnit) { return this.diff(other, unit) == 0 }
    isSameOrBefore(other: ComparableValue, unit: DurationUnit = 'millisecond') { return this.diff(other, unit) <= 0 }
    isSameOrAfter(other: ComparableValue, unit: DurationUnit = 'seconds') { return this.diff(other, unit) >= 0 }

    get isUnknown() { return this._value === Time.unknown._value }
    get isValid() { return Boolean(!this.isUnknown && this._value.isValid) }

    toFormat(fmt: string) { return this._value.toFormat(fmt) }
    // left for comatibility with momentjs, do not use for new code
    format(fmt: string) { return this.asMoment.format(fmt) }
}

function toLDT(dateThing: TimeInputs):LDT {
    if (isDate(dateThing)){
        return LDT.fromJSDate(dateThing)
    } else if (dateThing instanceof Time) {
        return dateThing._value // n.b. we're copying _value which should be safe since it's never mutated
    } else if (isString(dateThing)) {
        return LDT.fromISO(dateThing)
    } else if (isNumber(dateThing)) {
        return LDT.fromMillis(dateThing)
    } else if (LDT.isDateTime(dateThing)) {
        return dateThing
    } else if (moment.isMoment(dateThing)) {
        return LDT.fromMillis((dateThing as any).valueOf())
    } else {
        throw new Error(`attempted to hydrate unknown date type ${typeof dateThing} (${dateThing})`)
    }
}

export function findEarliest(dateThing: TimeInputs, ...dateThings: TimeInputs[]): Time {
    return new Time(min(compact(map(flatten([dateThing, ...dateThings]), toLDT))) as LDT)
}

export function findLatest(dateThing: TimeInputs, ...dateThings: TimeInputs[]): Time {
    return new Time(max(compact(map(flatten([dateThing, ...dateThings]), toLDT))) as LDT)
}

export class Interval {
    start: Time
    end: Time
    constructor(start: TimeInputs, end: TimeInputs) {
        this.start = new Time(start)
        this.end = new Time(end)
    }
    get asLuxon() { return LDTInterval.fromDateTimes(this.start._value, this.end._value) }

    length(unit: DurationUnit = 'seconds') {
        return this.asLuxon.length(unit)
    }

    get humanized() {
        const { days, hours, minutes } = this.asLuxon.toDuration(['days', 'hours', 'minutes'])
        let str: string[] = []
        if (days)  str.push(pluralize('day', days, true))
        if (hours) str.push(pluralize('hour', hours, true))
        if (minutes) str.push(pluralize('minute', minutes, true))
        return str.join(' ')
    }

    get asMoment() {
        return range(this.start.asDate, this.end.asDate)
    }
}
