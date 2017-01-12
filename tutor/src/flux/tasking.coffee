_ = require 'underscore'
moment = require 'moment-timezone'

{makeSimpleStore, extendConfig} = require './helpers'
TimeHelper = require '../helpers/time'
{TimeStore} = require './time'

TASKING_IDENTIFIERS = ['target_type', 'target_id']
TASKING_TIMES = ['open_time', 'due_time']
TASKING_DATES = ['open_date', 'due_date']
TASKING_DATETIMES = TASKING_TIMES.concat(TASKING_DATES)
TASKING_UPDATABLES = TASKING_DATETIMES.concat(['disabled'])
TASKING_WORKING_PROPERTIES = TASKING_IDENTIFIERS.concat(TASKING_DATETIMES).concat(['disabled'])

TASKING_MASKS =
  open: 'opens_at'
  due: 'due_at'

TASKING_MASKED = _.values(TASKING_MASKS)

getFromForTasking = (fromCollection, tasking) ->
  fromCollection[toTaskingIndex(tasking)]

transformDefaultPeriod = (period) ->
  target_id: period.id
  target_type: 'period'
  open_time: period.default_open_time
  due_time: period.default_due_time

transformCourseToDefaults = (course, periods) ->
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

isDueAfterNow = (tasking) ->
  moment(tasking.due_at).isAfter(TimeStore.getNow())

hasAtLeastOneTasking = (taskings) ->
  not _.chain(taskings)
    .compact()
    .isEmpty()
    .value()

ERRORS =
  'INVALID_DATE': 'Please pick a date.'
  'INVALID_TIME': 'Please type a time.'
  'DUE_BEFORE_OPEN': 'Due time cannot be before open time.'
  'MISSING_TASKING': 'Please select at least one period'
  'DUE_AFTER_NOW': 'Due time has already passed'

TASKING_VALIDITY_CHECKS = [{
  check: isTaskingValidTime,
  errorType: 'INVALID_TIME'
}, {
  check: isTaskingValidDate,
  errorType: 'INVALID_DATE'
}, {
  check: isProperRange,
  errorType: 'DUE_BEFORE_OPEN'
}, {
  check: isDueAfterNow,
  errorType: 'DUE_AFTER_NOW'
}]

TASK_VALIDITY_CHECKS = [{
  check: hasAtLeastOneTasking
  errorType: 'MISSING_TASKING'
}]

getErrorsFor = (thingToCheck, {check, errorType}) ->
  ERRORS[errorType] unless check(thingToCheck)

getTaskingErrors = (tasking) ->
  errors = _.chain(TASKING_VALIDITY_CHECKS)
    .map _.partial(getErrorsFor, tasking)
    .compact()
    .value()

getTaskErrors = (taskings) ->
  errors = _.chain(TASK_VALIDITY_CHECKS)
    .map _.partial(getErrorsFor, taskings)
    .compact()
    .value()

isTaskingValid = (tasking) ->
  _.isEmpty(getTaskingErrors(tasking))

isTaskValid = (taskings) ->
  _.isEmpty(getTaskErrors(taskings))

isTaskingOpened = (tasking) ->
  moment(tasking.opens_at).isBefore(TimeStore.getNow())

getCommonTasking = (taskings, commonBy = TASKING_MASKED) ->
  firstTasking = _.chain(taskings)
    .values()
    .first()
    .pick(commonBy)
    .value()

  hasCommon = _.every taskings, (tasking) ->
    _.isEqual(firstTasking, _.pick(tasking, commonBy))

  return firstTasking if hasCommon

getCommonDates = (taskings) ->
  commonOpenDate = getCommonTasking(taskings, 'open_date')
  commonDueDate = getCommonTasking(taskings, 'due_date')

  _.extend(commonOpenDate, commonDueDate)

hasTaskings = (taskings, compareTaskings) ->
  _.every taskings, (tasking) ->
    taskingIndex = toTaskingIndex(tasking)
    compareTaskings[taskingIndex]?

# sample _defaults
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

# sample _taskings
# "#{courseId}": {
#   "all": {
#     "open_time": "00:01"
#     "due_time": "22:00"
#     "open_date": "2016-06-25"
#     "due_date": "2016-08-25"
#   },
#   "#{target_type}#{target_id}": {
#     "open_time": "00:01"
#     "due_time": "11:00"
#     "open_date": "2016-06-25"
#     "due_date": "2016-08-25"
#     "target_type": "#{target_type}"
#     "target_id": "#{target_id}"
#     disabled: true
#   },
#   "#{target_type}#{target_id}": {
#     "open_time": "00:01"
#     "due_time": "11:00"
#     "open_date": "2016-06-25"
#     "due_date": "2016-08-25"
#     "target_type": "#{target_type}"
#     "target_id": "#{target_id}"
#     "disabled": false
#   }
# }

TaskingConfig =
  _defaults: {}
  _taskings: {}
  _tasksToCourse: {}
  _taskingsIsAll: {}
  _originalTaskings: {}

  reset: ->
    @_defaults = {}
    @_taskings = {}
    @_tasksToCourse = {}
    @_taskingsIsAll = {}
    @_originalTaskings = {}

  resetFor: (taskId) ->
    @loadTaskings(taskId, @_originalTaskings[taskId]) unless _.isEmpty(@_originalTaskings[taskId])

  loadDefaults: (courseId, course, periods) ->
    @_defaults[courseId] = transformCourseToDefaults(course, periods)
    @emit("defaults.#{courseId}.loaded")
    true

  loadTaskToCourse: (taskId, courseId) ->
    @_tasksToCourse[taskId] = courseId

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

  updateAllTaskings: (taskId, taskingUpdate) ->
    taskingUpdate = _.pick(taskingUpdate, TASKING_UPDATABLES)
    _.each(@_taskings[taskId], _.partial(_.extend(_, taskingUpdate)))

  resetTasking: (taskId, tasking, setTasking) ->
    courseId = @exports.getCourseIdForTask.call(@, taskId)
    defaults = @exports.getDefaultsFor.call(@, courseId, tasking)
    taskingIndex = toTaskingIndex(tasking)

    currentTasking = _.pick(tasking, TASKING_IDENTIFIERS)
    updatedTasking = _.extend({disabled: false}, currentTasking, defaults, setTasking)

    @_taskings[taskId][taskingIndex] = _.pick(updatedTasking, TASKING_WORKING_PROPERTIES)
    @emit("taskings.#{taskId}.#{taskingIndex}.reset")
    true

  updateTaskingsIsAll: (taskId, isAll) ->
    @_taskingsIsAll[taskId] = isAll
    @emit("taskings.#{taskId}.isAll.changed")
    true

  setOriginalTaskings: (taskId, taskings) ->
    @_originalTaskings[taskId] = taskings

  loadTaskings: (taskId, taskings) ->

    blankTaskings = @exports._getBlankTaskings.call(@, taskId)
    isAll = false

    taskingsToLoad = transformTaskings(taskings)
    hasAllTaskings = hasTaskings(blankTaskings, taskingsToLoad)

    if hasAllTaskings
      commonTasking = getCommonTasking(taskings)
      isAll = commonTasking?

    @updateTaskingsIsAll(taskId, isAll)

    baseTaskingToLoad = getCommonDates(taskingsToLoad)
    disabledBaseTasking = _.extend({disabled: true}, baseTaskingToLoad)

    @_taskings[taskId] = {}
    taskingToLoad = if isAll then transformTasking(commonTasking) else baseTaskingToLoad
    @resetTasking(taskId, {}, taskingToLoad)

    _.each blankTaskings, (tasking) =>
      taskingToLoad = getFromForTasking(taskingsToLoad, tasking)

      if taskingToLoad and isAll
        # explicitly default to period times
        taskingToLoad = _.omit(taskingToLoad, TASKING_TIMES)

      @resetTasking(taskId, tasking, taskingToLoad or disabledBaseTasking)

    @setOriginalTaskings(taskId, @exports.get.call(@, taskId))
    @emit("taskings.#{taskId}.all.loaded")
    true

  create: (taskId, dates = {open_date: '', due_date: ''}) ->

    courseId = @exports.getCourseIdForTask.call(@, taskId)
    blankTaskings = @exports._getBlankTaskings.call(@, taskId)

    isAll = @exports.areDefaultTaskingTimesSame.call(@, courseId)
    @updateTaskingsIsAll(taskId, isAll)

    @_taskings[taskId] = {}
    @resetTasking(taskId, {}, dates)

    _.each blankTaskings, (tasking) =>
      @resetTasking(taskId, tasking, dates)

    @setOriginalTaskings(taskId, [])
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
      taskingDefaults = _.omit(defaults, toTaskingIndex())

      getCommonTasking(taskingDefaults, TASKING_TIMES)?

    getTaskings: (taskId) ->
      storedTaskings = @exports._getTaskings.call(@, taskId)

      taskings = _.map storedTaskings, maskToTasking

    getOriginalTaskings: (taskId) ->
      @_originalTaskings[taskId]

    _getTaskingFor: (taskId, tasking) ->
      storedTaskings = @exports._getTaskings.call(@, taskId)
      tasking = getFromForTasking(storedTaskings, tasking)

    isTaskingEnabled: (taskId, tasking) ->
      tasking = @exports._getTaskingFor.call(@, taskId, tasking)
      not tasking.disabled is true

    getTaskingFor: (taskId, tasking) ->
      tasking = @exports._getTaskingFor.call(@, taskId, tasking)
      maskToTasking(tasking)

    isTaskValid: (taskId) ->
      taskings = @exports.get.call(@, taskId)
      isThisTaskValid = isTaskValid(taskings)
      return false unless isThisTaskValid

      # dont check tasking validity if taskings are same as default/loaded
      return true if @exports.isTaskSame.call(@, taskId)

      _.every(taskings, isTaskingValid)

    isTaskingValid: (taskId, tasking) ->

      # dont check tasking validity if taskings are same as default/loaded
      return true if @exports.isTaskSame.call(@, taskId)

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
      storedTaskings = @exports._getTaskings.call(@, taskId)
      return false unless storedTaskings?

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
          .reject (tasking) ->
            tasking.disabled
          .map(maskToTasking)
          .value()

      taskings

    hasAllTaskings: (taskId) ->
      isTaskingsAll = @exports.getTaskingsIsAll.call(@, taskId)
      return true if isTaskingsAll

      storedTaskings = @exports._getTaskings.call(@, taskId)
      hasAllTaskings = _.chain(storedTaskings)
        .omit(toTaskingIndex())
        .every (tasking) ->
          not tasking.disabled
        .value()

    isTaskingOpened: (taskId, tasking) ->
      tasking = @exports.getTaskingFor.call(@, taskId, tasking)
      isTaskingOpened(tasking)

    _getTaskingsSortedByDate: (taskId, type) ->
      taskings = @exports.get.call(@, taskId)
      attribute = TASKING_MASKS[type]

      sortedTaskings = _.sortBy taskings, (tasking) ->
        moment(tasking[attribute]).valueOf()

    _getTaskingsSortedByOpenDate: (taskId) ->
      @exports._getTaskingsSortedByDate.call(@, taskId, 'open')

    _getTaskingsSortedByDueDate: (taskId) ->
      @exports._getTaskingsSortedByDate.call(@, taskId, 'due')

    isTaskOpened: (taskId) ->
      firstTasking = _.first(@exports._getTaskingsSortedByOpenDate.call(@, taskId))
      (firstTasking and isTaskingOpened(firstTasking)) or false

    getFirstDueDate: (taskId) ->
      firstTasking = _.first(@exports._getTaskingsSortedByDueDate.call(@, taskId))
      transformTasking(firstTasking).due_date

    getTaskingDate: (taskId, tasking, type = 'open') ->
      tasking = @exports._getTaskingFor.call(@, taskId, tasking)
      tasking["#{type}_date"]

    getTaskingTime: (taskId, tasking, type = 'open') ->
      tasking = @exports._getTaskingFor.call(@, taskId, tasking)
      tasking["#{type}_time"]

    isTaskSame: (taskId) ->
      original = @exports.getOriginalTaskings.call(@, taskId)
      currentTaskings = @exports.get.call(@, taskId)

      _.isEqual(
        _.sortBy(original, toTaskingIndex),
        _.sortBy(currentTaskings, toTaskingIndex)
      )

    getChanged: (taskId) ->
      @exports.get.call(@, taskId) unless @exports.isTaskSame.call(@, taskId)


{actions, store} = makeSimpleStore(TaskingConfig)

module.exports = {TaskingActions:actions, TaskingStore:store}
