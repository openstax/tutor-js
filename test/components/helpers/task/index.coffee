React = require 'react/addons'
{Promise} = require 'es6-promise'

actions = require './actions'
checks = require './checks'

{TaskActions, TaskStore} = require '../../../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../../../src/flux/task-step'
TaskStep = require '../../../../src/components/task-step'

{routerStub, componentStub, commonActions} = require '../utilities'

tests =

  delay: 200

  container: document.createElement('div')

  unmount: ->
    React.unmountComponentAtNode(@container)
    @container = document.createElement('div')

  _renderTaskStep: (stepId, taskId, onNextStep, goToStep) ->
    div = @container
    componentStub._render(div, <TaskStep id={stepId} goToStep={goToStep} onNextStep={onNextStep}/>, {stepId, taskId})

  renderStep: (taskId) ->
    {id} = TaskStore.getCurrentStep(taskId)
    taskTests = @

    # TODO Do something for these handlers
    onNextStep = ->
    goToStep = (num)-> =>

    @_renderTaskStep(id, taskId, onNextStep, goToStep)

  goToTask: (route, taskId) ->
    div = @container
    {id} = TaskStore.getCurrentStep(taskId)
    routerStub._goTo(div, route, {stepId: id, taskId})

  # convenience methods
  renderFreeResponse: (taskId) ->
    @renderStep(taskId)

  answerFreeResponse: (taskId) ->
    @renderStep(taskId)
      .then(actions.fillFreeResponse)

  submitFreeResponse: (taskId) ->
    @renderStep(taskId)
      .then(actions.fillFreeResponse)
      .then(actions.saveFreeResponse)

  answerMultipleChoice: (taskId) ->
    @renderStep(taskId)
      .then(actions.fillFreeResponse)
      .then(actions.saveFreeResponse)
      .then(actions.pickMultipleChoice)

  submitMultipleChoice: (taskId) ->
    @renderStep(taskId)
      .then(actions.fillFreeResponse)
      .then(actions.saveFreeResponse)
      .then(actions.pickMultipleChoice)
      .then(actions.saveMultipleChoice)

  workExerciseAndCheck: (args...) ->
    Promise.resolve(args...)
      .then(checks.checkIsDefaultStep)
      .then(actions.fillFreeResponse)
      .then(actions.clickContinue)
      .then(checks.checkAnswerFreeResponse)
      .then(actions.saveFreeResponse)
      .then(checks.checkSubmitFreeResponse)
      .then(actions.pickMultipleChoice)
      .then(checks.checkAnswerMultipleChoice)
      .then(actions.saveMultipleChoice)
      .then(checks.checkSubmitMultipleChoice)

  workExercise: (args...) ->
    Promise.resolve(args...)
      .then(actions.fillFreeResponse)
      .then(actions.saveFreeResponse)
      .then(actions.pickMultipleChoice)
      .then(actions.saveMultipleChoice)

  workTrueFalseAndCheck: (args...) ->
    Promise.resolve(args...)
      .then(actions.pickMultipleChoice)
      .then(checks.checkAnswerMultipleChoice)
      .then(actions.saveMultipleChoice)
      .then(checks.checkSubmitMultipleChoice)

module.exports =
  taskTests: tests
  taskActions: actions
  taskChecks: checks
