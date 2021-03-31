import { DateTime as LDT, DurationUnit, Interval as LDTInterval, DateObjectUnits, DurationObject, Zone} from 'luxon'
import { map, compact, flatten, max, min } from 'lodash';
import { readonly } from 'core-decorators'
import { isString, isNumber, isDate } from 'lodash'
import { modelize } from 'modeled-mobx'
import { observable } from 'mobx'
import moment from 'moment'
import pluralize from 'pluralize';
import Time from './time'

export type { DurationUnit }
export type ComparableValue = Date | DateTime | LDT
export type DateTimeInputs = DateTime | Date | string | number | LDT

export default class DateTime {
    static get now() {
        return new DateTime(Time.now.getTime())
    }

    @readonly static unknown = new DateTime(new Date(0))

    static hydrate(iso: string) {
        return new DateTime(iso)
    }

    _value!: LDT

    constructor(dateThing: DateTimeInputs) {
        modelize(this, {
            _value: observable,
        })
        this._value = toLDT(dateThing)
    }

    diff(other: DateTimeInputs, unit: DurationUnit) { return Math.round(this._value.diff(toLDT(other), unit)[unit]) }
    distanceToNow(unit: DurationUnit) { return Math.round(this._value.diff(LDT.fromJSDate(Time.now), unit)[unit]) }

    serialize() { return this._value.toISO() }

    set(values: DateObjectUnits) { return new DateTime(this._value.set(values)) }

    startOf(unit: DurationUnit) { return new DateTime(this._value.startOf(unit)) }
    endOf(unit: DurationUnit) { return new DateTime(this._value.endOf(unit)) }

    get asISOString() { return this._value.toISO() }
    get asMoment() { return moment(this._value.toJSDate()) }
    get asDate() { return this._value.toJSDate() }
    get asDateTime() { return this._value }

    get intervalToNow() { return new Interval(this, new DateTime(Time.now)) }
    intervalTo(other: DateTimeInputs) { return new Interval(this, toLDT(other)) }

    toISOString() { return this.asISOString }
    toString() { return this.asISOString }

    inZone(zone: Zone|string) { return new DateTime(this._value.setZone(zone)) }

    minus(duration: DurationObject) { return new DateTime(this._value.minus(duration)) }
    plus(duration: DurationObject) { return new DateTime(this._value.plus(duration)) }

    isBefore(compareTo: ComparableValue) { return this.diff(compareTo, 'millisecond') > 0 }
    get isInPast() { return this.isBefore(Time.now) }

    isAfter(compareTo: ComparableValue) { return this.diff(compareTo, 'millisecond') < 0 }
    get isInFuture() { return this.isAfter(Time.now) }

    isSame(compareTo: ComparableValue, unit: DurationUnit) {
        return Math.trunc(this._value.diff(toLDT(compareTo), unit).get(unit)) == 0
    }

    isSameOrBefore(other: ComparableValue, unit: DurationUnit = 'seconds') {
        return Math.trunc(this._value.diff(toLDT(other)).get(unit)) <= 0
    }

    isSameOrAfter(other: ComparableValue, unit: DurationUnit = 'seconds') {
        return Math.trunc(this._value.diff(toLDT(other)).get(unit)) >= 0
    }

    isUnknown() { return this._value === DateTime.unknown._value }
    get isValid() { return Boolean(!this.isUnknown && this._value.isValid) }

    format(fmt: string) { return this._value.toFormat(fmt) }
}

function toLDT(dateThing: DateTimeInputs):LDT {
    if (isDate(dateThing)){
        return LDT.fromJSDate(dateThing)
    } else if (dateThing instanceof DateTime) {
        return dateThing._value // n.b. we're copying _value which should be safe since it's never mutated
    } else if (isString(dateThing)) {
        return LDT.fromISO(dateThing)
    } else if (isNumber(dateThing)) {
        return LDT.fromMillis(dateThing)
    } else if (LDT.isDateTime(dateThing)) {
        return dateThing
    } else if (moment.isMoment(dateThing)) {
        return LDT.fromMillis((dateThing as any).millisecond())
    } else {
        throw `attempted to hydrate unknown date type ${typeof dateThing} (${dateThing})`
    }
}

export function findEarliest(dateThing: DateTimeInputs, ...dateThings: DateTimeInputs[]): DateTime {
    return new DateTime(min(compact(map(flatten([dateThing, ...dateThings]), toLDT))) as LDT)
}

export function findLatest(dateThing: DateTimeInputs, ...dateThings: DateTimeInputs[]): DateTime {
    return new DateTime(max(compact(map(flatten([dateThing, ...dateThings]), toLDT))) as LDT)
}

export class Interval {
    start: DateTime
    end: DateTime
    constructor(start: DateTimeInputs, end: DateTimeInputs) {
        this.start = new DateTime(start)
        this.end = new DateTime(end)
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
}
