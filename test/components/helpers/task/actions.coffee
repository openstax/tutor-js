_ = require 'underscore'

React = require 'react'
ReactTestUtils = require 'react-addons-test-utils'
{Promise} = require 'es6-promise'

{TaskStepActions, TaskStepStore} = require '../../../../src/flux/task-step'
{TaskActions, TaskStore} = require '../../../../src/flux/task'
{StepPanel} = require '../../../../src/helpers/policies'

TaskStep = require '../../../../src/components/task-step'
{BreadcrumbTaskDynamic} = require '../../../../src/components/breadcrumb'
{Exercise} = require 'openstax-react-components'

{routerStub, commonActions} = require '../utilities'

actions =
  forceUpdate: (args...) ->
    {component, div} = args[0]
    taskStep = ReactTestUtils.scryRenderedComponentsWithType(component, TaskStep)
    breadcrumbs = ReactTestUtils.scryRenderedComponentsWithType(component, BreadcrumbTaskDynamic)

    if breadcrumbs.length is 1
      routerStub.forceUpdate(breadcrumbs[0], args...)

    if taskStep.length is 1
      routerStub.forceUpdate(taskStep[0], args...)
    else
      routerStub.forceUpdate(component, args...)

  clickContinue: commonActions.clickMatch('.continue')
  clickTryAnother: commonActions.clickMatch('.-try-another')

  # Tricky, popovers use focus trigger for dismissable option
  # http://getbootstrap.com/javascript/#dismiss-on-next-click
  triggerDetails: commonActions.hoverMatch('.task-details .task-details-instructions')

  _clickBreadcrumb: (breadcrumbButtonIndex, {div, component, stepId, taskId, history}) ->
    breadcrumbs = div.querySelectorAll('.openstax-breadcrumbs-step')
    breadcrumbs = Array.prototype.slice.call(breadcrumbs)

    commonActions.click(breadcrumbs[breadcrumbButtonIndex])
    steps = TaskStore.getStepsIds(taskId)

    unless breadcrumbButtonIndex is steps.length
      # change step
      stepId = steps[breadcrumbButtonIndex].id

    {div, component, stepId, taskId, history}

  clickBreadcrumb: (breadcrumbButtonIndex) ->
    (args...) ->
      Promise.resolve(actions._clickBreadcrumb(breadcrumbButtonIndex, args...))

  fillFreeResponse: commonActions.fillTextarea('textarea', 'Test Response')

  saveFreeResponse: ({div, component, stepId, taskId, history, textarea}) ->
    commonActions.clickButton(div, '.continue')
    result = TaskStepStore.get(stepId)
    result.free_response = textarea.value
    TaskStepActions.saved(result, stepId)

    actions.forceUpdate({div, component, stepId, taskId, history})

  pickMultipleChoice: ({div, component, stepId, taskId, history}) ->
    step = TaskStepStore.get(stepId)
    answer = step.content.questions[0].answers[0]
    answerElement = div.querySelector('.answer-input-box')

    ReactTestUtils.Simulate.change(answerElement, answer)
    step.answer_id = answer.id
    TaskStepActions.saved(step, stepId)

    actions.forceUpdate({div, component, stepId, taskId, history, answer})

  saveMultipleChoice: ({div, component, stepId, taskId, history}) ->
    step = TaskStepStore.get(stepId)
    correct_answer = step.content.questions[0].answers[1]
    commonActions.clickButton(div, '.continue')
    canReview = StepPanel.canReview(stepId)
    feedback_html = ''

    if canReview
      step.correct_answer_id ?= correct_answer.id
      feedback_html = 'Fake Feedback'
      step.feedback_html = feedback_html

    step.is_completed = true
    TaskStepActions.completed(step, stepId)

    actions.forceUpdate({div, component, stepId, taskId, history, correct_answer, feedback_html})

  updateStep: (newStepId, {div, component, stepId, taskId, history}) ->
    actions.forceUpdate({div, component, stepId: newStepId, taskId, history})

  _advanceStep: ({div, component, stepId, taskId, history}) ->
    stepIndex = TaskStore.getCurrentStepIndex(taskId)
    steps = TaskStore.getStepsIds(taskId)

    # advance step
    stepId = steps[stepIndex].id
    actions.updateStep(stepId, {div, component, stepId, taskId, history})

  advanceStep: (args...) ->
    Promise.resolve(actions._advanceStep(args...))

  _playThroughActions: (actionsToPlay) ->
    (args...) ->
      actionsFns = _.map(actionsToPlay, (action) ->
        actions[action]
      )

      commonActions.playThroughFunctions(actionsFns)(args...)

  _loadStep: (stepId, stepData, args...) ->
    {taskId} = args[0]
    TaskStepActions.loaded(stepData, stepId, taskId)
    args[0]

  loadStep: (stepId, stepData) ->
    (args...) ->
      Promise.resolve(actions._loadStep(stepId, stepData, args...))

  _loadRecovery: (stepId, stepData, args...) ->
    TaskStepActions.loadedRecovery(stepData, stepId)
    args[0]

  loadRecovery: (stepId, stepData) ->
    (args...) ->
      Promise.resolve(actions._loadRecovery(stepId, stepData, args...))

  _loadTask: (taskData, args...) ->
    {taskId} = args[0]
    TaskActions.loaded(taskData, taskId)
    args[0]

  loadTask: (taskData) ->
    (args...) ->
      Promise.resolve(actions._loadTask(taskData, args...))

  forceRecovery: (args...) ->
    {component} = args[0]
    exerciseReview = ReactTestUtils.findRenderedComponentWithType(component, Exercise)
    exerciseReview.props.onNextStep()

    actions.forceUpdate(args[0])

  completeThisStep: (args...) ->
    {stepId} = args[0]
    actionsForStep = StepPanel.getRemainingActions(stepId)
    actions._playThroughActions(actionsForStep)(args...)

  _getActionsForTaskCompletion: (taskId) ->
    incompleteSteps = TaskStore.getIncompleteSteps(taskId)
    allSteps = TaskStore.getSteps(taskId)

    actionsToPlay = _.chain(incompleteSteps).map((step, index) ->
      actionsForStep = StepPanel.getRemainingActions(step.id)
      if index < incompleteSteps.length - 1
        actionsForStep.push('advanceStep')
      actionsForStep
    ).flatten().value()

    # a cricket for good luck
    actionsToPlay.push('forceUpdate')
    actionsToPlay

  completeSteps: (args...) ->
    {taskId} = args[0]
    actionsToPlay = actions._getActionsForTaskCompletion(taskId)

    actions._playThroughActions(actionsToPlay)(args...)


module.exports = actions
