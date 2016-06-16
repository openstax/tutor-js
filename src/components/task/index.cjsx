React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'
camelCase = require 'camelcase'
classnames = require 'classnames'

{TaskActions, TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskProgressActions, TaskProgressStore} = require '../../flux/task-progress'

CrumbMixin = require './crumb-mixin'
StepFooterMixin = require '../task-step/step-footer-mixin'
ScrollToMixin = require '../scroll-to-mixin'

TaskStep = require '../task-step'
{Spacer} = require '../task-step/all-steps'
Ends = require '../task-step/ends'
Breadcrumbs = require './breadcrumbs'

TaskProgress = require './progress'
ProgressPanel = require './progress/panel'
{Milestones, Milestone} = require './progress/milestones'

{StepPanel} = require '../../helpers/policies'

{UnsavedStateMixin} = require '../unsaved-state'

{PinnedHeaderFooterCard, PinnedHeader} = require 'openstax-react-components'

module.exports = React.createClass
  propTypes:
    id: React.PropTypes.string

  displayName: 'Task'

  mixins: [StepFooterMixin, CrumbMixin, UnsavedStateMixin, ScrollToMixin]

  contextTypes:
    router: React.PropTypes.func

  setStepKey: ->
    {stepIndex} = @context.router.getCurrentParams()
    # url is 1 based so it matches the breadcrumb button numbers
    defaultKey = @getDefaultCurrentStep()
    crumbKey = if stepIndex then parseInt(stepIndex) - 1 else defaultKey
    crumb = @getCrumb(crumbKey)
    TaskProgressActions.update(@props.id, crumbKey)

    # go ahead and render this step only if this step is accessible
    if crumb?.crumb
      @setState(currentStep: crumbKey)
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
    @setStepKey()
    TaskStepStore.on('step.recovered', @prepareToRecover)

  componentWillUnmount: ->
    TaskStepStore.off('step.recovered', @prepareToRecover)

  componentWillReceiveProps: ->
    @setStepKey()

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
    TaskStore.isSameStep(@props.id, @state.currentStep, nextState.currentStep)

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

    if @_isSameStep(nextProps, nextState)
      unless @state.currentStep is nextState.currentStep
        nextStep = TaskStore.getStepByIndex(id, nextState.currentStep)
        TaskStepActions.load(nextStep.id)
        unless nextState.stepEntered is nextState.currentStep
          @scrollToSelector("#exercise-part-with-scroll-#{nextState.currentStep}", {updateHistory: false})

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
    stepKey = parseInt(stepKey)
    params = _.clone(@context.router.getCurrentParams())
    return false if @areKeysSame(params.stepIndex, stepKey + 1)
    # url is 1 based so it matches the breadcrumb button numbers
    params.stepIndex = stepKey + 1
    params.id = @props.id # if we were rendered directly, the router might not have the id

    if silent
      @context.router.replaceWith('viewTaskStep', params)
      true
    else
      @context.router.transitionTo('viewTaskStep', params)
      true

  onPartEnter: (stepKey, scrollInfo) ->
    return if @context.router.getCurrentParams().milestones?
    {previousPosition} = scrollInfo
    return unless previousPosition is 'below'

    stepKey = parseInt(stepKey)
    params = _.clone(@context.router.getCurrentParams())
    params.stepIndex = stepKey + 1
    params.id = @props.id # if we were rendered directly, the router might not have the id

    return unless TaskStore.isSameStep(@props.id, @state.currentStep, stepKey)

    @setState(stepEntered: stepKey)
    @context.router.transitionTo('viewTaskStep', params)

  onPartLeave: (stepKey, scrollInfo) ->
    return if @context.router.getCurrentParams().milestones?
    {currentPosition} = scrollInfo
    return unless currentPosition is 'below'

    stepKey = parseInt(stepKey)
    params = _.clone(@context.router.getCurrentParams())
    params.stepIndex = stepKey
    params.id = @props.id # if we were rendered directly, the router might not have the id
    return unless TaskStore.isSameStep(@props.id, @state.currentStep, stepKey - 1)

    @setState(stepEntered: stepKey - 1)
    @context.router.transitionTo('viewTaskStep', params)

  toggleMilestonesEntered: ->
    @setState(milestonesEntered: not @state.milestonesEntered)

  closeMilestones: ->
    params = @context.router.getCurrentParams()
    @context.router.transitionTo('viewTaskStep', params)

  filterClickForMilestones: (focusEvent) ->
    stepPanel = @refs.stepPanel?.getDOMNode()
    not stepPanel?.contains(focusEvent.target)

  getCrumb: (crumbKey) ->
    crumbs = @generateCrumbs()
    _.findWhere crumbs, {key: crumbKey}

  renderStep: (data) ->
    {courseId} = @context.router.getCurrentParams()
    {id} = @props
    pinned = not TaskStore.hasProgress(id)

    <TaskStep
      id={data.id}
      taskId={@props.id}
      courseId={courseId}
      goToStep={@goToStep}
      onPartEnter={@onPartEnter}
      onPartLeave={@onPartLeave}
      onNextStep={@onNextStep}
      refreshStep={@refreshStep}
      recoverFor={@recoverFor}
      pinned={pinned}
      ref='stepPanel'
    />

  renderDefaultEndFooter: ->
    {id} = @props
    {courseId} = @context.router.getCurrentParams()

    taskFooterParams =
      taskId: id
      courseId: courseId

    @renderEndFooter(taskFooterParams)

  renderEnd: (data) ->
    {id} = @props
    {courseId} = @context.router.getCurrentParams()
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

  renderSpacer: (data) ->
    {courseId} = @context.router.getCurrentParams()
    <Spacer
      onNextStep={@onNextStep}
      taskId={@props.id}
      courseId={courseId}
      ref='stepPanel'/>

  # add render methods for different panel types as needed here

  render: ->
    {id} = @props
    {milestonesEntered} = @state
    showMilestones = @context.router.getCurrentParams().milestones?
    task = TaskStore.get(id)
    return null unless task?

    # get the crumb that matches the current state
    crumb = @getCrumb(@state.currentStep)
    panelType = StepPanel.getPanel(crumb.data?.id)

    # crumb.type is one of ['intro', 'step', 'end']
    renderPanelMethod = camelCase "render-#{crumb.type}"

    throw new Error("BUG: panel #{crumb.type} for #{task.type} does not have a render method") unless @[renderPanelMethod]?

    panelData = _.extend({}, crumb.data, {panelType})
    panel = @[renderPanelMethod]?(panelData)

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

      header = <TaskProgress taskId={id} stepKey={@state.currentStep} key='task-progress'/>
      milestones = <Milestones
        id={id}
        goToStep={@goToStep}
        closeMilestones={@closeMilestones}
        filterClick={@filterClickForMilestones}
        handleTransitions={@toggleMilestonesEntered}
        showMilestones={showMilestones}/>

      panel = <ProgressPanel
        taskId={id}
        stepId={crumb.data?.id}
        goToStep={@goToStep}
        isSpacer={crumb?.type is 'spacer'}
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
      {panel}
    </PinnedHeaderFooterCard>

  reloadTask: ->
    @setState({currentStep: 0})

  onNextStep: (state) ->
    {currentStep} = state?
    currentStep ?= @state.currentStep
    @goToStep(currentStep + 1)
