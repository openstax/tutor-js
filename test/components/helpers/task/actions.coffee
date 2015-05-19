_ = require 'underscore'

React = require 'react/addons'
{Promise} = require 'es6-promise'

{TaskStepActions, TaskStepStore} = require '../../../../src/flux/task-step'
{TaskActions, TaskStore} = require '../../../../src/flux/task'
{StepPanel} = require '../../../../src/helpers/policies'

TaskStep = require '../../../../src/components/task-step'
Breadcrumbs = require '../../../../src/components/task/breadcrumbs'
{ExerciseReview} = require '../../../../src/components/task-step/exercise/modes'

{routerStub, commonActions} = require '../utilities'

actions =
  forceUpdate: (args...) ->
    {component, div} = args[0]
    taskStep = React.addons.TestUtils.scryRenderedComponentsWithType(component, TaskStep)
    breadcrumbs = React.addons.TestUtils.scryRenderedComponentsWithType(component, Breadcrumbs)

    if breadcrumbs.length is 1
      routerStub.forceUpdate(breadcrumbs[0], args...)

    if taskStep.length is 1
      routerStub.forceUpdate(taskStep[0], args...)
    else
      routerStub.forceUpdate(component, args...)

  clickContinue: commonActions.clickMatch('.-continue')
  clickTryAnother: commonActions.clickMatch('.-try-another')

  # Tricky, popovers use focus trigger for dismissable option
  # http://getbootstrap.com/javascript/#dismiss-on-next-click
  clickDetails: commonActions.focusMatch('.task-details')

  _clickBreadcrumb: (breadcrumbButtonIndex, {div, component, stepId, taskId, state, router, history}) ->
    breadcrumbs = div.querySelectorAll('.step')
    breadcrumbs = Array.prototype.slice.call(breadcrumbs)

    commonActions.click(breadcrumbs[breadcrumbButtonIndex])
    steps = TaskStore.getStepsIds(taskId)

    unless breadcrumbButtonIndex is steps.length
      # change step
      stepId = steps[breadcrumbButtonIndex].id

    {div, component, stepId, taskId, state, router, history}

  clickBreadcrumb: (breadcrumbButtonIndex) ->
    (args...) ->
      Promise.resolve(actions._clickBreadcrumb(breadcrumbButtonIndex, args...))

  fillFreeResponse: commonActions.fillTextarea('textarea', 'Test Response')

  saveFreeResponse: ({div, component, stepId, taskId, state, router, history, textarea}) ->
    commonActions.clickButton(div, '.-continue')
    TaskStepActions.saved(stepId, {free_response : textarea.value})

    actions.forceUpdate({div, component, stepId, taskId, state, router, history})

  pickMultipleChoice: ({div, component, stepId, taskId, state, router, history}) ->
    step = TaskStepStore.get(stepId)
    answer = step.content.questions[0].answers[0]
    answerElement = div.querySelector('.answer-input-box')

    React.addons.TestUtils.Simulate.change(answerElement, answer)
    TaskStepActions.saved(stepId, {answer_id : answer.id})

    actions.forceUpdate({div, component, stepId, taskId, state, router, history, answer})

  saveMultipleChoice: ({div, component, stepId, taskId, state, router, history}) ->
    step = TaskStepStore.get(stepId)
    correct_answer = step.content.questions[0].answers[1]
    commonActions.clickButton(div, '.-continue')
    canReview = StepPanel.canReview(stepId)
    feedback_html = ''

    if canReview
      step.correct_answer_id ?= correct_answer.id
      feedback_html = 'Fake Feedback'
      step.feedback_html = feedback_html

    step.is_completed = true
    TaskStepActions.completed(step, stepId)

    actions.forceUpdate({div, component, stepId, taskId, state, router, history, correct_answer, feedback_html})

  updateStep: (newStepId, {div, component, stepId, taskId, state, router, history}) ->
    actions.forceUpdate({div, component, stepId: newStepId, taskId, state, router, history})

  _advanceStep: ({div, component, stepId, taskId, state, router, history}) ->
    stepIndex = TaskStore.getCurrentStepIndex(taskId)
    steps = TaskStore.getStepsIds(taskId)

    # advance step
    stepId = steps[stepIndex].id
    actions.updateStep(stepId, {div, component, stepId, taskId, state, router, history})

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
    exerciseReview = React.addons.TestUtils.findRenderedComponentWithType(component, ExerciseReview)
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
