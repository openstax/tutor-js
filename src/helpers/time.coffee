moment = require 'moment-timezone'

TimeHelper =
  getCurrentLocales: ->
    currentLocale = moment.localeData()

    abbr: currentLocale._abbr
    week: currentLocale._week
    weekdaysMin: currentLocale._weekdaysMin

  syncCourseTimezone: (courseTimezone = 'US/Central') ->
    moment.tz.setDefault(courseTimezone)

  unsyncCourseTimezone: ->
    moment.defaultZone = null

module.exports = TimeHelper
