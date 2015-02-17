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
    # @load(task.id)

    # Only mark the step complete once
    step = @_getStep(task.id, step.id)
    step.is_completed = true
    # HACK: Tack on a fake correct_answer and feedback
    if step.content?.questions?[0]?.answers[0]?
      step.correct_answer_id = step.content.questions[0].answers[0].id
      step.feedback_html = 'Some <em>FAKE</em> feedback'
    @emitChange()

  setAnswerId: (task, step, answerId) ->
    step = @_getStep(task.id, step.id)
    step.answer_id = answerId
    @emitChange()

  setFreeResponseAnswer: (task, step, freeResponse) ->
    # Find the local objects for task and step
    step = @_getStep(task.id, step.id)
    step.free_response = freeResponse
    @emitChange()

  _loaded: (obj, id) ->
    # Add a .url field to both the task and each step so API can patch the answer and completion info
    obj.url ?= "/api/tasks/#{id}"
    for step, i in obj.steps
      throw new Error('Bug! No Step ID Provided!') unless step.id
      step.url ?= "/api/tasks/#{id}/steps/#{step.id}"

  _saved: (obj, id) -> @_loaded(obj, id)

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


extendConfig(TaskConfig, CrudConfig)
{actions, store} = makeSimpleStore(TaskConfig)
module.exports = {TaskActions:actions, TaskStore:store}
