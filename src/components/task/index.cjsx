React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'
camelCase = require 'camelcase'

{TaskActions, TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'

CrumbMixin = require './crumb-mixin'
StepFooterMixin = require '../task-step/step-footer-mixin'

TaskStep = require '../task-step'
{Spacer} = require '../task-step/all-steps'
Ends = require '../task-step/ends'
Breadcrumbs = require './breadcrumbs'

{StepPanel} = require '../../helpers/policies'

PinnedHeaderFooterCard = require '../pinned-header-footer-card'

module.exports = React.createClass
  propTypes:
    id: React.PropTypes.string

  displayName: 'ReadingTask'

  mixins: [StepFooterMixin, CrumbMixin]

  contextTypes:
    router: React.PropTypes.func

  setStepKey: ->
    {stepIndex} = @context.router.getCurrentParams()
    # url is 1 based so it matches the breadcrumb button numbers
    defaultKey = @getDefaultCurrentStep()
    crumbKey = if stepIndex then parseInt(stepIndex) - 1 else defaultKey
    crumb = @getCrumb(crumbKey)

    # go ahead and render this step only if this step is accessible
    if crumb?.crumb
      @setState(currentStep: crumbKey)
    # otherwise, redirect to the latest accessible step
    else
      @goToStep(defaultKey)(true)

  getInitialState: ->
    {
      currentStep: 0
      refreshFrom: false
      refreshTo: false
      recoverForStepId: false
      recoveredStepId: false
    }

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
      TaskStepActions.loadRecovery(nextState.recoverForStepId)
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

    # if we reach this point, assume that we should go ahead and do a normal component update
    true

  # on refresh clicked and refresh step loaded, go to the refreshing step
  # also, ask the step to be recovered.  this will trigger loadRecovery to be called within shouldComponentUpdate
  refreshStep: (refreshTo, stepId) ->
    @setState({refreshFrom: @state.currentStep, refreshTo: refreshTo, recoverForStepId: stepId})
    @goToStep(refreshTo)()

  # on leaving refresh step, go to the step after the step that triggered the refresh and clear related states.
  # the step after should be the recovered step!
  continueAfterRefreshStep: ->
    @goToStep(@state.refreshFrom + 1)()
    @setState({refreshFrom: false, refreshTo: false, recoverForStepId: false})

  # set what step needs to be recovered.  this will trigger loadRecovery to be called within shouldComponentUpdate
  recoverFor: (stepId) ->
    @setState({recoverForStepId: stepId})

  # if the step loaded is the recovered step, unset the recoveredStepId and stop listening for steps loaded
  # when the recoveredStepId is unset, then shouldComponentUpdate will see that the step has been loaded.
  recoverStep: (loadedStepId) ->
    if loadedStepId is @state.recoveredStepId
      @setState({recoveredStepId: false})
      TaskStepStore.off('step.loaded', @recoverStep)

  # Curried for React
  goToStep: (stepKey) ->
    (silent = false) =>
      params = @context.router.getCurrentParams()
      # url is 1 based so it matches the breadcrumb button numbers
      params.stepIndex = stepKey + 1
      params.id = @props.id # if we were rendered directly, the router might not have the id
      if silent
        @context.router.replaceWith('viewTaskStep', params)
      else
        @context.router.transitionTo('viewTaskStep', params)

  getCrumb: (crumbKey) ->
    crumbs = @generateCrumbs()
    _.findWhere crumbs, {key: crumbKey}

  renderStep: (data) ->
    {courseId} = @context.router.getCurrentParams()

    <TaskStep
      id={data.id}
      taskId={@props.id}
      courseId={courseId}
      goToStep={@goToStep}
      onNextStep={@onNextStep}
      refreshStep={@refreshStep}
      recoverFor={@recoverFor}
    />

  renderDefaultEndFooter: (data) ->
    {id} = @props
    {courseId} = @context.router.getCurrentParams()

    taskFooterParams =
      stepId: data.id
      taskId: id
      courseId: courseId

    @renderEndFooter(taskFooterParams)

  renderEnd: (data) ->
    {courseId} = @context.router.getCurrentParams()
    type = if data.type then data.type else 'task'
    End = Ends.get(type)

    footer = @renderDefaultEndFooter(data)

    panel = <End
      courseId={courseId}
      taskId={data.id}
      reloadPractice={@reloadTask}
      footer={footer} />

  renderSpacer: (data) ->
    {courseId} = @context.router.getCurrentParams()
    <Spacer onNextStep={@onNextStep} taskId={@props.id} courseId={courseId}/>

  # add render methods for different panel types as needed here

  render: ->
    {id} = @props
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

    taskClasses = "task task-#{task.type}"
    taskClasses += " task-#{panelType}" if panelType?
    taskClasses += ' task-completed' if TaskStore.isTaskCompleted(id)

    unless TaskStore.isSingleStepped(id)
      breadcrumbs = <Breadcrumbs
        id={id}
        goToStep={@goToStep}
        currentStep={@state.currentStep}
        key="task-#{id}-breadcrumbs"/>

    <PinnedHeaderFooterCard
      forceShy={true}
      className={taskClasses}
      fixedOffset={0}
      header={breadcrumbs}
      cardType='task'>
      {panel}
    </PinnedHeaderFooterCard>

  reloadTask: ->
    @setState({currentStep: 0})

  onNextStep: ->
    @goToStep(@state.currentStep + 1)()
