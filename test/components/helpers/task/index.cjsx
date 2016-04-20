# coffeelint: disable=no_empty_functions

React = require 'react'
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
    componentStub._render(div,
      <TaskStep id={stepId} taskId={taskId} goToStep={goToStep} onNextStep={onNextStep}/>,
      {stepId, taskId})

  renderStep: (taskId) ->
    {id} = TaskStore.getCurrentStep(taskId)

    # TODO Do something for these handlers
    onNextStep = ->
    goToStep = (num) ->

    @_renderTaskStep(id, taskId, onNextStep, goToStep)

  goToTask: (route, taskId) ->
    div = @container
    {id} = TaskStore.getCurrentStep(taskId)
    routerStub._goTo(div, route, {stepId: id, taskId})

  # convenience methods
  renderFreeResponse: (taskId) ->
    @renderStep(taskId)

  answerFreeResponse: (args...) ->
    steps = [
      actions.fillFreeResponse
    ]
    commonActions.playThroughFunctions(steps)(args...)

  submitFreeResponse: (args...) ->
    steps = [
      actions.fillFreeResponse
      actions.saveFreeResponse
    ]
    commonActions.playThroughFunctions(steps)(args...)

  answerMultipleChoice: (args...) ->
    steps = [
      actions.fillFreeResponse
      actions.saveFreeResponse
      actions.pickMultipleChoice
    ]
    commonActions.playThroughFunctions(steps)(args...)

  submitMultipleChoice: (args...) ->
    steps = [
      actions.fillFreeResponse
      actions.saveFreeResponse
      actions.pickMultipleChoice
      actions.saveMultipleChoice
    ]
    commonActions.playThroughFunctions(steps)(args...)

  workExerciseAndCheck: (args...) ->
    steps = [
      checks.checkIsDefaultStep
      actions.fillFreeResponse
      actions.clickContinue
      checks.checkAnswerFreeResponse
      actions.saveFreeResponse
      checks.checkSubmitFreeResponse
      actions.pickMultipleChoice
      checks.checkAnswerMultipleChoice
      actions.saveMultipleChoice
      checks.checkSubmitMultipleChoice
    ]
    commonActions.playThroughFunctions(steps)(args...)

  workExercise: (args...) ->
    steps = [
      actions.fillFreeResponse
      actions.saveFreeResponse
      actions.pickMultipleChoice
      actions.saveMultipleChoice
    ]
    commonActions.playThroughFunctions(steps)(args...)

  workTrueFalseAndCheck: (args...) ->
    steps = [
      actions.pickMultipleChoice
      checks.checkAnswerMultipleChoice
      actions.saveMultipleChoice
      checks.checkSubmitMultipleChoice
    ]
    commonActions.playThroughFunctions(steps)(args...)

module.exports =
  taskTests: tests
  taskActions: actions
  taskChecks: checks
