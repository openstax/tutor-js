# coffeelint: disable=no_empty_functions
_ = require 'underscore'
moment = require 'moment'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{TimeStore} = require './time'
{TocStore} = require './toc'
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

    # default opens_at to 1 day from now
    obj.opens_at = moment(TimeStore.getNow()).add(1, 'day').toDate()

    # iReadings should not contain exercise_ids and will cause a silent 422 on publish
    if obj.type is PLAN_TYPES.READING
      delete obj.settings.exercise_ids
      delete obj.settings.exercises_count_dynamic

    obj

  FAILED: -> # used by API

  updateTutorSelection: (id, direction) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, exercises_count_dynamic, description} = plan.settings
    exercises_count_dynamic += direction

    exercises_count_dynamic = Math.min(TUTOR_SELECTIONS.max, exercises_count_dynamic)
    exercises_count_dynamic = Math.max(TUTOR_SELECTIONS.min, exercises_count_dynamic)

    @_change(id, {settings: {page_ids, exercise_ids, description, exercises_count_dynamic}})

  updateTitle: (id, title) ->
    @_change(id, {title})

  updateDescription:(id, description) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, exercises_count_dynamic} = plan.settings
    page_ids = page_ids[..]
    exercise_ids = exercise_ids[..]
    @_change(id, {settings: {page_ids, exercise_ids, description, exercises_count_dynamic}})

  updateOpensAt: (id, opens_at) ->
    # Allow null opens_at
    if opens_at
      opens_at = opens_at.toISOString()
    @_change(id, {opens_at})

  updateDueAt: (id, due_at) ->
    # Allow null due_at
    if due_at
      due_at = due_at.toISOString()
    @_change(id, {due_at})

  sortTopics: (id) ->
    plan = @_getPlan(id)
    {page_ids, description, exercises_count_dynamic} = plan.settings

    page_ids = sortTopics(page_ids)
    @_change(id, {settings: {page_ids, description, exercises_count_dynamic}})

  addTopic: (id, topicId) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, description, exercises_count_dynamic} = plan.settings
    page_ids = page_ids[..] # Copy the page_ids so we can reset it back if clearChanged() is called

    page_ids.push(topicId) unless plan.settings.page_ids.indexOf(topicId) >= 0
    #sortTopics(page_ids)

    @_change(id, {settings: {page_ids, exercise_ids, description, exercises_count_dynamic}})

  removeTopic: (id, topicId) ->
    plan = @_getPlan(id)
    {page_ids, description, exercise_ids, exercises_count_dynamic} = plan.settings
    page_ids = page_ids[..] # Copy the page_ids so we can reset it back if clearChanged() is called

    index = page_ids?.indexOf(topicId)
    page_ids?.splice(index, 1)

    exercise_ids = ExerciseStore.removeTopicExercises(exercise_ids, topicId)
    @_change(id, {settings: {page_ids, exercise_ids, description, exercises_count_dynamic}})

  addExercise: (id, exercise) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, description, exercises_count_dynamic} = plan.settings
    exercise_ids = exercise_ids[..]

    unless plan.settings.exercise_ids.indexOf(exercise.id) >= 0
      exercise_ids.push(exercise.id)

    @_change(id, {settings: {page_ids, exercise_ids, description, exercises_count_dynamic}})

  removeExercise: (id, exercise) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, description, exercises_count_dynamic} = plan.settings
    exercise_ids = exercise_ids[..]

    index = exercise_ids?.indexOf(exercise.id)
    exercise_ids?.splice(index, 1)

    @_change(id, {settings: {page_ids, exercise_ids, description, exercises_count_dynamic}})

  moveReading: (id, topicId, step) ->
    plan = @_getPlan(id)
    {page_ids, description, exercises_count_dynamic} = plan.settings
    page_ids = page_ids[..]

    curIndex = page_ids?.indexOf(topicId)
    newIndex = curIndex + step

    if (newIndex < 0)
      newIndex = 0
    if not (newIndex < page_ids.length)
      newIndex = page_ids.length - 1

    page_ids[curIndex] = page_ids[newIndex]
    page_ids[newIndex] = topicId

    @_change(id, {settings: {page_ids, description, exercises_count_dynamic}})

  moveExercise: (id, exercise, step) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, description, exercises_count_dynamic} = plan.settings
    exercise_ids = exercise_ids[..]

    curIndex = exercise_ids?.indexOf(exercise.id)
    newIndex = curIndex + step

    if (newIndex < 0)
      newIndex = 0
    if not (newIndex < exercise_ids.length)
      newIndex = exercise_ids.length - 1

    exercise_ids[curIndex] = exercise_ids[newIndex]
    exercise_ids[newIndex] = exercise.id

    @_change(id, {settings: {page_ids, exercise_ids, description, exercises_count_dynamic}})


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
    @_change(id, {is_published: true})

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
      plan?.settings.description

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

    getOpensAt: (id) ->
      plan = @_getPlan(id)
      plan.opens_at

    isStatsLoading: (id) -> @_asyncStatusStats[id] is 'loading'

    isStatsLoaded: (id) -> !! @_stats[id]

    isStatsFailed: (id) -> !! @_stats[id]

extendConfig(TaskPlanConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskPlanConfig)
module.exports = {TaskPlanActions:actions, TaskPlanStore:store}
