import { DateTime as LDT } from 'luxon'
// import { parseISO, isBefore, isAfter } from 'date-fns'
import { readonly } from 'core-decorators'
import { isString, isNumber, isDate } from 'lodash'
import { modelize } from 'modeled-mobx'
import { observable } from 'mobx'
import Time from './time'

type ComparableValue = Date | DateTime | LDT

const toLDT = (val: ComparableValue):LDT => {
    if (isDate(val)) {
        return LDT.fromJSDate(val)
    } else if (LDT.isDateTime(val)) {
        return val
    } else {
        return val.asDateTime
    }
}

export default
class DateTime {
    static get now() {
        return new DateTime(Time.now.getTime())
    }

    @readonly static unknown = new DateTime(new Date(NaN))

    static hydrate(iso: string) {
        return new DateTime(iso)
    }

    private _value!: LDT

    constructor(dateThing: Date | string | number) {
        modelize(this, {
            _value: observable,
        })

        if (isString(dateThing)) {
            this._value = LDT.fromISO(dateThing)
        } else if (isNumber(dateThing)) {
            this._value = LDT.fromMillis(dateThing)
        } else if (isDate(dateThing)){
            this._value = LDT.fromJSDate(dateThing)
        } else {
            throw `attempted to hydrate unknown type ${dateThing}`
        }
    }


    serialize() { return this._value.toISO() }

    get asInterval() { return this._value.until(this._value) }
    get asDate() { return this._value.toJSDate() }
    get asDateTime() { return this._value }

    isBefore(compareTo: ComparableValue) { return this.asInterval.isBefore(toLDT(compareTo)) }
    get isInPast() { return this.isBefore(Time.now) }

    isAfter(compare: ComparableValue) { return this.asInterval.isAfter(toLDT(compare)) }
    get isInFuture() { return this.isAfter(Time.now) }

    isUnknown() { return this._value === DateTime.unknown._value }
}
