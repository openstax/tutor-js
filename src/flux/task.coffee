_ = require 'underscore'
flux = require 'flux-react'
{CurrentUserActions, CurrentUserStore} = require './current-user'
{AnswerStore} = require './answer'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskConfig =
  complete: (id) ->
    @emitChange()

  updateStep: (id, stepId, updateObj) ->
    task = @_local[id]
    _.extend(task.steps[stepId], updateObj)

  completeStep: (id, stepId) ->
    task = @_local[id]
    # Only mark the step complete once
    step = task.steps[stepId]
    unless step.is_completed
      step.is_completed = true

      # HACK: Tack on a fake correct_answer and feedback
      if step.content?.questions?[0]?.answers[0]?
        step.correct_answer_id = step.content.questions[0].answers[0].id
        step.feedback_html = 'Some <em>FAKE</em> feedback'

      @emitChange()

  exports:
    isStepAnswered: (id, stepId) ->
      step = @_local[id].steps[stepId]

      isAnswered = true
      if step.type is 'exercise'
        for question in step.content.questions
          unless AnswerStore.getAnswer(question)?
            isAnswered = false
            break
      isAnswered


extendConfig(TaskConfig, CrudConfig)
{actions, store} = makeSimpleStore(TaskConfig)
module.exports = {TaskActions:actions, TaskStore:store}
