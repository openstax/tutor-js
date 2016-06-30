_ = require 'underscore'
moment = require 'moment-timezone'

{makeSimpleStore, extendConfig} = require './helpers'
TimeHelper = require '../helpers/time'

TASKING_IDENTIFIERS = ['target_id', 'target_type']

getFromForTasking = (fromCollection, tasking) ->
  _.findWhere(fromCollection, _.pick(tasking, TASKING_IDENTIFIERS))

transformDefaultPeriod = (period) ->
  target_id: period.id
  target_type: 'period'
  open_time: period.default_open_time
  due_time: period.default_due_time

transformCourseToDefaults = (course) ->
  {periods} = course

  courseDefaults =
    open_time: course.default_open_time
    due_time: course.default_due_time

  defaults = _.map periods, transformDefaultPeriod
  defaults.push(courseDefaults)
  
  defaults

transformTasking = (tasking) ->
  transformed = _.pick(tasking, TASKING_IDENTIFIERS)

  transformed.open_time = TimeHelper.getTimeOnly(tasking.opens_at)
  transformed.due_time = TimeHelper.getTimeOnly(tasking.due_at)

  transformed.open_date = TimeHelper.getTimeOnly(tasking.opens_at)
  transformed.due_date = TimeHelper.getTimeOnly(tasking.due_at)

  transformed

transformTaskings = (taskings) ->
  _.map(taskings, transformTasking)


maskToTasking = (tasking) ->
  masked = _.pick(tasking, TASKING_IDENTIFIERS)

  masked.opens_at = "#{tasking.open_date} #{tasking.open_time}"
  masked.due_at = "#{tasking.due_date} #{tasking.due_time}"

  masked

# sample defaults
# "#{courseId}": [{
#   "open_time": "00:01"
#   "due_time": "22:00"
# }, {
#   "target_id": "#{periodId}"
#   "target_type": "period"
#   "open_time": "00:01"
#   "due_time": "11:00"
# }...]

TaskingConfig =
  _defaults: {}
  _taskings: {}

  loadDefaults: (courseId, course) ->
    @_defaults[courseId] = transformCourseToDefaults(course)
    @emit("defaultsLoaded.#{courseId}")

  loadTaskings: (taskId, courseId, taskings) ->
    taskings = transformTaskings(taskings)
    @_taskings[taskId] = {taskings, courseId}
    @emit("taskingsLoaded.#{taskId}")

  updateDateTime: () ->

  updateDate: () ->

  updateTime: () ->

  exports:
    getDefaults: (courseId) ->
      @_defaults[courseId]

    getDefaultsFor: (courseId, tasking) ->
      defaults = @exports.getDefaults.call(@, courseId)
      getFromForTasking(defaults, tasking)

    _getTaskings: (taskId) ->
      @_taskings[taskId].taskings

    getTaskings: (taskId) ->
      storedTaskings = @exports._getTaskings.call(@, taskId)

      taskings = _.map storedTaskings, maskToTasking

    getTaskingFor: (taskId, tasking) ->
      storedTaskings = @exports._getTaskings.call(@, taskId)
      tasking = getFromForTasking(storedTaskings, tasking)

      maskToTasking(tasking)

    areTaskingsValid: (taskId) ->
      storedTaskings = @exports._getTaskings.call(@, taskId)
      _.every storedTaskings, _.partial(@exports.isTaskingValid.bind(@), taskId)

    isTaskingValid: (taskId, tasking) ->
      tasking = @exports.getTaskingFor.call(@, taskId, tasking)
      TimeHelper.isDateTimeString(tasking.opens_at) and TimeHelper.isDateTimeString(tasking.due_at)

    isTaskingDefaultTime: (taskId, tasking, type = 'open') ->
      {courseId, taskings} = @_taskings[taskId]

      tasking = getFromForTasking(taskings, tasking)
      defaults = @exports.getDefaultsFor.call(@, courseId, tasking)

      tasking["#{type}_time"] is defaults["#{type}_time"]



