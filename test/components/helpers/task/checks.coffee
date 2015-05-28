{expect} = require 'chai'
{Promise} = require 'es6-promise'
_ = require 'underscore'
React = require 'react/addons'

{TaskStepActions, TaskStepStore} = require '../../../../src/flux/task-step'
{TaskActions, TaskStore} = require '../../../../src/flux/task'
{StepPanel} = require '../../../../src/helpers/policies'

Breadcrumb = require '../../../../src/components/task/breadcrumb'
Group = require '../../../../src/components/task-step/exercise/group'

checks =
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
    expect(step.free_response.length).to.not.equal(0)
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
    canReview = StepPanel.canReview(stepId)

    if canReview
      expect(div.querySelector('.answer-correct').innerText).to.equal(correct_answer.content_html)
      expect(div.querySelector('.answer-correct').innerHTML).to.not.equal(div.querySelector('.answer-checked').innerHTML)

      expect(div.querySelector('.question-feedback').childNodes[0].innerHTML).to.equal(feedback_html)
    else
      expect(div.querySelector('.answer-correct')).to.be.null

    {div, component, stepId, taskId, state, router, history, correct_answer, feedback_html}

  _checkNotFeedback: ({div, component, stepId, taskId, state, router, history}) ->
    expect(div.querySelector('.question-feedback')).to.be.null
    {div, component, stepId, taskId, state, router, history}

  _checkForFeedback: ({div, component, stepId, taskId, state, router, history, correct_answer, feedback_html}) ->
    expect(div.querySelector('.question-feedback').childNodes[0].innerHTML).to.equal(feedback_html)
    {div, component, stepId, taskId, state, router, history, correct_answer, feedback_html}

  _checkRecoveryRefreshChoice: ({div, component, stepId, taskId, state, router, history}) ->
    expect(div.querySelector('.footer-buttons').children.length).to.equal(3)
    classes = _.pluck(div.querySelector('.footer-buttons').children, 'className')
    expect(classes).to.deep.equal([
      '-try-another btn btn-primary', '-refresh-memory btn btn-primary', '-continue btn btn-primary'
    ])
    {div, component, stepId, taskId, state, router, history}

  _checkRecoveryContent: ({div, component, stepId, taskId, state, router, history}) ->
    expect(div.innerText).to.contain('recovery')
    expect(div.querySelector('.footer-buttons')).to.be.null
    expect(div.querySelector('.-continue')).to.not.be.null

    {div, component, stepId, taskId, state, router, history}

  _checkIsNextStep: ({div, component, stepId, taskId, state, router, history}) ->
    stepIndex = TaskStore.getCurrentStepIndex(taskId)
    steps = TaskStore.getStepsIds(taskId)
    targetStepId = steps[stepIndex - 1].id

    checks._checkIsTargetStepId(targetStepId, {div, component, stepId, taskId, state, router, history})

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

  _checkIsDefaultStep: ({div, component, stepId, taskId, state, router, history}) ->
    stepIndex = TaskStore.getCurrentStepIndex(taskId)
    steps = TaskStore.getStepsIds(taskId)

    return checks._checkIsIntroScreen({div, component, stepId, taskId, state, router, history}) if stepIndex is -1
    return checks._checkIsCompletePage({div, component, stepId, taskId, state, router, history}) if stepIndex is steps.length

    targetStepId = steps[stepIndex].id

    checks._checkIsTargetStepId(targetStepId, {div, component, stepId, taskId, state, router, history})
    {div, component, stepId, taskId, state, router, history}

  _checkIsPopoverOpen: ({div, component, stepId, taskId, state, router, history}) ->
    expect(document.querySelector('.task-details-popover h1')).to.not.be.null

    {div, component, stepId, taskId, state, router, history}

  _checkAreAllStepsShowing: ({div, component, stepId, taskId, state, router, history}) ->
    steps = TaskStore.getStepsIds(taskId)
    stepNodes = div.querySelectorAll('.task-breadcrumbs-step')

    expect(stepNodes.length).to.equal(steps.length + 1)

    {div, component, stepId, taskId, state, router, history}

  _checkEndReview: ({div, component, stepId, taskId, state, router, history}) ->
    completedStepsInReview = div.querySelectorAll('.task-review-completed .task-step')
    todoStepsInReview = div.querySelectorAll('.task-review-todo .task-step')

    completedSteps = TaskStore.getCompletedSteps(taskId)
    incompleteSteps = TaskStore.getIncompleteSteps(taskId)

    expect(completedStepsInReview.length).to.equal(completedSteps.length)
    expect(todoStepsInReview.length).to.equal(incompleteSteps.length)

    {div, component, stepId, taskId, state, router, history}

  _checkHasAllBreadcrumbs: ({div, component, stepId, taskId, state, router, history}) ->
    breadcrumbs = React.addons.TestUtils.scryRenderedComponentsWithType(component, Breadcrumb)
    steps = TaskStore.getStepsIds(taskId)

    expect(breadcrumbs.length).to.equal(steps.length + 1)

    {div, component, stepId, taskId, state, router, history}

  _checkHasReviewableBreadcrumbs: ({div, component, stepId, taskId, state, router, history}) ->
    breadcrumbs = React.addons.TestUtils.scryRenderedComponentsWithType(component, Breadcrumb)
    completedSteps = TaskStore.getCompletedSteps(taskId)
    {type} = TaskStore.get(taskId)

    expectedCrumbs = completedSteps.length + 1

    if type is 'reading'
      nonCoreIndex = TaskStore.getFirstNonCoreIndex(taskId)
      if nonCoreIndex > -1 and completedSteps.length >= nonCoreIndex
        expectedCrumbs = expectedCrumbs + 1

    expect(breadcrumbs.length).to.equal(expectedCrumbs)

    {div, component, stepId, taskId, state, router, history}

  _checkHasExpectedGroupLabel: ({div, component, stepId, taskId, state, router, history}) ->
    group = React.addons.TestUtils.findRenderedComponentWithType(component, Group)
    step = TaskStepStore.get(stepId)

    if step.group is 'personalized'
      expect(group.getDOMNode().innerText).to.contain('Personalized')
    # TODO deprecate spaced practice when BE is updated
    else if step.group is 'spaced_practice' or step.group is 'spaced practice'
      expect(group.getDOMNode().innerText).to.contain('Review')

    {div, component, stepId, taskId, state, router, history}

  _checkIsSpacerPanel: ({div, component, stepId, taskId, state, router, history}) ->
    expect(div.querySelector('.spacer-step')).to.not.be.null

    {div, component, stepId, taskId, state, router, history}

# promisify for chainability in specs
_.each(checks, (check, checkName) ->
  # rename without _ in front
  promiseName = checkName.slice(1)

  checks[promiseName] = (args...) ->
    Promise.resolve(check(args...))
)

# These guys messed up the groove, maybe will change the way these work later
checks._checkIsMatchStep = (stepIndex, {div, component, stepId, taskId, state, router, history}) ->
  steps = TaskStore.getStepsIds(taskId)
  targetStepId = steps[stepIndex].id
  checks._checkIsTargetStepId(targetStepId, {div, component, stepId, taskId, state, router, history})

  {div, component, stepId, taskId, state, router, history}

checks.checkIsMatchStep = (matchStepIndex) ->
  (args...) ->
    Promise.resolve(checks._checkIsMatchStep(matchStepIndex, args...))

checks._checkIsPendingStep = (stepIndex, {div, component, stepId, taskId, state, router, history}) ->
  breadcrumbs = React.addons.TestUtils.scryRenderedComponentsWithType(component, Breadcrumb)
  placeholderBreadcrumb = breadcrumbs[stepIndex]

  placeholderBreadcrumbDOM = placeholderBreadcrumb.getDOMNode()

  expect(placeholderBreadcrumbDOM.className).to.contain('placeholder')
  expect(div.querySelector('.placeholder-step')).to.not.be.null

  {div, component, stepId, taskId, state, router, history}

checks.checkIsPendingStep = (matchStepIndex) ->
  (args...) ->
    Promise.resolve(checks._checkIsPendingStep(matchStepIndex, args...))


checks._checkIsNotPendingStep = (stepIndex, args...) ->
  {component} = args[0]
  breadcrumbs = React.addons.TestUtils.scryRenderedComponentsWithType(component, Breadcrumb)
  breadcrumbs = React.addons.TestUtils.scryRenderedComponentsWithType(component, Breadcrumb)
  placeholderBreadcrumb = breadcrumbs[stepIndex]

  placeholderBreadcrumbDOM = placeholderBreadcrumb.getDOMNode()

  expect(placeholderBreadcrumbDOM.className).to.not.contain('placeholder')
  checks._checkIsMatchStep(stepIndex, args[0])

checks.checkIsNotPendingStep = (matchStepIndex) ->
  (args...) ->
    Promise.resolve(checks._checkIsNotPendingStep(matchStepIndex, args...))

checks._logStuff = (logMessage, args...) ->
  {div, stepId, taskId, router} = args[0]
  step = TaskStepStore.get(stepId)

  console.info(logMessage)
  console.info(router.getCurrentPath())
  console.info(router.getCurrentParams())
  console.info(step)
  console.info(div)

  args[0]

checks.logStuff = (logMessage) ->
  (args...) ->
    Promise.resolve(checks._logStuff(logMessage, args...))

module.exports = checks
