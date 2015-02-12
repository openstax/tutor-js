_ = require 'underscore'
flux = require 'flux-react'
{CurrentUserActions, CurrentUserStore} = require './current-user'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskConfig =
  updateStep: (id, stepId, updateObj) ->
    task = @_local[id]
    _.extend(task.steps[stepId], updateObj)

  completeStep: (task, step) ->
    task = @_local[task.id]
    # Only mark the step complete once
    step = task.steps[step.id]
    unless step.is_completed
      step.is_completed = true

      # HACK: Tack on a fake correct_answer and feedback
      if step.content?.questions?[0]?.answers[0]?
        step.correct_answer_id = step.content.questions[0].answers[0].id
        step.feedback_html = 'Some <em>FAKE</em> feedback'

      @emitChange()

  setAnswerId: (task, step, answerId) ->
    step = @_local[task.id].steps[step.id]
    step.answer_id = answerId
    @emitChange()

  setFreeResponseAnswer: (task, step, freeResponse) ->
    step = @_local[task.id].steps[step.id]
    step.free_response = freeResponse
    @emitChange()

  _loaded: (obj, id) ->
    # Add a .url field to both the task and each step so API can patch the answer and completion info
    obj.url ?= "/api/tasks/#{id}"
    for step, i in obj.steps
      step.id ?= i
      step.url ?= "/api/tasks/#{id}/steps/#{step.id}"

  _saved: (obj, id) -> @_loaded(obj, id)

  exports:
    isStepAnswered: (id, stepId) ->
      step = @_local[id].steps[stepId]

      isAnswered = true
      if step.type is 'exercise'
        unless step.answer_id
          isAnswered = false
      isAnswered

    getStepFreeResponse: (id, stepId) ->
      step = @_local[id].steps[stepId]
      step.free_response
    getStepAnswerId: (id, stepId) ->
      step = @_local[id].steps[stepId]
      step.answer_id


extendConfig(TaskConfig, CrudConfig)
{actions, store} = makeSimpleStore(TaskConfig)
module.exports = {TaskActions:actions, TaskStore:store}
