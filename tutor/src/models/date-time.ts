import { DateTime as LuxonDateTime } from "luxon"
import { isDate, isString } from 'lodash'

export class DateTime {
    value: LuxonDateTime

    hydrate(dateThing: | string | Date | LuxonDateTime) {
        if (isDate(dateThing)) {
            return LuxonDateTime.fromJSDate(dateThing)
        } else if (isString(dateThing)) {
            this.value = LuxonDateTime.fromISO(dateThing)
        } else {
            this.value = dateThing
        }
    }

    hydrate() {
        // const tm = (typeof date == 'string') ? Date.parse(date) : date.getTime()
        // this.setTime(tm)
    }

    serialize() {
        return this.value.toISO()
    }

}
