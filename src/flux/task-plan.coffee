# coffeelint: disable=no_empty_functions
_ = require 'underscore'
moment = require 'moment'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{TocStore} = require './toc'
{TimeStore} = require './time'
{ExerciseStore} = require './exercise'

TUTOR_SELECTIONS =
  default: 3
  max: 4
  min: 2

PLAN_TYPES =
  HOMEWORK: 'homework'
  READING: 'reading'

sortTopics = (topics) ->
  _.sortBy(topics, (topicId) ->
    topic = TocStore.getSectionInfo(topicId)
    topic.chapter_section.toString()
  )

TaskPlanConfig =

  _stats: {}
  _asyncStatusStats: {}

  _getPlan: (planId) ->
    @_local[planId] ?= {}
    @_local[planId].settings ?= {}
    @_local[planId].settings.page_ids ?= []

    if @_local[planId]?.type is PLAN_TYPES.HOMEWORK or @_changed[planId]?.type is PLAN_TYPES.HOMEWORK
      @_local[planId].settings.exercise_ids ?= []
      @_local[planId].settings.exercises_count_dynamic ?= TUTOR_SELECTIONS.default

    #TODO take out once TaskPlan api is in place
    _.extend({}, @_local[planId], @_changed[planId])
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


  setPeriods: (id, periods, opens_at) ->
    tasking_plans = _.map periods, (period) ->
      _.extend( _.pick(period, 'opens_at', 'due_at'),
        target_id: period.id, target_type:'period'
      )
    @_change(id, {tasking_plans})

  _findTasking: (tasking_plans, periodId) ->
    _.findWhere(tasking_plans, {target_id:periodId, target_type:'period'})

  _getPeriodDates: (id, period) ->
    throw new Error('BUG: Period is required arg') unless period
    plan = @_getPlan(id)
    {tasking_plans} = plan
    if tasking_plans
      @_findTasking(tasking_plans, period)
    else
      null

  # detects if all taskings are set to the same due_at/opens_at date
  # if so the date is returned, else null
  _getTaskingsCommonDate: (id, attr) ->
    {tasking_plans} = @_getPlan(id)
    # do all the tasking_plans have the same date?
    dates = _.compact _.uniq _.map(tasking_plans, (plan) ->
      plan[attr]?.getTime()
    )
    if dates.length is 1 then new Date(_.first(dates)) else null

  updateTutorSelection: (id, direction) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, exercises_count_dynamic} = plan.settings
    exercises_count_dynamic += direction

    exercises_count_dynamic = Math.min(TUTOR_SELECTIONS.max, exercises_count_dynamic)
    exercises_count_dynamic = Math.max(TUTOR_SELECTIONS.min, exercises_count_dynamic)

    @_change(id, {settings: {page_ids, exercise_ids, exercises_count_dynamic}})

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

    if periodId
      tasking = @_findTasking(tasking_plans, periodId)
      tasking[attr] = date
    else
      for tasking in tasking_plans
        tasking[attr] = date

    @_change(id, {tasking_plans})

  updateOpensAt: (id, opens_at, periodId) ->
    @updateDateAttribute(id, 'opens_at', opens_at, periodId)

  updateDueAt: (id, due_at, periodId) ->
    @updateDateAttribute(id, 'due_at', due_at, periodId)

  sortTopics: (id) ->
    plan = @_getPlan(id)
    {page_ids, exercises_count_dynamic} = plan.settings

    page_ids = sortTopics(page_ids)
    @_change(id, {settings: {page_ids, exercises_count_dynamic}})

  addTopic: (id, topicId) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, exercises_count_dynamic} = plan.settings
    page_ids = page_ids[..] # Copy the page_ids so we can reset it back if clearChanged() is called

    page_ids.push(topicId) unless plan.settings.page_ids.indexOf(topicId) >= 0
    #sortTopics(page_ids)

    @_change(id, {settings: {page_ids, exercise_ids, exercises_count_dynamic}})

  removeTopic: (id, topicId) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, exercises_count_dynamic} = plan.settings
    page_ids = page_ids[..] # Copy the page_ids so we can reset it back if clearChanged() is called

    index = page_ids?.indexOf(topicId)
    page_ids?.splice(index, 1)

    exercise_ids = ExerciseStore.removeTopicExercises(exercise_ids, topicId)
    @_change(id, {settings: {page_ids, exercise_ids, exercises_count_dynamic}})

  addExercise: (id, exercise) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, exercises_count_dynamic} = plan.settings
    exercise_ids = exercise_ids[..]

    unless plan.settings.exercise_ids.indexOf(exercise.id) >= 0
      exercise_ids.push(exercise.id)

    @_change(id, {settings: {page_ids, exercise_ids, exercises_count_dynamic}})

  removeExercise: (id, exercise) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, exercises_count_dynamic} = plan.settings
    exercise_ids = exercise_ids[..]

    index = exercise_ids?.indexOf(exercise.id)
    exercise_ids?.splice(index, 1)

    @_change(id, {settings: {page_ids, exercise_ids, exercises_count_dynamic}})

  moveReading: (id, topicId, step) ->
    plan = @_getPlan(id)
    {page_ids, exercises_count_dynamic} = plan.settings
    page_ids = page_ids[..]

    curIndex = page_ids?.indexOf(topicId)
    newIndex = curIndex + step

    if (newIndex < 0)
      newIndex = 0
    if not (newIndex < page_ids.length)
      newIndex = page_ids.length - 1

    page_ids[curIndex] = page_ids[newIndex]
    page_ids[newIndex] = topicId

    @_change(id, {settings: {page_ids, exercises_count_dynamic}})

  moveExercise: (id, exercise, step) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, exercises_count_dynamic} = plan.settings
    exercise_ids = exercise_ids[..]

    curIndex = exercise_ids?.indexOf(exercise.id)
    newIndex = curIndex + step

    if (newIndex < 0)
      newIndex = 0
    if not (newIndex < exercise_ids.length)
      newIndex = exercise_ids.length - 1

    exercise_ids[curIndex] = exercise_ids[newIndex]
    exercise_ids[newIndex] = exercise.id

    @_change(id, {settings: {page_ids, exercise_ids, exercises_count_dynamic}})


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
    @_change(id, {is_publish_requested: true})

  exports:
    hasTopic: (id, topicId) ->
      plan = @_getPlan(id)
      plan?.settings.page_ids?.indexOf(topicId) >= 0

    getTopics: (id) ->
      plan = @_getPlan(id)
      plan?.settings.page_ids

    hasExercise: (id, exerciseId) ->
      plan = @_getPlan(id)
      plan?.settings.exercise_ids?.indexOf(exerciseId) >= 0

    getExercises: (id) ->
      plan = @_getPlan(id)
      plan?.settings.exercise_ids

    getDescription: (id) ->
      plan = @_getPlan(id)
      plan?.description

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
        flag

      if (plan.type is 'reading')
        return plan.title and isValidDates() and plan.settings?.page_ids?.length > 0
      else if (plan.type is 'homework')
        return plan.title and isValidDates() and plan.settings?.exercise_ids?.length > 0

    isPublished: (id) ->
      plan = @_getPlan(id)
      !!plan?.published_at

    isOpened: (id) ->
      plan = @_getPlan(id)
      new Date(plan?.opens_at) <= TimeStore.getNow()

    isVisibleToStudents: (id) ->
      plan = @_getPlan(id)
      !!plan?.published_at and new Date(plan?.opens_at) <= TimeStore.getNow()

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

    getOpensAt: (id, periodId) ->
      if periodId?
        tasking = @_getPeriodDates(id, periodId)
        tasking?.opens_at
      else
        # default opens_at to 1 day from now
        @_getTaskingsCommonDate(id, 'opens_at')

    getDueAt: (id, periodId) ->
      if periodId?
        tasking = @_getPeriodDates(id, periodId)
        tasking?.due_at
      else
        @_getTaskingsCommonDate(id, 'due_at')

    hasTasking: (id, periodId) ->
      plan = @_getPlan(id)
      {tasking_plans} = plan
      !!@_findTasking(tasking_plans, periodId)

    isStatsLoading: (id) -> @_asyncStatusStats[id] is 'loading'

    isStatsLoaded: (id) -> !! @_stats[id]

    isStatsFailed: (id) -> !! @_stats[id]

extendConfig(TaskPlanConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskPlanConfig)
module.exports = {TaskPlanActions:actions, TaskPlanStore:store}
