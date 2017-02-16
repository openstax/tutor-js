React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'

_ = require 'underscore'
classnames = require 'classnames'

{TaskActions, TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskPanelActions, TaskPanelStore} = require '../../flux/task-panel'
{TaskProgressActions, TaskProgressStore} = require '../../flux/task-progress'
{CourseStore} = require '../../flux/course'

StepFooterMixin = require '../task-step/step-footer-mixin'
Router = require '../../helpers/router'
TaskStep = require '../task-step'
Ends = require '../task-step/ends'
Breadcrumbs = require './breadcrumbs'

TaskProgress = require './progress'
ProgressPanel = require './progress/panel'
{Milestones, Milestone} = require './progress/milestones'
TeacherReviewControls = require './teacher-review-controls'

{StepPanel} = require '../../helpers/policies'

{UnsavedStateMixin} = require '../unsaved-state'
LoadableItem = require '../loadable-item'

{PinnedHeaderFooterCard, PinnedHeader, ScrollToMixin, ExerciseIntro} = require 'shared'

Task = React.createClass

  displayName: 'Task'

  propTypes:
    id: React.PropTypes.string

  # Book and Project context is used by the exercise identifier link which
  # deeply nested and impractical to pass through the tree.
  childContextTypes:
    bookUUID:  React.PropTypes.string
    oxProject: React.PropTypes.string

  getChildContext: ->
    {courseId} = Router.currentParams()
    bookUUID: CourseStore.getBookUUID(courseId)
    oxProject: 'tutor'

  contextTypes:
    router: React.PropTypes.object

  mixins: [StepFooterMixin, UnsavedStateMixin, ScrollToMixin]

  scrollingTargetDOM: -> window.document

  getDefaultCurrentStep: ->
    TaskPanelStore.getStepKey(@props.id, {is_completed: false})

  setStepKey: ->
    params = Router.currentParams()

    # url is 1 based so it matches the breadcrumb button numbers
    defaultKey = @getDefaultCurrentStep()
    stepKey = if params.stepIndex then parseInt(params.stepIndex) else defaultKey
    stepIndex = stepKey - 1

    step = TaskPanelStore.getStep(@props.id, stepIndex)
    TaskProgressActions.update(@props.id, stepIndex)

    # go ahead and render this step only if this step is accessible
    if step?
      @setState(currentStep: stepIndex)
    # otherwise, redirect to the latest accessible step
    else
      @goToStep(defaultKey, true)

  getInitialState: ->
    {
      currentStep: 0
      refreshFrom: false
      refreshTo: false
      recoverForStepId: false
      recoveredStepId: false
      milestonesEntered: false
    }

  hasUnsavedState: -> TaskStore.hasAnyStepChanged(@props.id)
  unsavedStateMessages: -> 'The assignment has unsaved changes'

  componentWillMount: ->
    @updateSteps()
    @setStepKey()
    TaskStepStore.on('step.recovered', @prepareToRecover)
    TaskStepStore.on('step.completed', @updateSteps)
    TaskStore.on('loaded', @updateTask)

  componentWillUnmount: ->
    TaskStepStore.off('step.recovered', @prepareToRecover)
    TaskStepStore.off('step.completed', @updateSteps)
    TaskStore.off('loaded', @updateTask)

  componentWillReceiveProps: ->
    @setStepKey()

  updateSteps: ->
    TaskPanelActions.sync(@props.id)

  updateTask: (id) ->
    @updateSteps() if id is @props.id

  _stepRecoveryQueued: (nextState) ->
    not @state.recoverForStepId and nextState.recoverForStepId

  _stepRecovered: (nextState) ->
    not @state.recoveredStepId and nextState.recoveredStepId

  _taskRecoveredStep: (nextState) ->
    @state.recoveredStepId and not nextState.recoveredStepId

  _leavingRefreshingStep: (nextState) ->
    @state.refreshTo and not (nextState.currentStep is @state.refreshTo)

  _isSameStep: (nextProps, nextState) ->
    return false unless nextProps.id is @props.id
    step = @getStep(@state.currentStep)
    nextStep = @getStep(nextState.currentStep)
    return false if _.isEmpty(step) or _.isEmpty(nextStep)
    TaskStore.isSameStep(@props.id, step.id, nextStep.id)

  # After a step is recovered, the task needs to load itself in order to store the new step
  # at the proper index.  prepareToRecover handles this.
  #
  # prepareToRecover will
  #   emit task.beforeRecovery to stop breadcrumbs from showing the outdated future crumbs
  #   begin listening for when the recovered step has been loaded into the task
  #   and set the recoveredStepId for later use
  #
  # Setting the recoveredStepId will trigger the task to load itself in shouldComponentUpdate
  prepareToRecover: (recoveredStep) ->
    {id} = recoveredStep
    TaskStore.emit('task.beforeRecovery', id)
    TaskStepStore.on('step.loaded', @recoverStep)
    @setState(recoveredStepId: id)

  shouldComponentUpdate: (nextProps, nextState) ->
    {id} = @props

    # if a step needs to be recovered, load a recovery step for it
    if @_stepRecoveryQueued(nextState)
      return false

    # if the recoveredStepId is being set, load the task again
    # so that it will load the recoveredStep as one of it's steps
    if @_stepRecovered(nextState)
      TaskActions.load(id)
      return false

    # if the recoveredStepId is being unset, then the step has been loaded into the task.
    #   if we are not refreshing our memory, go to this recovered step, which is the next step.
    #   Emit afterRecovery so that the breadcrumbs update with the new recovered step as the next crumb
    if @_taskRecoveredStep(nextState)
      @onNextStep() unless @state.refreshTo
      TaskStore.emit('task.afterRecovery', id)
      return false

    # if we are trying to leave the refresh step,
    #   redirect to the step after the step we triggered refresh from.
    if @_leavingRefreshingStep(nextState)
      @continueAfterRefreshStep()
      return false

    if @state.currentStep isnt nextState.currentStep and @_isSameStep(nextProps, nextState)
      return false

    # if we reach this point, assume that we should go ahead and do a normal component update
    true

  # on refresh clicked and refresh step loaded, go to the refreshing step
  # also, ask the step to be recovered.  this will trigger loadRecovery to be called within shouldComponentUpdate
  refreshStep: (refreshTo, stepId) ->
    @setState({refreshFrom: @state.currentStep, refreshTo: refreshTo, recoverForStepId: stepId})
    @goToStep(refreshTo)

  # on leaving refresh step, go to the step after the step that triggered the refresh and clear related states.
  # the step after should be the recovered step!
  continueAfterRefreshStep: ->
    @goToStep(@state.refreshFrom + 1)
    @setState({refreshFrom: false, refreshTo: false, recoverForStepId: false})

  # set what step needs to be recovered.  this will trigger loadRecovery.
  recoverFor: (stepId) ->
    @setState({recoverForStepId: stepId})
    TaskStepActions.loadRecovery(stepId)

  # if the step loaded is the recovered step, unset the recoveredStepId and stop listening for steps loaded
  # when the recoveredStepId is unset, then shouldComponentUpdate will see that the step has been loaded.
  recoverStep: (loadedStepId) ->
    if loadedStepId is @state.recoveredStepId
      @setState({recoveredStepId: false})
      TaskStepStore.off('step.loaded', @recoverStep)

  areKeysSame: (key, keyToCompare) ->
    key is keyToCompare or parseInt(key) is parseInt(keyToCompare)

  goToStep: (stepKey, silent = false) ->
    {id} = @props
    stepKey = parseInt(stepKey)
    params = _.clone(Router.currentParams())
    return false if @areKeysSame(@state.currentStep, stepKey)
    # url is 1 based so it matches the breadcrumb button numbers
    params.stepIndex = stepKey + 1
    params.id = id # if we were rendered directly, the router might not have the id

    @scrollToTop() unless @_isSameStep({id}, {currentStep: stepKey})

    if silent
      @context.router.replaceWith(Router.makePathname('viewTaskStep', params))
    else
      @context.router.transitionTo(Router.makePathname('viewTaskStep', params))

    true

  toggleMilestonesEntered: ->
    @setState(milestonesEntered: not @state.milestonesEntered)

  closeMilestones: ->
    params = Router.currentParams()
    @context.router.transitionTo(
      Router.makePathname('viewTaskStep', params)
    )

  filterClickForMilestones: (focusEvent) ->
    stepPanel = ReactDOM.findDOMNode(@refs.stepPanel)
    not stepPanel?.contains(focusEvent.target)

  getStep: (stepIndex) ->
    TaskPanelStore.getStep(@props.id, stepIndex)

  shouldShowTeacherReviewControls: (panelType) ->
    {id} = @props

    panelType is 'teacher-read-only' and TaskStore.hasProgress(id)

  renderStep: (data) ->
    {courseId} = Router.currentParams()
    {id} = @props
    pinned = not TaskStore.hasProgress(id)

    <TaskStep
      id={data.id}
      taskId={@props.id}
      courseId={courseId}
      goToStep={@goToStep}
      onNextStep={@onNextStep}
      refreshStep={@refreshStep}
      recoverFor={@recoverFor}
      pinned={pinned}
      ref='stepPanel'
    />

  renderDefaultEndFooter: ->
    {id} = @props
    {courseId} = Router.currentParams()

    taskFooterParams =
      taskId: id
      courseId: courseId

    @renderEndFooter(taskFooterParams)

  renderEnd: (data) ->
    {id} = @props
    {courseId} = Router.currentParams()
    task = TaskStore.get(id)

    type = if task.type then task.type else 'task'
    End = Ends.get(type)

    footer = @renderDefaultEndFooter()

    panel = <End
      courseId={courseId}
      taskId={id}
      reloadPractice={@reloadTask}
      footer={footer}
      ref='stepPanel'/>

  renderStatics: (data) ->
    {courseId} = Router.currentParams()
    pinned = not TaskStore.hasProgress(@props.id)

    <ExerciseIntro
      project='tutor'
      pinned={pinned}
      stepIntroType={data.type}
      onNextStep={@onNextStep}
      onContinue={@onNextStep}
      taskId={@props.id}
      className={data.type}
      courseId={courseId}/>

  # add render methods for different panel types as needed here

  render: ->
    {id} = @props
    {milestonesEntered} = @state
    {courseId} = Router.currentParams()
    showMilestones = Router.currentParams().milestones?
    task = TaskStore.get(id)
    return null unless task?

    # get the crumb that matches the current state
    step = @getStep(@state.currentStep)
    panelType = StepPanel.getPanel(@state.currentStep)

    if step.id
      panel = @renderStep(step)
    else if step.type is 'end'
      panel = @renderEnd(step)
    else
      panel = @renderStatics(step)

    taskClasses = classnames 'task', "task-#{task.type}",
      "task-#{panelType}": panelType?
      'task-completed': TaskStore.isTaskCompleted(id)

    if TaskStore.hasCrumbs(id)
      breadcrumbs = <Breadcrumbs
        id={id}
        goToStep={@goToStep}
        key="task-#{id}-breadcrumbs"/>
      header = breadcrumbs

    if TaskStore.hasProgress(id)

      header = <TaskProgress taskId={id} stepIndex={@state.currentStep} key='task-progress'/>
      milestones = <Milestones
        id={id}
        goToStep={@goToStep}
        closeMilestones={@closeMilestones}
        filterClick={@filterClickForMilestones}
        handleTransitions={@toggleMilestonesEntered}
        showMilestones={showMilestones}/>

      panel = <ProgressPanel
        taskId={id}
        stepId={step?.id}
        goToStep={@goToStep}
        isSpacer={not step.id? and step.type isnt 'end'}
        stepKey={@state.currentStep}
        enableKeys={not showMilestones}
      >
        {milestones}
        {panel}
      </ProgressPanel>

      taskClasses = classnames taskClasses, 'task-with-progress',
        'task-with-milestones': showMilestones
        'task-with-milestones-entered': milestonesEntered and showMilestones

    <PinnedHeaderFooterCard
      className={taskClasses}
      fixedOffset={0}
      header={header}
      cardType='task'>
      {<TeacherReviewControls
        taskId={id}
        courseId={courseId}
      /> if @shouldShowTeacherReviewControls(panelType)}
      {panel}
    </PinnedHeaderFooterCard>

  reloadTask: ->
    @setState({currentStep: 0})

  onNextStep: (state) ->
    {currentStep} = state?
    currentStep ?= @state.currentStep
    @goToStep(currentStep + 1)


TaskShell = React.createClass
  displayName: 'TaskShell'
  render: ->
    {id} = @props.params
    <LoadableItem
      id={id}
      store={TaskStore}
      actions={TaskActions}
      renderItem={-> <Task key={id} id={id} />}
    />

module.exports = {Task, TaskShell}
