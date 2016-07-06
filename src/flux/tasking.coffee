_ = require 'underscore'
moment = require 'moment-timezone'

{makeSimpleStore, extendConfig} = require './helpers'
TimeHelper = require '../helpers/time'
{TimeStore} = require './time'

TASKING_IDENTIFIERS = ['target_type', 'target_id']

TASKING_TIMES = ['open_time', 'due_time']

TASKING_DATES = ['open_date', 'due_date']

TASKING_DATETIMES = TASKING_TIMES.concat(TASKING_DATES)

TASKING_WORKING_PROPERTIES = TASKING_IDENTIFIERS.concat(TASKING_DATETIMES).concat(['disabled'])

TASKING_MASKED = ['opens_at', 'due_at']

getFromForTasking = (fromCollection, tasking) ->
  fromCollection[toTaskingIndex(tasking)]

transformDefaultPeriod = (period) ->
  target_id: period.id
  target_type: 'period'
  open_time: period.default_open_time
  due_time: period.default_due_time

transformCourseToDefaults = (course) ->
  {periods, id} = course

  courseDefaults = _.chain(periods)
    .indexBy((period) ->
      "period#{period.id}"
    )
    .mapObject(transformDefaultPeriod)
    .value()

  courseDefaults.all =
    open_time: course.default_open_time
    due_time: course.default_due_time

  courseDefaults

transformTasking = (tasking) ->
  transformed = _.pick(tasking, TASKING_IDENTIFIERS)

  due_at = TimeHelper.makeMoment(tasking.due_at).format("#{TimeHelper.ISO_DATE_FORMAT} #{TimeHelper.ISO_TIME_FORMAT}")
  opens_at = TimeHelper.makeMoment(tasking.opens_at).format("#{TimeHelper.ISO_DATE_FORMAT} #{TimeHelper.ISO_TIME_FORMAT}")

  transformed.open_time = TimeHelper.getTimeOnly(opens_at)
  transformed.due_time = TimeHelper.getTimeOnly(due_at)

  transformed.open_date = TimeHelper.getDateOnly(opens_at)
  transformed.due_date = TimeHelper.getDateOnly(due_at)

  transformed

transformTaskings = (taskings) ->
  _.chain(taskings)
    .indexBy(toTaskingIndex)
    .mapObject(transformTasking)
    .value()

maskToTasking = (tasking) ->
  masked = _.pick(tasking, TASKING_IDENTIFIERS)

  if TimeHelper.isDateTimeString("#{tasking.open_date} #{tasking.open_time}")
    masked.opens_at = "#{tasking.open_date} #{tasking.open_time}"

  if TimeHelper.isDateTimeString("#{tasking.due_date} #{tasking.due_time}")
    masked.due_at = "#{tasking.due_date} #{tasking.due_time}"

  masked

toTaskingIndex = (tasking) ->
  if tasking? and not _.isEmpty(tasking)
    if tasking.id? and tasking.name?
      "period#{tasking.id}"
    else
      "#{tasking.target_type}#{tasking.target_id}"
  else
    'all'

isTaskingValidTime = (tasking) ->
  TimeHelper.hasTimeString(tasking.opens_at) and TimeHelper.hasTimeString(tasking.due_at)

isTaskingValidDate = (tasking) ->
  TimeHelper.hasDateString(tasking.opens_at) and TimeHelper.hasDateString(tasking.due_at)

isProperRange = (tasking) ->
  moment(tasking.due_at).isAfter(tasking.opens_at)

ERRORS =
  'INVALID_DATE': 'Please pick a date.'
  'INVALID_TIME': 'Please type a time.'
  'DUE_BEFORE_OPEN': 'Due time cannot be before open time.'

VALIDITY_CHECKS = [{
  check: isTaskingValidTime,
  errorType: 'INVALID_TIME'
}, {
  check: isTaskingValidDate,
  errorType: 'INVALID_DATE'
}, {
  check: isProperRange,
  errorType: 'DUE_BEFORE_OPEN'
}]

getErrorsForTasking = (tasking, {check, errorType}) ->
  ERRORS[errorType] unless check(tasking)

getTaskingErrors = (tasking) ->
  errors = _.chain(VALIDITY_CHECKS)
    .map _.partial(getErrorsForTasking, tasking)
    .compact()
    .value()

isTaskingValid = (tasking) ->
  _.isEmpty(getTaskingErrors(tasking))

isTaskingOpened = (tasking) ->
  moment(tasking.opens_at).isBefore(TimeStore.getNow())

getCommonTasking = (taskings) ->
  firstTasking = _.chain(taskings)
    .values()
    .first()
    .pick(TASKING_MASKED)
    .value()

  hasCommon = _.every taskings, (tasking) ->
    _.isEqual(firstTasking, _.pick(tasking, TASKING_MASKED))

  return firstTasking if hasCommon

# sample defaults
# "#{courseId}": {
#   "all": {
#     "open_time": "00:01"
#     "due_time": "22:00"
#   },
#   "#{target_type}#{target_id}": {
#     "open_time": "00:01"
#     "due_time": "11:00"
#   },
#   "#{target_type}#{target_id}": {
#     "open_time": "00:01"
#     "due_time": "11:00"
#   }
# }

TaskingConfig =
  _defaults: {}
  _taskings: {}
  _tasksToCourse: {}
  _taskingsIsAll: {}

  loadDefaults: (courseId, course) ->
    @_defaults[courseId] = transformCourseToDefaults(course)
    @emit("defaults.#{courseId}.loaded")
    true

  loadTaskToCourse: (taskId, courseId) ->
    @_tasksToCourse[taskId] = courseId

  loadTaskings: (taskId, taskings) ->
    commonTasking = getCommonTasking(taskings)
    isAll = commonTasking?

    @updateTaskingsIsAll(taskId, isAll)

    @_taskings[taskId] = transformTaskings(taskings)

    if isAll
      @_taskings[taskId][toTaskingIndex()] = transformTasking(commonTasking)
    else
      @resetTasking(taskId)

    @emit("taskings.#{taskId}.all.loaded")
    true

  updateTime: (taskId, tasking, type, timeString) ->
    taskingIndex = toTaskingIndex(tasking)
    timeString = TimeHelper.getTimeOnly(timeString)
    return false unless timeString?

    @_taskings[taskId][taskingIndex] ?= {}
    @_taskings[taskId][taskingIndex]["#{type}_time"] = timeString
    @emit("taskings.#{taskId}.#{taskingIndex}.changed")
    true

  updateDate: (taskId, tasking, type, dateString) ->
    taskingIndex = toTaskingIndex(tasking)
    dateString = TimeHelper.getDateOnly(dateString)
    return false unless dateString?

    @_taskings[taskId][taskingIndex] ?= {}
    @_taskings[taskId][taskingIndex]["#{type}_date"] = dateString
    @emit("taskings.#{taskId}.#{taskingIndex}.changed")
    true

  resetTasking: (taskId, tasking, dates = {}) ->
    courseId = @exports.getCourseIdForTask.call(@, taskId)
    defaults = @exports.getDefaultsFor.call(@, courseId, tasking)
    taskingIndex = toTaskingIndex(tasking)
    currentTasking = @_taskings[taskId][taskingIndex] or _.pick(tasking, TASKING_IDENTIFIERS)
    updatedTasking = _.extend({disabled: false}, currentTasking, dates, defaults)

    @_taskings[taskId][taskingIndex] = _.pick(updatedTasking, TASKING_WORKING_PROPERTIES)
    @emit("taskings.#{taskId}.#{taskingIndex}.changed")
    true

  updateTaskingsIsAll: (taskId, isAll) ->
    @_taskingsIsAll[taskId] = isAll
    @emit("taskings.#{taskId}.isAll.changed")
    true

  create: (taskId, dates = {open_date: '', due_date: ''}) ->
    courseId = @exports.getCourseIdForTask.call(@, taskId)
    taskings = @exports._getBlankTaskings.call(@, taskId)

    isAll = @exports.areDefaultTaskingTimesSame.call(@, courseId)
    @updateTaskingsIsAll(taskId, isAll)

    @_taskings[taskId] ?= {}

    @resetTasking(taskId, {}, dates)

    _.each taskings, (tasking) =>
      @resetTasking(taskId, tasking, dates)

    @emit("taskings.#{taskId}.all.changed")
    true

  enableTasking: (taskId, tasking) ->
    taskingIndex = toTaskingIndex(tasking)
    @_taskings[taskId][taskingIndex].disabled = false
    @emit("taskings.#{taskId}.#{taskingIndex}.changed")
    true

  disableTasking: (taskId, tasking) ->
    taskingIndex = toTaskingIndex(tasking)
    @_taskings[taskId][taskingIndex].disabled = true
    @emit("taskings.#{taskId}.#{taskingIndex}.changed")
    true

  exports:
    getTaskingIndex: (tasking) ->
      toTaskingIndex(tasking)

    getDefaults: (courseId) ->
      @_defaults[courseId]

    _getTaskings: (taskId) ->
      @_taskings[taskId]

    _getBlankTaskings: (taskId) ->
      courseId = @exports.getCourseIdForTask.call(@, taskId)
      defaults = @exports.getDefaults.call(@, courseId)
      blankTaskings = _.chain(defaults)
        .omit(toTaskingIndex())
        .map (tasking) ->
          _.pick(tasking, TASKING_IDENTIFIERS)
        .value()

    getCourseIdForTask: (taskId) ->
      @_tasksToCourse[taskId]

    getTaskingsIsAll: (taskId) ->
      @_taskingsIsAll[taskId]

    getTaskingDefaults: (courseId) ->
      defaults = @exports.getDefaults.call(@, courseId)
      _.omit(defaults, toTaskingIndex())

    getDefaultsFor: (courseId, tasking) ->
      defaults = @exports.getDefaults.call(@, courseId)
      taskingDefault = getFromForTasking(defaults, tasking)
      _.pick(taskingDefault, TASKING_TIMES)

    getDefaultsForTasking: (taskId, tasking) ->
      courseId = @exports.getCourseIdForTask.call(@, taskId)
      defaults = @exports.getDefaultsFor.call(@, courseId, tasking)

    areDefaultTaskingTimesSame: (courseId) ->
      defaults = @exports.getTaskingDefaults.call(@, courseId)
      firstDefault = _.chain(defaults)
        .omit(toTaskingIndex())
        .values()
        .first()
        .pick(TASKING_TIMES)
        .value()

      _.every defaults, (taskingDefault) ->
        _.isEqual(firstDefault, _.pick(taskingDefault, TASKING_TIMES))

    getTaskings: (taskId) ->
      storedTaskings = @exports._getTaskings.call(@, taskId)

      taskings = _.map storedTaskings, maskToTasking

    _getTaskingFor: (taskId, tasking) ->
      storedTaskings = @exports._getTaskings.call(@, taskId)
      tasking = getFromForTasking(storedTaskings, tasking)

    isTaskingEnabled: (taskId, tasking) ->
      tasking = @exports._getTaskingFor.call(@, taskId, tasking)
      not tasking.disabled is true

    getTaskingFor: (taskId, tasking) ->
      tasking = @exports._getTaskingFor.call(@, taskId, tasking)
      maskToTasking(tasking)

    areTaskingsValid: (taskId) ->
      taskings = @exports.get.call(@, taskId)
      _.every taskings, isTaskingValid

    isTaskingValid: (taskId, tasking) ->
      tasking = @exports.getTaskingFor.call(@, taskId, tasking)
      isTaskingValid(tasking)

    getTaskingErrors: (taskId, tasking) ->
      tasking = @exports.getTaskingFor.call(@, taskId, tasking)
      getTaskingErrors(tasking)

    isTaskingDefaultTime: (taskId, tasking, type = 'open') ->
      courseId = @exports.getCourseIdForTask.call(@, taskId)

      tasking = @exports.getTaskingFor.call(@, taskId, tasking)
      defaults = @exports.getDefaultsFor.call(@, courseId, tasking)

      tasking["#{type}_time"] is defaults["#{type}_time"]

    hasTasking: (taskId, tasking) ->
      tasking = @exports._getTaskingFor.call(@, taskId, tasking)
      tasking?

    get: (taskId) ->
      isTaskingsAll = @exports.getTaskingsIsAll.call(@, taskId)

      if isTaskingsAll
        courseTasking = @exports.getTaskingFor.call(@, taskId)
        taskings = @exports._getBlankTaskings.call(@, taskId)
        _.each taskings, (tasking) ->
          _.extend(tasking, courseTasking)
      else
        storedTaskings = @exports._getTaskings.call(@, taskId)
        taskings = _.chain(storedTaskings)
          .omit(toTaskingIndex())
          .values()
          .reject (tasking) ->
            tasking.disabled
          .map maskToTasking
          .value()

      taskings

    isTaskingOpened: (taskId, tasking) ->
      tasking = @exports.getTaskingFor.call(@, taskId, tasking)
      isTaskingOpened(tasking)

    _getTaskingsSortedByOpenDate: (taskId) ->
      taskings = @exports.get.call(@, taskId)
      sortedTaskings = _.sortBy taskings, (tasking) ->
        moment(tasking.opens_at).valueOf()

    isTaskOpened: (taskId) ->
      firstTasking = _.first(@exports._getTaskingsSortedByOpenDate.call(@, taskId))
      isTaskingOpened(firstTasking)

    getTaskingDate: (taskId, tasking, type = 'open') ->
      tasking = @exports._getTaskingFor.call(@, taskId, tasking)
      tasking["#{type}_date"]

    getTaskingTime: (taskId, tasking, type = 'open') ->
      tasking = @exports._getTaskingFor.call(@, taskId, tasking)
      tasking["#{type}_time"]

{actions, store} = makeSimpleStore(TaskingConfig)

window.TaskingActions = actions
window.TaskingStore = store

module.exports = {TaskingActions:actions, TaskingStore:store}
