_ = require 'underscore'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'


TaskPlanConfig =
  _getPlan: (planId) ->
    @_local[planId] ?= {}
    @_local[planId].settings ?= {}
    @_local[planId].settings.page_ids ?= []
    @_local[planId].settings.exercise_ids ?= []
    #TODO take out once TaskPlan api is in place
    _.extend({}, @_local[planId], @_changed[planId])

  FAILED: ->

  updateTitle: (id, title) ->
    @_change(id, {title})

  updateDescription:(id, description) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids} = plan.settings
    page_ids = page_ids[..]
    exercise_ids = exercise_ids[..]
    @_change(id, {settings: {page_ids, exercise_ids, description}})

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

  addTopic: (id, topicId) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, description} = plan.settings
    page_ids = page_ids[..] # Copy the page_ids so we can reset it back if clearChanged() is called

    page_ids.push(topicId) unless plan.settings.page_ids.indexOf(topicId) >= 0

    exercise_ids = []
    @_change(id, {settings: {page_ids, exercise_ids, description}})

  removeTopic: (id, topicId) ->
    plan = @_getPlan(id)
    {page_ids, description} = plan.settings
    page_ids = page_ids[..] # Copy the page_ids so we can reset it back if clearChanged() is called
    
    index = page_ids?.indexOf(topicId)
    page_ids?.splice(index, 1)

    exercise_ids = []
    @_change(id, {settings: {page_ids, exercise_ids, description}})

  addExercise: (id, exercise) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, description} = plan.settings
    exercise_ids = exercise_ids[..]

    unless plan.settings.exercise_ids.indexOf(exercise.id) >= 0
      exercise_ids.push(exercise.id)

    @_change(id, {settings: {page_ids, exercise_ids, description}})

  removeExercise: (id, exercise) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, description} = plan.settings
    exercise_ids = exercise_ids[..]

    index = exercise_ids?.indexOf(exercise.id)
    exercise_ids?.splice(index, 1)

    @_change(id, {settings: {page_ids, exercise_ids, description}})

  moveExercise: (id, exercise, step) ->
    plan = @_getPlan(id)
    {page_ids, exercise_ids, description} = plan.settings
    exercise_ids = exercise_ids[..]

    curIndex = exercise_ids?.indexOf(exercise.id)
    newIndex = curIndex + step

    if (newIndex < 0)
      newIndex = 0
    if not (newIndex < exercise_ids.length)
      newIndex = exercise_ids.length - 1

    exercise_ids[curIndex] = exercise_ids[newIndex]
    exercise_ids[newIndex] = exercise.id

    @_change(id, {settings: {page_ids, exercise_ids, description}})

  publish: (id) ->

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
      plan=@_getPlan(id)
      plan?.settings.description

    isHomework: (id) ->
      plan = @_getPlan(id)
      plan.type is 'homework'

    isValid: (id) ->
      plan = @_getPlan(id)
      if (plan.type is 'reading')
        return plan.title and plan.opens_at and plan.due_at and plan.settings?.page_ids?.length > 0
      else if (plan.type is 'homework')
        return plan.title and plan.due_at and plan.settings?.exercise_ids?.length > 0

    isPublished: (id) ->
      plan = @_getPlan(id)
      !!plan?.published_at

extendConfig(TaskPlanConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskPlanConfig)
module.exports = {TaskPlanActions:actions, TaskPlanStore:store}
