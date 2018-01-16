moment = require 'moment-timezone'
require 'moment-timezone/moment-timezone-utils'

map = require 'lodash/map'
isEmpty = require 'lodash/isEmpty'
isEqual = require 'lodash/isEqual'
clone = require 'lodash/clone'
values = require 'lodash/values'
pick = require 'lodash/pick'
first = require 'lodash/first'

# Map http://www.iana.org/time-zones names to timezone names in Rails
# https://github.com/openstax/tutor-server/pull/1057#issuecomment-212678167
TIME_LINKS =
  'US/Hawaii': 'Hawaii'
  'US/Alaska': 'Alaska'
  'US/Pacific': 'Pacific Time (US & Canada)'
  'US/Arizona': 'Arizona'
  'US/Mountain': 'Mountain Time (US & Canada)'
  'US/Central': 'Central Time (US & Canada)'
  'US/Eastern': 'Eastern Time (US & Canada)'
  'US/East-Indiana': 'Indiana (East)'
  'Canada/Atlantic': 'Atlantic Time (Canada)'

ISO_DATE_REGEX = /\d{4}[\/\-](0[1-9]|1[012])[\/\-](0[1-9]|[12][0-9]|3[01])/
ISO_TIME_REGEX = /([01][0-9]|2[0-3]):[0-5]\d/

START = '^'
END = '$'
SEPARATOR = ' '

ISO_DATE_ONLY_REGEX = new RegExp(START + ISO_DATE_REGEX.source + END)
ISO_DATETIME_REGEX = new RegExp(START + ISO_DATE_REGEX.source + SEPARATOR + ISO_TIME_REGEX.source + END)
ISO_TIME_ONLY_REGEX = new RegExp(START + ISO_TIME_REGEX.source + END)

TimeHelper =
  ISO_DATE_FORMAT: 'YYYY-MM-DD'
  ISO_TIME_FORMAT: 'HH:mm'
  HUMAN_TIME_FORMAT: 'h:mm a'
  HUMAN_DATE_FORMAT: 'MM/DD/YYYY'

  toHumanDate: (datething) ->
    moment(datething).format(@HUMAN_DATE_FORMAT)

  toISO: (datething) ->
    moment(datething).format(@ISO_DATE_FORMAT)

  ISODateToMoment: (datething) ->
    moment(datething, @ISO_DATE_FORMAT)

  toDateTimeISO: (datething) ->
    moment(datething).format(@ISO_DATE_FORMAT + ' ' + @ISO_TIME_FORMAT)

  isDateStringOnly: (stringToCheck) ->
    ISO_DATE_ONLY_REGEX.test(stringToCheck)

  isDateTimeString: (stringToCheck) ->
    ISO_DATETIME_REGEX.test(stringToCheck)

  isTimeStringOnly: (stringToCheck) ->
    ISO_TIME_ONLY_REGEX.test(stringToCheck)

  hasTimeString: (stringToCheck) ->
    ISO_TIME_REGEX.test(stringToCheck)

  hasDateString: (stringToCheck) ->
    ISO_DATE_REGEX.test(stringToCheck)

  getTimeOnly: (stringToCheck) ->
    first(stringToCheck.match(ISO_TIME_REGEX))

  getDateOnly: (stringToCheck) ->
    first(stringToCheck.match(ISO_DATE_REGEX))

  linkZoneNames: ->
    # uses moment-timezone-utils to alias loaded timezone data to timezone names in Rails
    ALIAS_TIMEZONE_DATA = map TIME_LINKS, (alternativeZoneName, loadedZoneName) ->
      loadedUnpackedObject = pick moment.tz.zone(loadedZoneName), ['abbrs', 'offsets', 'untils']
      loadedUnpackedObject.name = alternativeZoneName

      moment.tz.pack(loadedUnpackedObject)

    moment.tz.add(ALIAS_TIMEZONE_DATA)

  PropTypes:
    moment: (props, propName, componentName) ->
      unless moment.isMoment(props[propName])
        new Error("#{propName} should be a moment for #{componentName}")

  getCurrentLocales: ->
    currentLocale = moment.localeData()

    abbr: currentLocale._abbr
    week: currentLocale._week
    weekdaysMin: currentLocale._weekdaysMin

  syncCourseTimezone: (courseTimezone) ->
    return if @isCourseTimezone(courseTimezone)
    @_local ?= @getLocalTimezone()
    zonedMoment = moment.tz.setDefault(courseTimezone)
    zonedMoment

  unsyncCourseTimezone: ->
    return unless @_local?
    unzonedMoment = moment.tz.setDefault(@_local)
    @unsetLocal()
    unzonedMoment

  makeMoment: (value, args...) ->
    if moment.isMoment(value)
      if value instanceof moment
        value.clone()
      else
        moment(value._d, args...)
    else
      moment(value, args...)

  getLocalTimezone: ->
    moment.tz.guess()

  getMomentPreserveDate: (value, args...) ->
    preserve = TimeHelper.makeMoment(value, args...)
    preserve.hour(12).locale(moment.locale())

  getZonedMoment: (value, args...) ->
    preserve = TimeHelper.makeMoment(value, args...)
    preserve.tz(@_local) if @_local
    preserve.hour(12).locale(moment.locale())

  getLocal: ->
    @_local

  unsetLocal: ->
    @_local = null

  getTimezones: ->
    clone(TIME_LINKS)

  isTimezoneValid: (timezone) ->
    timezone in values(TimeHelper.getTimezones())

  isCourseTimezone: (courseTimezone) ->
    return false if isEmpty(courseTimezone)

    courseMomentZone = moment.tz(courseTimezone)

    return false if isEmpty(courseMomentZone._z)

    {offsets} = moment()._z or moment.tz(TimeHelper.getLocalTimezone())._z
    courseTimezoneOffsets = courseMomentZone._z.offsets

    # Use moment offsets to check if set timezone is matching.
    # Zone abbr/zone name are not globally unique
    isEqual(offsets, courseTimezoneOffsets)

# link on require.
TimeHelper.linkZoneNames()

module.exports = TimeHelper
