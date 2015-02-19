_ = require 'underscore'
flux = require 'flux-react'
{CurrentUserActions, CurrentUserStore} = require './current-user'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskConfig =
  _getStep: (taskId, stepId) ->
    task = @_local[taskId]
    step = _.find task.steps, (s) -> s.id is stepId
    step

  updateStep: (id, stepId, updateObj) ->
    step = @_getStep(id, stepId)
    _.extend(step, updateObj)

  completeStep: (task, step) ->
    # Only mark the step complete once
    step = @_getStep(task.id, step.id)
    unless step.is_completed
      step.is_completed = true # This is tied to getDefaultCurrentStep in getNextStep and occurs before TaskActions.completed is fired
      @emitChange()

  completed: (empty, task, step) ->
    # First arg is null and ignored because it was a PUT ./completed

  setAnswerId: (task, step, answerId) ->
    step = @_getStep(task.id, step.id)
    step.answer_id = answerId
    @emitChange()

  setFreeResponseAnswer: (task, step, freeResponse) ->
    # Find the local objects for task and step
    step = @_getStep(task.id, step.id)
    step.free_response = freeResponse
    @emitChange()

  loadUserTasks: ->
    # Used by API
  loadedUserTasks: (tasks) ->
    # Used by API
    for task in tasks
      @loaded(task, task.id)

    @emitChange()

  exports:
    isStepAnswered: (taskId, stepId) ->
      step = @_getStep(taskId, stepId)
      isAnswered = true
      if step.type is 'exercise'
        unless step.answer_id
          isAnswered = false
      isAnswered

    getStepFreeResponse: (taskId, stepId) ->
      step = @_getStep(taskId, stepId)
      step.free_response
    getStepAnswerId: (taskId, stepId) ->
      step = @_getStep(taskId, stepId)
      step.answer_id

    getAll: -> _.values(@_local)


extendConfig(TaskConfig, CrudConfig)
{actions, store} = makeSimpleStore(TaskConfig)
module.exports = {TaskActions:actions, TaskStore:store}
