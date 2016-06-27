moment = require 'moment-timezone'
require 'moment-timezone/moment-timezone-utils'
_ = require 'underscore'

{TimeStore} = require '../flux/time'
{CourseStore} = require '../flux/course'


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

TimeHelper =
  ISO_DATE_FORMAT: 'YYYY-MM-DD'
  ISO_TIME_FORMAT: 'HH:mm'
  HUMAN_TIME_FORMAT: 'h:mm a'

  toISO: (datething) ->
    moment(datething).format(@ISO_DATE_FORMAT)

  linkZoneNames: ->
    # uses moment-timezone-utils to alias loaded timezone data to timezone names in Rails
    ALIAS_TIMEZONE_DATA = _.map TIME_LINKS, (alternativeZoneName, loadedZoneName) ->
      loadedUnpackedObject = _.pick moment.tz.zone(loadedZoneName), 'abbrs', 'offsets', 'untils'
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

  syncCourseTimezone: (courseId) ->
    return if @isCourseTimezone(courseId)
    courseTimezone = CourseStore.getTimezone(courseId)
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
    _.clone(TIME_LINKS)

  isTimezoneValid: (timezone) ->
    timezone in _.values(TimeHelper.getTimezones())

  isCourseTimezone: (courseId) ->
    courseTimezone = CourseStore.getTimezone(courseId)
    return false unless courseTimezone?

    {offsets} = moment()._z or moment.tz(TimeHelper.getLocalTimezone())._z
    courseTimezoneOffsets = moment.tz(courseTimezone)._z.offsets

    # Use moment offsets to check if set timezone is matching.
    # Zone abbr/zone name are not globally unique
    _.isEqual(offsets, courseTimezoneOffsets)

# link on require.
TimeHelper.linkZoneNames()

module.exports = TimeHelper
