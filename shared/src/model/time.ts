import {
    DateTime as LDT, DurationUnit, Interval as LDTInterval, DateObjectUnits, DurationObject, Zone, Settings, DurationObjectUnits,
} from 'luxon'
import { map, compact, flatten, max, min, isString, isNumber, isDate } from 'lodash';
import { readonly } from 'core-decorators'
import { modelize } from 'modeled-mobx'
import { observable } from 'mobx'
import moment from 'moment';
import { extendMoment } from 'moment-range';
import pluralize from 'pluralize';
import { now as getNow } from 'mobx-utils'
import { toSentence } from '../helpers/string';

const { range } = extendMoment(moment as any);

// https://moment.github.io/luxon/docs/manual/formatting
type LocaleFormat = 'DATE_SHORT' | 'DATE_MED' | 'DATE_MED_WITH_WEEKDAY' | 'DATE_FULL' | 'DATE_HUGE' | 'TIME_SIMPLE' | 'TIME_WITH_SECONDS' | 'TIME_WITH_SHORT_OFFSET' | 'TIME_WITH_LONG_OFFSET' | 'TIME_24_SIMPLE' | 'TIME_24_WITH_SECONDS' | 'TIME_24_WITH_SHORT_OFFSET' | 'TIME_24_WITH_LONG_OFFSET' | 'DATETIME_SHORT' | 'DATETIME_MED' | 'DATETIME_FULL' | 'DATETIME_HUGE' | 'DATETIME_SHORT_WITH_SECONDS' | 'DATETIME_MED_WITH_SECONDS' | 'DATETIME_FULL_WITH_SECONDS' | 'DATETIME_HUGE_WITH_SECONDS'

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

export type DATE_TIME_FORMAT = keyof typeof LDT // DateTimeFormatOptions


export default class Time {
    static get now() {
        return new Time(Store.now)
    }

    @readonly static unknown = new Time(new Date(0))

    static get defaultZoneName() { return Settings.defaultZoneName }
    static set defaultZoneName(zone: string) { Settings.defaultZoneName = zone }

    static hydrate<T extends undefined>(dateThing: T): undefined // eslint-disable-line
    static hydrate<T extends TimeInputs>(dateThing: T): Time // eslint-disable-line
    static hydrate<T extends TimeInputs | undefined>(dateThing: T)  { // eslint-disable-line
        if (dateThing) {
            return new Time(dateThing as TimeInputs)
        }
        return undefined
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

    fractionalDiff(other: TimeInputs, unit: DurationUnit = 'millisecond') {
        return this._value.diff(toLDT(other), unit).get(unit)
    }

    diff(other: TimeInputs, unit: DurationUnit = 'millisecond') {
        return Math.trunc(this.fractionalDiff(other, unit))
    }

    distanceToNow(unit: DurationUnit = 'millisecond') { return this.diff(Time.now, unit) }

    set(values: DateObjectUnits) { return new Time(this._value.set(values)) }

    startOf(unit: DurationUnit) { return new Time(this._value.startOf(unit)) }
    endOf(unit: DurationUnit) { return new Time(this._value.endOf(unit)) }

    get asISOString() { return this._value.toUTC().toISO() }
    get asISODateString() { return this.toFormat('yyyy-LL-dd') }

    get asMoment() { return moment(this._value.toJSDate()) }
    get asDate() { return this._value.toJSDate() }
    get asDateTime() { return this._value }

    get intervalToNow() { return this.intervalTo(Time.now) }
    intervalTo(other: TimeInputs) {
        const end = toLDT(other)
        if (this.isBefore(end)) {
            return new Interval({ start: this, end })
        }
        return new Interval({ start: end, end: this })
    }


    toISOString() { return this.asISOString }
    toString() { return this.asISOString }

    inZone(zone: Zone|string) { return new Time(this._value.setZone(zone)) }
    get zoneName() { return this._value.zoneName }

    minus(duration: DurationObject) { return new Time(this._value.minus(duration)) }
    plus(duration: DurationObject) { return new Time(this._value.plus(duration)) }

    isBefore(compareTo: ComparableValue, unit: DurationUnit = 'millisecond') {
        return this.fractionalDiff(compareTo, unit) < -1.0
    }
    get isInPast() { return this.isBefore(Time.now) }

    isAfter(compareTo: ComparableValue, unit: DurationUnit = 'millisecond') {
        return this.fractionalDiff(compareTo, unit) > 1.0
    }
    get isInFuture() { return this.isAfter(Time.now) }

    isSame(other: ComparableValue, unit: DurationUnit) { return this._value.hasSame(toLDT(other), unit) }
    isSameOrBefore(other: ComparableValue, unit: DurationUnit = 'millisecond') { return this.isSame(other, unit) || this.diff(other, unit) <= 0 }
    isSameOrAfter(other: ComparableValue, unit: DurationUnit = 'seconds') { return this.isSame(other, unit) || this.diff(other, unit) >= 0 }

    isBetween(start: ComparableValue, end: ComparableValue, unit: DurationUnit = 'millisecond') {
        return Boolean(
            this.isAfter(start, unit) && this.isBefore(end, unit)
        )
    }

    get isUnknown() { return this._value === Time.unknown._value }
    get isValid() { return Boolean(!this.isUnknown && this._value.isValid) }

    toLocaleString(fmt: LocaleFormat) { return this._value.toLocaleString(LDT[fmt]) }

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
        return LDT.invalid(dateThing ? `unknown date type ${typeof dateThing} (${dateThing})` : 'undefined/null value')
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
    constructor({ start, end }: { start: TimeInputs, end: TimeInputs }) {
        this.start = new Time(start)
        this.end = new Time(end)
    }
    get asLuxon() { return LDTInterval.fromDateTimes(this.start._value, this.end._value) }

    length(unit: DurationUnit = 'seconds') {
        return this.asLuxon.length(unit)
    }

    get humanized() {
        const durations = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'] as any as keyof DurationObjectUnits
        const values = this.asLuxon.toDuration(durations)
        for (let i = 0; i < durations.length - 1; i++) {
            if (values[durations[i]]) {
                return pluralize(durations[i], values[durations[i]], true)
            }
        }
        return 'now'
    }

    get asSentence() {
        const { days, hours, minutes } = this.asLuxon.toDuration(['days', 'hours', 'minutes', 'seconds'])
        let str: string[] = []
        if (days)  str.push(pluralize('day', days, true))
        if (hours) str.push(pluralize('hour', hours, true))
        if (minutes) str.push(pluralize('minute', minutes, true))
        return toSentence(str)
    }

    get asMoment() {
        return range(this.start.asDate, this.end.asDate)
    }

    contains(date: TimeInputs) {
        const d = new Time(date)
        return Boolean(this.start.isSameOrBefore(d) && this.end.isSameOrAfter(d))
    }
}
