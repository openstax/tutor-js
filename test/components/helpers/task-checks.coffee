{expect} = require 'chai'
{Promise} = require 'es6-promise'
_ = require 'underscore'

{TaskStepActions, TaskStepStore} = require '../../../src/flux/task-step'
{TaskActions, TaskStore} = require '../../../src/flux/task'

taskChecks =
  _checkAllowContinue: ({div, component, state, router, history}) ->
    continueButton = div.querySelector('.-continue')
    expect(continueButton).to.not.be.null
    expect(continueButton.className).to.not.contain('disabled')

    {div, component, state, router, history}

  _checkIsIntroScreen: ({div, component, state, router, history}) ->
    expect(div.querySelector('.-task-intro')).to.not.be.null

    {div, component, state, router, history}

  _checkIsNotIntroScreen: ({div, component, state, router, history}) ->
    expect(div.querySelector('.-task-intro')).to.be.null

    {div, component, state, router, history}

  _checkIsTargetStepId: (targetStepId, {div, component, stepId, taskId, state, router, history}) ->
    expect(stepId).to.equal(targetStepId)

    step = TaskStepStore.get(targetStepId)

    componentStepId = component.getId?()
    if componentStepId
      expect(componentStepId).to.equal(targetStepId)

    {div, component, state, router, history}

  _checkIsDefaultStep: ({div, component, stepId, taskId, state, router, history}) ->
    stepIndex = TaskStore.getCurrentStepIndex(taskId)
    steps = TaskStore.getStepsIds(taskId)
    targetStepId = steps[stepIndex].id

    taskChecks._checkIsTargetStepId(targetStepId, {div, component, stepId, taskId, state, router, history})
    {div, component, stepId, taskId, state, router, history}

  _checkRenderFreeResponse: ({div, component, stepId, taskId, state, router, history}) ->
    continueButton = div.querySelector('.-continue')

    expect(div.querySelector('.answers-table')).to.be.null
    expect(continueButton.className).to.contain('disabled')

    # TODO
    # Will eventually test based on task type.  Assuming exercise with free
    # response for now.
    step = TaskStepStore.get(stepId)
    expect(step.free_response).to.be.undefined
    expect(div.querySelector('textarea').value).to.equal('')
    {div, component, stepId, taskId, state, router, history}

  _checkAnswerFreeResponse: ({div, component, stepId, taskId, state, router, history, textarea}) ->
    step = TaskStepStore.get(stepId)

    expect(step.free_response).to.equal(textarea.value)
    {div, component, stepId, taskId, state, router, history, textarea}

  _checkSubmitFreeResponse: ({div, component, stepId, taskId, state, router, history}) ->
    continueButton = div.querySelector('.-continue')

    # Prevent continue until answer chosen, answers should be showing.
    expect(continueButton.className).to.contain('disabled')
    expect(div.querySelector('.answers-table')).to.not.be.null
    expect(div.querySelector('.answer-checked')).to.be.null
    {div, component, stepId, taskId, state, router, history}

  _checkAnswerMultipleChoice: ({div, component, stepId, taskId, state, router, history, answer}) ->
    step = TaskStepStore.get(stepId)
    continueButton = div.querySelector('.-continue')

    # Continue should be allowed
    expect(continueButton.className).to.not.contain('disabled')
    expect(step.answer_id).to.not.be.null
    expect(step.answer_id).to.equal(answer.id)
    {div, component, stepId, taskId, state, router, history, answer}

  _checkSubmitMultipleChoice: ({div, component, stepId, taskId, state, router, history, correct_answer, feedback_html}) ->
    expect(div.querySelector('.answer-correct').innerText).to.equal(correct_answer.content_html)
    expect(div.querySelector('.answer-correct').innerHTML).to.not.equal(div.querySelector('.answer-checked').innerHTML)
    expect(div.querySelector('.question-feedback').innerHTML).to.equal(feedback_html)
    {div, component, stepId, taskId, state, router, history, correct_answer, feedback_html}

  _checkIsNextStep: ({div, component, stepId, taskId, state, router, history}) ->
    stepIndex = TaskStore.getCurrentStepIndex(taskId)
    steps = TaskStore.getStepsIds(taskId)
    targetStepId = steps[stepIndex - 1].id

    taskChecks._checkIsTargetStepId(targetStepId, {div, component, stepId, taskId, state, router, history})

    {div, component, stepId, taskId, state, router, history}

  _checkIsNotCompletePage: ({div, component, stepId, taskId, state, router, history}) ->
    {type} = TaskStore.get(taskId)
    type ?= 'task'
    expect(div.querySelector(".-#{type}-completed")).to.be.null

    {div, component, stepId, taskId, state, router, history}

  _checkIsCompletePage: ({div, component, stepId, taskId, state, router, history}) ->
    {type} = TaskStore.get(taskId)
    type ?= 'task'
    expect(div.querySelector(".-#{type}-completed")).to.not.be.null

    {div, component, stepId, taskId, state, router, history}

  _checkIsPopoverOpen: ({div, component, stepId, taskId, state, router, history}) ->
    expect(document.querySelector('.task-details-popover h1')).to.not.be.null

    {div, component, stepId, taskId, state, router, history}

# promisify for chainability in specs
_.each(taskChecks, (check, checkName) ->
  # rename without _ in front
  promiseName = checkName.slice(1)

  taskChecks[promiseName] = (args...) ->
    Promise.resolve(check(args...))
)

# These guys messed up the groove, maybe will change the way these work later
taskChecks._checkIsMatchStep = (stepIndex, {div, component, stepId, taskId, state, router, history}) ->
  steps = TaskStore.getStepsIds(taskId)
  targetStepId = steps[stepIndex].id
  taskChecks._checkIsTargetStepId(targetStepId, {div, component, stepId, taskId, state, router, history})

  {div, component, stepId, taskId, state, router, history}

taskChecks.checkIsMatchStep = (matchStepIndex) ->
  (args...)->
    Promise.resolve(taskChecks._checkIsMatchStep(matchStepIndex, args...))

module.exports = taskChecks
