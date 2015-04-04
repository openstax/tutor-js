{expect} = require 'chai'
{Promise} = require 'es6-promise'

{TaskStepActions, TaskStepStore} = require '../../../src/flux/task-step'
{TaskActions, TaskStore} = require '../../../src/flux/task'

taskChecks = 
  _checkAllowContinue: ({taskDiv, taskComponent, state, router, history}) ->
    continueButton = taskDiv.querySelector('.-continue')
    expect(continueButton).to.not.be.null
    expect(continueButton.className).to.not.contain('disabled')

  _checkIsNotIntroScreen: ({taskDiv, taskComponent, state, router, history}) ->
    expect(taskDiv.querySelector('.-task-intro')).to.be.null

  _checkIsTargetStepId: (targetStepId, {taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    expect(stepId).to.equal(targetStepId)

    step = TaskStepStore.get(targetStepId)

    componentStepId = taskComponent.getId?()
    if componentStepId
      expect(componentStepId).to.equal(targetStepId)

  _checkIsDefaultStep: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    stepIndex = TaskStore.getCurrentStepIndex(taskId)
    steps = TaskStore.getStepsIds(taskId)
    targetStepId = steps[stepIndex].id

    taskChecks._checkIsTargetStepId(targetStepId, {taskDiv, taskComponent, stepId, taskId, state, router, history})
    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  _checkRenderFreeResponse: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    continueButton = taskDiv.querySelector('.-continue')

    expect(taskDiv.querySelector('.answers-table')).to.be.null
    expect(continueButton.className).to.contain('disabled')

    # TODO
    # Will eventually test based on task type.  Assuming exercise with free
    # response for now.
    step = TaskStepStore.get(stepId)
    expect(step.free_response).to.be.undefined
    expect(taskDiv.querySelector('textarea').value).to.equal('')
    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  _checkAnswerFreeResponse: ({taskDiv, taskComponent, stepId, taskId, state, router, history, textarea}) ->
    step = TaskStepStore.get(stepId)

    expect(step.free_response).to.equal(textarea.value)
    {taskDiv, taskComponent, stepId, taskId, state, router, history, textarea}

  _checkSubmitFreeResponse: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    expect(taskDiv.querySelector('.answers-table')).to.not.be.null
    expect(taskDiv.querySelector('.answer-checked')).to.be.null
    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  _checkAnswerMultipleChoice: ({taskDiv, taskComponent, stepId, taskId, state, router, history, answer}) ->
    step = TaskStepStore.get(stepId)

    expect(step.answer_id).to.not.be.null
    expect(step.answer_id).to.equal(answer.id)
    {taskDiv, taskComponent, stepId, taskId, state, router, history, answer}

  _checkSubmitMultipleChoice: ({taskDiv, taskComponent, stepId, taskId, state, router, history, correct_answer, feedback_html}) ->
    expect(taskDiv.querySelector('.answer-correct').innerText).to.equal(correct_answer.content_html)
    expect(taskDiv.querySelector('.answer-correct').innerHTML).to.not.equal(taskDiv.querySelector('.answer-checked').innerHTML)
    expect(taskDiv.querySelector('.question-feedback').innerHTML).to.equal(feedback_html)
    {taskDiv, taskComponent, stepId, taskId, state, router, history, correct_answer, feedback_html}

  _checkIsNextStep: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    stepIndex = TaskStore.getCurrentStepIndex(taskId)
    steps = TaskStore.getStepsIds(taskId)
    targetStepId = steps[stepIndex - 1].id

    taskChecks._checkIsTargetStepId(targetStepId, {taskDiv, taskComponent, stepId, taskId, state, router, history})

    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  _checkIsMatchStep: (stepIndex, {taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    steps = TaskStore.getStepsIds(taskId)
    targetStepId = steps[stepIndex].id

    taskChecks._checkIsTargetStepId(targetStepId, {taskDiv, taskComponent, stepId, taskId, state, router, history})

    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  _checkIsNotCompletePage: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    {type} = TaskStore.get(taskId)
    type ?= 'task'
    expect(taskDiv.querySelector(".-#{type}-completed")).to.be.null

    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  _checkIsCompletePage: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    {type} = TaskStore.get(taskId)
    type ?= 'task'
    expect(taskDiv.querySelector(".-#{type}-completed")).to.not.be.null

    {taskDiv, taskComponent, stepId, taskId, state, router, history}


  # promisify for chainability in specs
  checkAllowContinue: (args...)->
    Promise.resolve(taskChecks._checkAllowContinue(args...))
  checkIsNotIntroScreen: (args...)->
    Promise.resolve(taskChecks._checkIsNotIntroScreen(args...))
  checkIsDefaultStep: (args...)->
    Promise.resolve(taskChecks._checkIsDefaultStep(args...))
  checkRenderFreeResponse: (args...)->
    Promise.resolve(taskChecks._checkRenderFreeResponse(args...))
  checkAnswerFreeResponse: (args...)->
    Promise.resolve(taskChecks._checkAnswerFreeResponse(args...))
  checkSubmitFreeResponse: (args...)->
    Promise.resolve(taskChecks._checkSubmitFreeResponse(args...))
  checkAnswerMultipleChoice: (args...)->
    Promise.resolve(taskChecks._checkAnswerMultipleChoice(args...))
  checkSubmitMultipleChoice: (args...)->
    Promise.resolve(taskChecks._checkSubmitMultipleChoice(args...))
  checkIsNextStep: (args...)->
    Promise.resolve(taskChecks._checkIsNextStep(args...))
  checkIsMatchStep: (matchStepIndex) ->
    (args...)->
      Promise.resolve(taskChecks._checkIsMatchStep(matchStepIndex, args...))
  checkIsNotCompletePage: (args...)->
    Promise.resolve(taskChecks._checkIsNotCompletePage(args...))
  checkIsCompletePage: (args...)->
    Promise.resolve(taskChecks._checkIsCompletePage(args...))

module.exports = taskChecks