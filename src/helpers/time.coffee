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
    zonedMoment = moment.fn.tz(courseTimezone)
    zonedMoment

  unsyncCourseTimezone: ->
    return unless @_local?
    unzonedMoment = moment.fn.tz(@_local)
    @unsetLocal()
    unzonedMoment

  getLocalTimezone: ->
    moment.tz.guess()

  getMomentPreserveDate: (value, args...) ->
    if @_local
      return moment(value, args...).tz(@_local).hour(12)

    moment(value, args...).hour(12).locale(moment.locale())

  getLocal: ->
    @_local

  unsetLocal: ->
    @_local = null

  isCourseTimezone: (courseId) ->
    courseTimezone = CourseStore.getTimezone(courseId)
    moment.tz(TimeHelper.getLocalTimezone()).zoneName() is moment.tz(courseTimezone).zoneName()

module.exports = TimeHelper
