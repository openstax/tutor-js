moment = require 'moment-timezone'
_ = require 'underscore'

{TimeStore} = require '../flux/time'
{CourseStore} = require '../flux/course'

TimeHelper =

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

  isCourseTimezone: (courseId) ->
    courseTimezone = CourseStore.getTimezone(courseId)
    moment.tz(TimeHelper.getLocalTimezone()).zoneName() is moment.tz(courseTimezone).zoneName()

module.exports = TimeHelper
