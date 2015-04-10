_ = require 'underscore'

React = require 'react/addons'
{Promise} = require 'es6-promise'

{TaskStepActions, TaskStepStore} = require '../../../src/flux/task-step'
{TaskActions, TaskStore} = require '../../../src/flux/task'
TaskStep = require '../../../src/components/task-step'

{routerStub, componentStub} = require './utilites'
taskChecks = require './task-checks'

taskTestActions =
  clickButton: (node, selector) ->
    selector ?= 'button.btn-primary'

    button = node.querySelector(selector)
    @click(button)
    button = node.querySelector(selector)


  click: (clickElementNode) ->
    React.addons.TestUtils.Simulate.click(clickElementNode)

  _clickContinue: (args...) ->
    {div} = args[0]
    taskTestActions.clickButton(div, '.-continue')
    args[0]

  forceUpdate: (args...) ->
    {component, div} = args[0]
    routerStub.forceUpdate(component, args...)

  clickContinue: (args...)->
    Promise.resolve(taskTestActions._clickContinue(args...))

  _clickBreadcrumb: (breadcrumbButtonIndex, {div, component, stepId, taskId, state, router, history}) ->
    completedBreadcrumbs = div.querySelectorAll('button.step.completed')
    completedBreadcrumbs = Array.prototype.slice.call(completedBreadcrumbs)

    taskTestActions.click(completedBreadcrumbs[breadcrumbButtonIndex])
    steps = TaskStore.getStepsIds(taskId)
    # change step
    stepId = steps[breadcrumbButtonIndex].id

    {div, component, stepId, taskId, state, router, history}

  clickBreadcrumb: (breadcrumbButtonIndex)->
    (args...) ->
      Promise.resolve(taskTestActions._clickBreadcrumb(breadcrumbButtonIndex, args...))

  _fillFreeResponse: ({div, component, stepId, taskId, state, router, history, response}) ->
    response ?= 'Test Response'

    textarea = div.querySelector('textarea')
    textarea.value = response
    React.addons.TestUtils.Simulate.focus(textarea)
    React.addons.TestUtils.Simulate.keyDown(textarea, {key: 'Enter'})
    React.addons.TestUtils.Simulate.change(textarea)

    {div, component, stepId, taskId, state, router, history, textarea}

  fillFreeResponse: (args...)->
    Promise.resolve(taskTestActions._fillFreeResponse(args...))

  saveFreeResponse: ({div, component, stepId, taskId, state, router, history, textarea}) ->
    taskTestActions.clickButton(div, '.-continue')
    TaskStepActions.saved(stepId, {free_response : textarea.value})

    taskTestActions.forceUpdate({div, component, stepId, taskId, state, router, history})

  pickMultipleChoice: ({div, component, stepId, taskId, state, router, history}) ->
    step = TaskStepStore.get(stepId)
    answer = step.content.questions[0].answers[0]
    answerElement = div.querySelector('.answer-input-box')

    React.addons.TestUtils.Simulate.change(answerElement, answer)
    TaskStepActions.saved(stepId, {answer_id : answer.id})

    taskTestActions.forceUpdate({div, component, stepId, taskId, state, router, history, answer})

  saveMultipleChoice: ({div, component, stepId, taskId, state, router, history}) ->
    step = TaskStepStore.get(stepId)
    correct_answer = step.content.questions[0].answers[1]
    feedback_html = 'Fake Feedback'

    taskTestActions.clickButton(div, '.-continue')

    step.correct_answer_id ?= correct_answer.id
    step.feedback_html = feedback_html
    TaskStepActions.loaded(step, stepId, taskId)

    taskTestActions.forceUpdate({div, component, stepId, taskId, state, router, history, correct_answer, feedback_html})

  updateStep: (newStepId, {div, component, stepId, taskId, state, router, history}) ->
    taskTestActions.forceUpdate({div, component, stepId: newStepId, taskId, state, router, history})

  _advanceStep: ({div, component, stepId, taskId, state, router, history}) ->
    stepIndex = TaskStore.getCurrentStepIndex(taskId)
    steps = TaskStore.getStepsIds(taskId)

    # advance step
    stepId = steps[stepIndex].id
    taskTestActions.updateStep(stepId, {div, component, stepId, taskId, state, router, history})

  advanceStep: (args...) ->
    Promise.resolve(taskTestActions._advanceStep(args...))

  _getActionsForStepCompletion: (step) ->
    actionsToNext =
      reading: ['clickContinue']
      interactive: ['clickContinue']
      video: ['clickContinue']
      freeResponse: ['fillFreeResponse', 'saveFreeResponse']
      multipleChoice: ['pickMultipleChoice', 'saveMultipleChoice']
      review: ['clickContinue']

    stepPanels = TaskStepStore.getPanels(step.id)
    actions = _.chain(stepPanels).map((panel) ->
      _.clone(actionsToNext[panel])
    ).flatten().value()

    actions

  _getActionsForTaskCompletion: (taskId) ->
    incompleteSteps = TaskStore.getIncompleteSteps(taskId)
    allSteps = TaskStore.getSteps(taskId)

    actions = _.chain(incompleteSteps).map((step, index) ->
      actionsForStep = taskTestActions._getActionsForStepCompletion(step)
      if index < incompleteSteps.length - 1
        actionsForStep.push('advanceStep')
      actionsForStep
    ).flatten().value()

    # a cricket for good luck
    actions.push('forceUpdate')
    actions

  completeSteps: (args...) ->
    {taskId} = args[0]
    actions = taskTestActions._getActionsForTaskCompletion(taskId)

    actionsFns = _.map(actions, (action) ->
      taskTestActions[action]
    )

    # perform appropriate step actions for each incomplete step
    # by chaining each promised step action
    # Forces promises to execute in order.  The actions are order dependent
    # so Promises.all will not work in this case.
    actionsFns.reduce((current, next) ->
      current.then(next)
    , Promise.resolve(args...))


taskTests =

  delay: 200

  container: document.createElement('div')

  unmount: ->
    React.unmountComponentAtNode(@container)
    @container = document.createElement('div')

  _renderTaskStep: (stepId, taskId, onNextStep) ->
    div = @container
    componentStub._render(div, <TaskStep id={stepId} onNextStep={onNextStep}/>, {stepId, taskId})

  renderStep: (taskId) ->
    {id} = TaskStore.getCurrentStep(taskId)
    taskTests = @

    onNextStep = ->
      # TODO Do something for next step.

    @_renderTaskStep(id, taskId, onNextStep)

  goToTask: (route, taskId) ->
    div = @container
    {id} = TaskStore.getCurrentStep(taskId)
    routerStub._goTo(div, route, {stepId: id, taskId})

  # convenience methods
  renderFreeResponse: (taskId) ->
    @renderStep(taskId)

  answerFreeResponse: (taskId) ->
    @renderStep(taskId)
      .then(taskTestActions.fillFreeResponse)

  submitFreeResponse: (taskId) ->
    @renderStep(taskId)
      .then(taskTestActions.fillFreeResponse)
      .then(taskTestActions.saveFreeResponse)

  answerMultipleChoice: (taskId) ->
    @renderStep(taskId)
      .then(taskTestActions.fillFreeResponse)
      .then(taskTestActions.saveFreeResponse)
      .then(taskTestActions.pickMultipleChoice)

  submitMultipleChoice: (taskId) ->
    @renderStep(taskId)
      .then(taskTestActions.fillFreeResponse)
      .then(taskTestActions.saveFreeResponse)
      .then(taskTestActions.pickMultipleChoice)
      .then(taskTestActions.saveMultipleChoice)

  workExerciseAndCheck: (args...) ->
    Promise.resolve(args...)
      .then(taskChecks.checkIsDefaultStep)
      .then(taskTestActions.fillFreeResponse)
      .then(taskTestActions.clickContinue)
      .then(taskChecks.checkAnswerFreeResponse)
      .then(taskTestActions.saveFreeResponse)
      .then(taskChecks.checkSubmitFreeResponse)
      .then(taskTestActions.pickMultipleChoice)
      .then(taskChecks.checkAnswerMultipleChoice)
      .then(taskTestActions.saveMultipleChoice)
      .then(taskChecks.checkSubmitMultipleChoice)

  workExercise: (args...) ->
    Promise.resolve(args...)
      .then(taskTestActions.fillFreeResponse)
      .then(taskTestActions.saveFreeResponse)
      .then(taskTestActions.pickMultipleChoice)
      .then(taskTestActions.saveMultipleChoice)

  workTrueFalseAndCheck: (args...) ->
    Promise.resolve(args...)
      .then(taskTestActions.pickMultipleChoice)
      .then(taskChecks.checkAnswerMultipleChoice)
      .then(taskTestActions.saveMultipleChoice)
      .then(taskChecks.checkSubmitMultipleChoice)

module.exports = {routerStub, taskTestActions, taskTests, taskChecks}
