# coffeelint: disable=no_empty_functions
_ = require 'underscore'
cloneDeep = require 'lodash/cloneDeep'
each = require 'lodash/each'
map = require 'lodash/map'
pick = require 'lodash/pick'
isEmpty = require 'lodash/isEmpty'
negate = require 'lodash/negate'
validator = require 'validator'
moment = require 'moment'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{TocStore} = require './toc'
TimeHelper  = require '../helpers/time'
{ExerciseStore} = require './exercise'
{ default: Publishing } = require '../models/jobs/task-plan-publish'

{default: Courses} = require '../models/course'
ContentHelpers = require '../helpers/content'

planCrudConfig = new CrudConfig()

hasValue = negate(isEmpty)

TUTOR_SELECTIONS =
  default: 3
  max: 4
  min: 2

PLAN_TYPES =
  HOMEWORK: 'homework'
  READING: 'reading'
  EXTERNAL: 'external'
  EVENT: 'event'

DEFAULT_TYPE = PLAN_TYPES.READING

sortTopics = (topics) ->
  _.sortBy(topics, (topicId) ->
    topic = TocStore.getSectionInfo(topicId)
    ContentHelpers.chapterSectionToNumber(topic.chapter_section)
  )

BASE_PLANS =
  homework:
    is_feedback_immediate: false
    settings:
      page_ids: []
      exercise_ids: []
      exercises_count_dynamic: TUTOR_SELECTIONS.default
  reading:
    settings:
      page_ids: []
  external:
    settings:
      external_url: ''
  event:
    settings: {}

newTaskPlan = (attributes = {}) ->
  attributes.type ?= DEFAULT_TYPE

  if BASE_PLANS[attributes.type]?
    _.extend({}, attributes, cloneDeep(BASE_PLANS[attributes.type]))
  else
    {}

validateSettings = (taskPlan = {}) ->
  taskPlan.type ?= DEFAULT_TYPE

  expectedSettings = _.keys(BASE_PLANS[taskPlan.type].settings)
  taskPlan.settings = _.pick(taskPlan.settings, expectedSettings)

  taskPlan

TaskPlanConfig =

  _stats: {}
  _asyncStatusStats: {}
  _server_copy: {}
  _silentError: {}

  _loaded: (obj, planId) ->
    @_server_copy[planId] = JSON.stringify(obj) if _.isObject(obj)
    @emit("loaded.#{planId}")
    obj

  # Somewhere, the local copy gets taken apart and rebuilt.
  # Keep a copy of what was served.
  _getOriginal: (planId) ->
    if _.isString(@_server_copy[planId])
      JSON.parse(@_server_copy[planId])
    else
      {}

  create: (localId, attributes = {}) ->
    attributes = newTaskPlan(attributes)
    planCrudConfig.create.call(@, localId, attributes)

  _getPlan: (planId) ->
    obj = @_get(planId)
    obj = validateSettings(obj)
    obj

  FAILED: -> # used by API

  _delete: (id) ->
    @emit('deleting', id)

  _deleted: (result, id, args...) ->
    @emit('deleted', id, result)

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

  replaceTaskings: (id, taskings) ->
    if taskings?
      @_change(id, {tasking_plans: taskings})
    else if @_changed[id]?.tasking_plans?
      delete @_changed[id].tasking_plans
      @emitChange()

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
    {page_ids, type, exercise_ids} = @_getClonedSettings(id, 'page_ids', 'exercise_ids')
    index = page_ids?.indexOf(topicId)
    page_ids?.splice(index, 1)
    if (type is PLAN_TYPES.HOMEWORK)
      exercise_ids = ExerciseStore.removeTopicExercises(exercise_ids, topicId)
    @_changeSettings(id, {page_ids, exercise_ids })

  updateTopics: (id, page_ids) ->
    @_changeSettings(id, {page_ids})

  addExercise: (id, exercise) ->
    {exercise_ids} = @_getClonedSettings(id, 'exercise_ids')
    unless exercise_ids.indexOf(exercise.id) >= 0
      exercise_ids.push(exercise.id)
    @_changeSettings(id, {exercise_ids})
    @emit("change-exercise-#{exercise?.id}")

  removeExercise: (id, exercise) ->
    {exercise_ids} = @_getClonedSettings(id, 'exercise_ids')
    index = exercise_ids?.indexOf(exercise.id)
    exercise_ids?.splice(index, 1)
    @_changeSettings(id, {exercise_ids})
    @emit("change-exercise-#{exercise?.id}")

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

  saveSilent: (id, obj) ->
    @_save(id)
    @emitChange()

  _saved: (obj, id) ->
    @emit("saved.#{id}", obj)


  erroredSilent: (obj, id, courseId) ->
    @emit('errored', obj)

  resetPlan: (id) ->
    @_local[id] = _.clone(@_getOriginal(id))
    @clearChanged(id)

  removeUnsavedDraftPlan: (id) ->
    return unless @exports.isNew.call(@, id)
    delete @_local[id]
    @clearChanged(id)
    @emitChange()

  _isDeleteRequested: (id) ->
    deleteStates = [
      'deleting'
      'deleted'
    ]
    deleteStates.indexOf(@_asyncStatus[id]) > -1


  createClonedPlan: (newPlanId, {planId, courseId, due_at}) ->
    original = @_local[planId]
    originalPlan = {}
    copyKeys = ['title', 'description', 'is_feedback_immediate', 'settings', 'ecosystem_id']
    each(copyKeys, (key) ->
      originalPlan[key] = cloneDeep(original[key])
      # need to prevent false from being returned and ending the each loop early.
      true
    )

    course = Courses.get(courseId)
    tasking_plans = course.periods.map((period) ->
      {
        opens_at: course.starts_at
        target_id: period.id,
        target_type: 'period',
        due_at: due_at
      }
    )

    plan = _.extend(newTaskPlan(type: original.type), originalPlan, {
      id: newPlanId
      cloned_from_id: planId
      tasking_plans: tasking_plans
    })

    @_local[newPlanId] = {}
    @_changed[newPlanId] = plan
    @emitChange()


  exports:
    hasTopic: (id, topicId) ->
      plan = @_getPlan(id)
      plan?.settings.page_ids?.indexOf(topicId) >= 0

    getTopics: (id) ->
      plan = @_getPlan(id)
      plan?.settings.page_ids

    isChangingToDueAt: (id) ->
      plan = @_changed[id]
      plan? and not plan.is_feedback_immediate

    isFeedbackImmediate: (id) ->
      plan = @_getPlan(id)
      plan?.is_feedback_immediate

    getEcosystemId: (id, courseId) ->
      plan = @_getPlan(id)
      plan.ecosystem_id or Courses.get(courseId)?.ecosystem_id

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

    isHomework: (id) ->
      plan = @_getPlan(id)
      plan.type is PLAN_TYPES.HOMEWORK

    isValid: (id) ->
      plan = @_getPlan(id)
      if (plan.type is 'reading')
        hasValue(plan.title) and hasValue(plan.settings) and hasValue(plan.settings.page_ids)
      else if (plan.type is 'homework')
        hasValue(plan.title) and hasValue(plan.settings) and hasValue(plan.settings.exercise_ids)
      else if (plan.type is 'external')
        hasValue(plan.title) and hasValue(plan.settings) and hasValue(plan.settings.external_url)
      else if (plan.type is 'event')
        hasValue(plan.title)
      else
        false

    isPublished: (id) ->
      plan = @_getPlan(id)
      !!plan?.is_published

    isDeleteRequested: (id) -> @_isDeleteRequested(id)

    isEditable: (id) ->
      # cannot be/being deleted
      not @_isDeleteRequested(id)

    isPublishing: (id) ->
      return false if @exports.isNew.call(@, id)
      @_changed[id]?.is_publishing or Publishing.isPublishing(@_getPlan(id))

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

    isStatsLoading: (id) -> @_asyncStatusStats[id] is 'loading'

    isStatsLoaded: (id) -> !! @_stats[id]

    isStatsFailed: (id) -> !! @_stats[id]

    hasChanged: (id) ->
      changed = @exports.getChanged.call(@, id)

      if @exports.isNew.call(@, id)
        # omit tasking plan changes if new plan, only check for changes in other fields
        changed = _.omit(changed, 'tasking_plans')
        defaultTaskPlan = newTaskPlan({type: changed.type})
        return not _.isEqual(changed, defaultTaskPlan)

      not _.isEmpty(changed)

extendConfig(TaskPlanConfig, planCrudConfig)
{actions, store} = makeSimpleStore(TaskPlanConfig)
module.exports = {TaskPlanActions:actions, TaskPlanStore:store}
