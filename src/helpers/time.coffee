moment = require 'moment-timezone'
_ = require 'underscore'

{TimeStore} = require '../flux/time'
{CourseStore} = require '../flux/course'

# Using tzdetect until https://github.com/moment/moment-timezone/issues/138
# gets straightened out.
#
# A small public domain library detecting the user's timezone using moment.js
# Repository : https://github.com/Canop/tzdetect.js
# Usage :
#   tzdetect.matches()     : array of all timezones matching the user's one
#   tzdetect.matches(base) : array of all timezones matching the supplied one
tzdetect =
  names: moment.tz.names()
  matches: (base) ->
    results = []
    now = Date.now()

    makekey = (id) ->
      [0, 4, 8, -5 * 12, 4 - 5 * 12, 8 - 5 * 12, 4 - 2 * 12, 8 - 2 * 12].map((months) ->
        m = moment(now + months * 30 * 24 * 60 * 60 * 1000)
        m.tz(id) if id
        m.format('DDHHmm')
      ).join(' ')

    lockey = makekey(base)

    tzdetect.names.forEach (id) ->
      results.push(id) if makekey(id) is lockey

    return results


TimeHelper =
  getCurrentLocales: ->
    currentLocale = moment.localeData()

    abbr: currentLocale._abbr
    week: currentLocale._week
    weekdaysMin: currentLocale._weekdaysMin

  syncCourseTimezone: (courseId) ->
    return if @isCourseTimezone(courseId)
    courseTimezone = CourseStore.getTimezone(courseId)
    @_local ?= _.first(@getLocalTimezone())
    zonedMoment = moment.fn.tz(courseTimezone)
    zonedMoment

  unsyncCourseTimezone: ->
    return unless @_local?
    unzonedMoment = moment.fn.tz(@_local)
    @unsetLocal()
    unzonedMoment

  getLocalTimezone: ->
    tzdetect.matches()

  getMomentPreserveDate: (value, args...) ->
    if @_local
      return moment(value, args...).tz(@_local).hour(12)

    moment(value, args...).hour(12)

  getLocal: ->
    @_local

  unsetLocal: ->
    @_local = null

  isCourseTimezone: (courseId) ->
    courseTimezone = CourseStore.getTimezone(courseId)
    TimeHelper.getLocalTimezone().indexOf(courseTimezone) > -1

module.exports = TimeHelper
