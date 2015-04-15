_ = require 'underscore'

React = require 'react/addons'
{Promise} = require 'es6-promise'

{TaskStepActions, TaskStepStore} = require '../../../../src/flux/task-step'
{TaskActions, TaskStore} = require '../../../../src/flux/task'

{routerStub, commonActions} = require '../utilities'

actions =
  forceUpdate: (args...) ->
    {component, div} = args[0]
    routerStub.forceUpdate(component, args...)

  clickContinue: commonActions.clickMatch('.-continue')

  # Tricky, popovers use focus trigger for dismissable option
  # http://getbootstrap.com/javascript/#dismiss-on-next-click
  clickDetails: commonActions.focusMatch('.task-details')

  _clickBreadcrumb: (breadcrumbButtonIndex, {div, component, stepId, taskId, state, router, history}) ->
    completedBreadcrumbs = div.querySelectorAll('button.step.completed')
    completedBreadcrumbs = Array.prototype.slice.call(completedBreadcrumbs)

    commonActions.click(completedBreadcrumbs[breadcrumbButtonIndex])
    steps = TaskStore.getStepsIds(taskId)
    # change step
    stepId = steps[breadcrumbButtonIndex].id

    {div, component, stepId, taskId, state, router, history}

  clickBreadcrumb: (breadcrumbButtonIndex)->
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
    feedback_html = 'Fake Feedback'
    commonActions.clickButton(div, '.-continue')

    step.correct_answer_id ?= correct_answer.id
    step.feedback_html = feedback_html
    TaskStepActions.loaded(step, stepId, taskId)

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

  _getActionsForStepCompletion: (step) ->
    actionsToNext =
      reading: ['clickContinue']
      interactive: ['clickContinue']
      video: ['clickContinue']
      freeResponse: ['fillFreeResponse', 'saveFreeResponse']
      multipleChoice: ['pickMultipleChoice', 'saveMultipleChoice']
      review: ['clickContinue']

    stepPanels = TaskStepStore.getPanels(step.id)
    actionsToPlay = _.chain(stepPanels).map((panel) ->
      _.clone(actionsToNext[panel])
    ).flatten().value()

    actionsToPlay

  _getActionsForTaskCompletion: (taskId) ->
    incompleteSteps = TaskStore.getIncompleteSteps(taskId)
    allSteps = TaskStore.getSteps(taskId)

    actionsToPlay = _.chain(incompleteSteps).map((step, index) ->
      actionsForStep = actions._getActionsForStepCompletion(step)
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

    actionsFns = _.map(actionsToPlay, (action) ->
      actions[action]
    )

    # perform appropriate step actions for each incomplete step
    # by chaining each promised step action
    # Forces promises to execute in order.  The actions are order dependent
    # so Promises.all will not work in this case.
    actionsFns.reduce((current, next) ->
      current.then(next)
    , Promise.resolve(args...))

module.exports = actions
