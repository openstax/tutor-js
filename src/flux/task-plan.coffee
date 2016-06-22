# coffeelint: disable=no_empty_functions
_ = require 'underscore'
moment = require 'moment-timezone'
validator = require 'validator'

{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{TocStore} = require './toc'
{TimeStore} = require './time'
{ExerciseStore} = require './exercise'
{PlanPublishActions, PlanPublishStore} = require './plan-publish'
{CourseActions, CourseStore} = require './course'
ContentHelpers = require '../helpers/content'
TimeHelper = require '../helpers/time'

ISO_DATE_ONLY_REGEX = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/


TUTOR_SELECTIONS =
  default: 3
  max: 4
  min: 2

PLAN_TYPES =
  HOMEWORK: 'homework'
  READING: 'reading'
  EXTERNAL: 'external'
  EVENT: 'event'

sortTopics = (topics) ->
  _.sortBy(topics, (topicId) ->
    topic = TocStore.getSectionInfo(topicId)
    ContentHelpers.chapterSectionToNumber(topic.chapter_section)
  )



isSameOrBeforeNow = (time) ->
  moment(time).isSame(TimeStore.getNow()) or moment(time).isBefore(TimeStore.getNow())

isDateStringOnly = (timeString) ->
  ISO_DATE_ONLY_REGEX.test(timeString)


TaskPlanConfig =

  _stats: {}
  _asyncStatusStats: {}
  _server_copy: {}

  _loaded: (obj, planId) ->
    @_server_copy[planId] = obj
    obj

  # Somewhere, the local copy gets taken apart and rebuilt.
  # Keep a copy of what was served.
  _getOriginal: (planId) ->
    @_server_copy[planId]

  _getPlan: (planId) ->
    @_local[planId] ?= {}
    @_local[planId].settings ?= {}
    @_local[planId].settings.page_ids ?= []

    if @_local[planId]?.type is PLAN_TYPES.HOMEWORK or @_changed[planId]?.type is PLAN_TYPES.HOMEWORK
      @_changed[planId] ?= {}
      # need to default final posting json's is feedback immediate to false
      @_changed[planId].is_feedback_immediate ?= false unless @_local[planId].is_feedback_immediate?
      @_local[planId].settings.exercise_ids ?= []
      @_local[planId].settings.exercises_count_dynamic ?= TUTOR_SELECTIONS.default

    if @_local[planId]?.tasking_plans?
      _.each @_local[planId]?.tasking_plans, (tasking) ->
        tasking.due_at = TimeHelper.makeMoment(tasking.due_at)
          .format("#{TimeHelper.ISO_DATE_FORMAT} #{TimeHelper.ISO_TIME_FORMAT}")
        tasking.opens_at = TimeHelper.makeMoment(tasking.opens_at)
          .format("#{TimeHelper.ISO_DATE_FORMAT} #{TimeHelper.ISO_TIME_FORMAT}")

    #TODO take out once TaskPlan api is in place
    obj = _.extend({}, @_local[planId], @_changed[planId])

    # iReadings should not contain exercise_ids and will cause a silent 422 on publish
    if obj.type is PLAN_TYPES.READING
      delete obj.settings.exercise_ids
      delete obj.settings.exercises_count_dynamic

    obj

  FAILED: -> # used by API


  enableTasking: (id, target_id, opens_at, due_at) ->
    plan = @_getPlan(id)
    {tasking_plans} = plan
    unless @_findTasking(tasking_plans, target_id)
      tasking_plans = _.clone(tasking_plans)
      tasking_plans.push(
        {target_type: 'period', target_id, opens_at, due_at}
      )
      @_change(id, {tasking_plans})

  disableTasking: (id, target_id) ->
    plan = @_getPlan(id)
    {tasking_plans} = plan
    tasking_plans = _.reject tasking_plans, (plan) ->
      plan.target_id is target_id
    @_change(id, {tasking_plans})

  _removeEmptyTaskings: (tasking_plans) ->
    _.reject tasking_plans, (tasking) ->
      not (tasking.due_at and tasking.opens_at)

  # Returns copies of the given property names from settings
  # Copies are returned so that the store can be reset
  _getClonedSettings: (id, names...) ->
    plan = @_getPlan(id)
    settings = {}
    for name in names
      settings[name] = _.clone(plan.settings[name])
    return settings

  _changeSettings: (id, attributes) ->
    plan = @_getPlan(id)
    @_change(id, settings: _.extend({}, plan.settings, attributes))

  setDefaultTimes: (course, period) ->
    periodTimes = _.pick(period, 'opens_at', 'due_at')
    {default_open_time, default_due_time} = course

    periodSettings = _.findWhere course.periods, id: period.id
    {default_open_time, default_due_time} = periodSettings

    periodTimes.opens_at += " #{default_open_time}" if isDateStringOnly(periodTimes.opens_at)
    periodTimes.due_at += " #{default_due_time}" if isDateStringOnly(periodTimes.due_at)

    periodTimes

  setPeriods: (id, courseId, periods, isDefault = false) ->
    plan = @_getPlan(id)
    course = CourseStore.get(courseId)

    curTaskings = plan?.tasking_plans
    findTasking = @_findTasking

    tasking_plans = _.map periods, (period) =>
      tasking = findTasking(curTaskings, period.id)
      if not tasking
        tasking = target_id: period.id, target_type:'period'

      periodTimes = @setDefaultTimes(course, period)

      _.extend(periodTimes, tasking)

    if not @exports.isNew(id)
      tasking_plans = @_removeEmptyTaskings(tasking_plans)

    @_change(id, {tasking_plans})

    @_setInitialPlan(id) if isDefault

  replaceTaskings: (id, taskings) ->
    @_change(id, {tasking_plans: taskings})

  _findTasking: (tasking_plans, periodId) ->
    _.findWhere(tasking_plans, {target_id:periodId, target_type:'period'})

  _getPeriodDates: (id, periodId) ->
    throw new Error('BUG: Period is required arg') unless periodId
    plan = @_getPlan(id)
    {tasking_plans} = plan
    if tasking_plans
      @_findTasking(tasking_plans, periodId)
    else
      undefined

  # detects if all taskings are set to the same due_at/opens_at date
  # if so the date is returned, else undefined
  _getTaskingsCommonDate: (id, attr) ->
    {tasking_plans} = @_getPlan(id)
    # do all the tasking_plans have the same date?
    taskingDates = _.map(tasking_plans, (plan) ->
      date = TimeHelper.makeMoment(plan[attr]) if plan[attr]?
    )

    commonDate = _.reduce taskingDates, (previous, current) ->
      if not _.isUndefined(previous) and current?.isSame?(previous)
        current
      else
        undefined

  _getFirstTaskingByOpenDate: (id) ->
    {tasking_plans} = @_getPlan(id)
    sortedTaskings = _.sortBy(tasking_plans, 'opens_at')
    if sortedTaskings?.length
      sortedTaskings[0]

  _getFirstTaskingByDueDate: (id) ->
    tasking_plans = @_getPlan(id)?.tasking_plans or @_changed[id]?.tasking_plans or @_getOriginal(id)?.tasking_plans
    sortedTaskings = _.sortBy(tasking_plans, 'due_at')
    sortedTaskings[0] if sortedTaskings?.length

  updateTutorSelection: (id, direction) ->
    {exercises_count_dynamic} = @_getClonedSettings(id, 'exercises_count_dynamic')

    exercises_count_dynamic += direction

    exercises_count_dynamic = Math.min(TUTOR_SELECTIONS.max, exercises_count_dynamic)
    exercises_count_dynamic = Math.max(TUTOR_SELECTIONS.min, exercises_count_dynamic)
    @_changeSettings(id, {exercises_count_dynamic})

  updateTitle: (id, title) ->
    @_change(id, {title})

  updateDescription:(id, description) ->
    plan = @_getPlan(id)
    @_change(id, {description: description})

  # updates due_at/opens_at dates for taskings
  # If a periodId is given, only that tasking is updated.
  # If not, all taskings are set to that date
  updateDateAttribute: (id, attr, date, periodId) ->
    plan = @_getPlan(id)
    {tasking_plans} = plan
    tasking_plans ?= []
    tasking_plans = tasking_plans[..] # Clone it
    throw new Error('id is required') unless id
    throw new Error("#{attr} is required") unless date

    # assumes that date is an ISO format date string.
    if periodId
      tasking = @_findTasking(tasking_plans, periodId)
      tasking[attr] = date
    else
      for tasking in tasking_plans
        tasking[attr] = date

    @_change(id, {tasking_plans})

  clearDueAt: (id) ->
    plan = @_getPlan(id)
    {tasking_plans} = plan
    tasking_plans ?= []
    tasking_plans = tasking_plans[..] # Clone it

    for tasking in tasking_plans
      tasking['due_at'] = undefined

    @_change(id, {tasking_plans})

  updateOpensAt: (id, opens_at, periodId) ->
    @updateDateAttribute(id, 'opens_at', opens_at, periodId)

  updateDueAt: (id, due_at, periodId) ->
    @updateDateAttribute(id, 'due_at', due_at, periodId)

  updateUrl: (id, external_url) ->
    @_change(id, {settings: {external_url}})

  setEvent: (id) ->
    @_change(id, {settings: {}})

  sortTopics: (id) ->
    {page_ids} = @_getClonedSettings(id, 'page_ids')
    @_changeSettings(id, page_ids: sortTopics(page_ids))

  addTopic: (id, topicId) ->
    {page_ids} = @_getClonedSettings(id, 'page_ids')
    page_ids.push(topicId) unless page_ids.indexOf(topicId) >= 0
    @_changeSettings(id, {page_ids})

  setImmediateFeedback: (id, is_feedback_immediate) ->
    @_change(id, {is_feedback_immediate})

  removeTopic: (id, topicId) ->
    {page_ids, exercise_ids} = @_getClonedSettings(id, 'page_ids', 'exercise_ids')
    index = page_ids?.indexOf(topicId)
    page_ids?.splice(index, 1)
    exercise_ids = ExerciseStore.removeTopicExercises(exercise_ids, topicId)
    @_changeSettings(id, {page_ids, exercise_ids })

  updateTopics: (id, page_ids) ->
    @_changeSettings(id, {page_ids})

  addExercise: (id, exercise) ->
    {exercise_ids} = @_getClonedSettings(id, 'exercise_ids')
    unless exercise_ids.indexOf(exercise.id) >= 0
      exercise_ids.push(exercise.id)
    @_changeSettings(id, {exercise_ids})

  removeExercise: (id, exercise) ->
    {exercise_ids} = @_getClonedSettings(id, 'exercise_ids')
    index = exercise_ids?.indexOf(exercise.id)
    exercise_ids?.splice(index, 1)
    @_changeSettings(id, {exercise_ids})

  updateExercises: (id, exercise_ids) ->
    @_changeSettings(id, {exercise_ids})

  moveReading: (id, topicId, step) ->
    {page_ids} = @_getClonedSettings(id, 'page_ids')
    curIndex = page_ids?.indexOf(topicId)
    newIndex = curIndex + step

    if (newIndex < 0)
      newIndex = 0
    if not (newIndex < page_ids.length)
      newIndex = page_ids.length - 1

    page_ids[curIndex] = page_ids[newIndex]
    page_ids[newIndex] = topicId

    @_changeSettings(id, {page_ids})

  moveExercise: (id, exercise, step) ->
    {exercise_ids} = @_getClonedSettings(id, 'exercise_ids')
    curIndex = exercise_ids?.indexOf(exercise.id)
    newIndex = curIndex + step

    if (newIndex < 0)
      newIndex = 0
    if not (newIndex < exercise_ids.length)
      newIndex = exercise_ids.length - 1

    exercise_ids[curIndex] = exercise_ids[newIndex]
    exercise_ids[newIndex] = exercise.id

    @_changeSettings(id, {exercise_ids})

  _getStats: (id) ->
    @_stats[id]

  loadStats: (id) ->
    delete @_stats[id]
    @_asyncStatusStats[id] = 'loading'
    @emitChange()

  loadedStats: (obj, id) ->
    @_stats[id] = obj
    @_asyncStatusStats[id] = 'loaded'
    @emitChange()

  publish: (id) ->
    @emit('publishing', id)
    @_change(id, {is_publish_requested: true})

  _saved: (obj, id) ->
    if obj.is_publish_requested
      PlanPublishActions.queued(obj, id)
      @emit('publish-queued', id)
    obj

  resetPlan: (id) ->
    @_local[id] = _.clone(@_server_copy[id])
    @clearChanged(id)


  _isDeleteRequested: (id) ->
    deleteStates = [
      'deleting'
      'deleted'
    ]
    deleteStates.indexOf(@_asyncStatus[id]) > -1

  _setInitialPlan: (id) ->
    @_local[id].defaultPlan = _.extend({}, @exports.getChanged.call(@, id))

  exports:
    hasTopic: (id, topicId) ->
      plan = @_getPlan(id)
      plan?.settings.page_ids?.indexOf(topicId) >= 0

    getTopics: (id) ->
      plan = @_getPlan(id)
      plan?.settings.page_ids

    isFeedbackImmediate: (id) ->
      plan = @_getPlan(id)
      plan?.is_feedback_immediate

    getEcosystemId: (id, courseId) ->
      plan = @_getPlan(id)
      plan.ecosystem_id or CourseStore.get(courseId)?.ecosystem_id

    hasExercise: (id, exerciseId) ->
      plan = @_getPlan(id)
      plan?.settings.exercise_ids?.indexOf(exerciseId) >= 0

    getExercises: (id) ->
      plan = @_getPlan(id)
      plan?.settings.exercise_ids

    exerciseCount: (id) ->
      plan = @_getPlan(id)
      plan?.settings.exercise_ids.length

    getDescription: (id) ->
      plan = @_getPlan(id)
      plan?.description

    getChangedCleanedTaskings: (id) ->
      serverPlan = @_getOriginal(id)
      changes = @exports.getChanged.call(@, id)
      return changes unless serverPlan?

      if _.isEqual(changes.tasking_plans, serverPlan.tasking_plans)
        changes = _.omit(changes, 'tasking_plans')

      changes

    isHomework: (id) ->
      plan = @_getPlan(id)
      plan.type is PLAN_TYPES.HOMEWORK

    isValid: (id) ->
      plan = @_getPlan(id)

      isValidDates = ->
        flag = true
        # TODO: check that all periods are filled in
        _.each plan.tasking_plans, (tasking) ->
          unless tasking.due_at and tasking.opens_at
            flag = false
        flag and plan.tasking_plans?.length?

      if (plan.type is 'reading')
        return plan.title and isValidDates() and plan.settings?.page_ids?.length > 0
      else if (plan.type is 'homework')
        return plan.title and isValidDates() and plan.settings?.exercise_ids?.length > 0
      else if (plan.type is 'external')
        return plan.title and isValidDates() and validator.isURL(plan.settings?.external_url)
      else if (plan.type is 'event')
        return plan.title and isValidDates()

    isPublished: (id) ->
      plan = @_getPlan(id)
      !!plan?.published_at

    isDeleteRequested: (id) -> @_isDeleteRequested(id)

    isOpened: (id) ->
      firstTasking = @_getFirstTaskingByOpenDate(id)
      isSameOrBeforeNow(firstTasking?.opens_at)

    isVisibleToStudents: (id) ->
      plan = @_getPlan(id)
      firstTasking = @_getFirstTaskingByOpenDate(id)
      (!!plan?.published_at or !!plan?.is_publish_requested) and isSameOrBeforeNow(firstTasking?.opens_at)

    getFirstDueDate: (id) ->
      due_at = @_getFirstTaskingByDueDate(id)?.due_at

    isEditable: (id) ->
      # cannot be/being deleted
      not @_isDeleteRequested(id)

    isPublishing: (id) ->
      @_changed[id]?.is_publish_requested or PlanPublishStore.isPublishing(id)

    canDecreaseTutorExercises: (id) ->
      plan = @_getPlan(id)
      plan.settings.exercises_count_dynamic > TUTOR_SELECTIONS.min

    canIncreaseTutorExercises: (id) ->
      plan = @_getPlan(id)
      plan.settings.exercises_count_dynamic < TUTOR_SELECTIONS.max

    getTutorSelections: (id) ->
      plan = @_getPlan(id)
      plan.settings.exercises_count_dynamic

    getStats: (id) ->
      @_getStats(id)

    _getAt: (id, periodId, attr = 'opens_at') ->
      if periodId?
        tasking = @_getPeriodDates(id, periodId)
        if tasking?[attr]?
          at = tasking?[attr]
          at = TimeHelper.makeMoment(at)
      else
        # default opens_at to 1 day from now
        at = @_getTaskingsCommonDate(id, attr)
      at

    _getOpensAt: (id, periodId) ->
      opensAt = @exports._getAt.call(@, id, periodId, 'opens_at')

    getOpensAtDate: (id, periodId) ->
      opensAt = @exports._getOpensAt.call(@, id, periodId)
      opensAt?.format?(TimeHelper.ISO_DATE_FORMAT) or opensAt

    getOpensAtTime: (id, periodId) ->
      opensAt = @exports._getOpensAt.call(@, id, periodId)
      return undefined if isDateStringOnly opensAt?.creationData?().input

      opensAt?.format?(TimeHelper.ISO_TIME_FORMAT)

    getOpensAt: (id, periodId) ->
      opensAt = @exports._getOpensAt.call(@, id, periodId)
      opensAt?.format?("#{TimeHelper.ISO_DATE_FORMAT} #{TimeHelper.ISO_TIME_FORMAT}") or opensAt

    _getDueAt: (id, periodId) ->
      dueAt = @exports._getAt.call(@, id, periodId, 'due_at')

    getDueAtDate: (id, periodId) ->
      dueAt = @exports._getDueAt.call(@, id, periodId)
      dueAt?.format?(TimeHelper.ISO_DATE_FORMAT) or dueAt

    getDueAtTime: (id, periodId) ->
      dueAt = @exports._getDueAt.call(@, id, periodId)
      return undefined if isDateStringOnly dueAt?.creationData?().input

      dueAt?.format?(TimeHelper.ISO_TIME_FORMAT)

    getDueAt: (id, periodId) ->
      dueAt = @exports._getDueAt.call(@, id, periodId)
      dueAt?.format?("#{TimeHelper.ISO_DATE_FORMAT} #{TimeHelper.ISO_TIME_FORMAT}") or dueAt

    getMaxDueAt: (id, periodId) ->
      dueAt = @exports.getDueAt.call(@, id, periodId)
      return dueAt unless dueAt?

      dueAt = TimeHelper.makeMoment(@exports.getDueAt.call(@, id, periodId))
      dueAt.startOf('day').subtract(1, 'day').format(TimeHelper.ISO_DATE_FORMAT)

    getMinDueAt: (id, periodId) ->
      opensAt = TimeHelper.makeMoment(@exports.getOpensAt.call(@, id, periodId))
      if opensAt.isBefore(TimeStore.getNow())
        opensAt = moment(TimeStore.getNow())

      opensAt.startOf('day').add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT)

    hasTasking: (id, periodId) ->
      plan = @_getPlan(id)
      {tasking_plans} = plan
      !!@_findTasking(tasking_plans, periodId)

    hasAnyTasking: (id) ->
      plan = @_getPlan(id)
      !!plan?.tasking_plans

    getEnabledTaskings: (id) ->
      plan = @_getPlan(id)
      plan?.tasking_plans

    isStatsLoading: (id) -> @_asyncStatusStats[id] is 'loading'

    isStatsLoaded: (id) -> !! @_stats[id]

    isStatsFailed: (id) -> !! @_stats[id]

    hasChanged: (id) -> not _.isEqual(@exports.getChanged.call(@, id), @_local[id].defaultPlan)

extendConfig(TaskPlanConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskPlanConfig)
module.exports = {TaskPlanActions:actions, TaskPlanStore:store}
