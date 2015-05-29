React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
camelCase = require 'camelcase'

{ScrollListenerMixin} = require 'react-scroll-components'

{TaskActions, TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'

CrumbMixin = require './crumb-mixin'

TaskStep = require '../task-step'
{Spacer} = require '../task-step/all-steps'
Ends = require '../task-step/ends'
Breadcrumbs = require './breadcrumbs'

PinnedHeaderFooterCard = require '../pinned-header-footer-card'

Time = require '../time'
Details = require './details'


module.exports = React.createClass
  propTypes:
    id: React.PropTypes.string

  displayName: 'ReadingTask'

  mixins: [CrumbMixin]

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    {stepIndex} = @context.router.getCurrentParams()
    # url is 1 based so it matches the breadcrumb button numbers
    crumbKey = if stepIndex then parseInt(stepIndex) - 1 else @getDefaultCurrentStep()
    {
      currentStep: crumbKey
      refreshFrom: false
      refreshTo: false
      recoverForStepId: false
      recoveredStepId: false
    }

  componentWillMount:   ->
    TaskStepStore.on('step.recovered', @prepareToRecover)

  componentWillUnmount: ->
    TaskStepStore.off('step.recovered', @prepareToRecover)

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
    {id, task_id} = recoveredStep
    TaskStore.emit('task.beforeRecovery', task_id)
    TaskStepStore.on('step.loaded', @recoverStep(id))
    TaskActions.load(task_id)

  shouldComponentUpdate: (nextProps, nextState) ->
    {id} = @props

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
    @setState({refreshFrom: @state.currentStep, refreshTo: refreshTo})
    TaskStepActions.loadRecovery(stepId)
    @goToStep(refreshTo)()

  # on leaving refresh step, go to the step after the step that triggered the refresh and clear related states.
  # the step after should be the recovered step!
  continueAfterRefreshStep: ->
    @goToStep(@state.refreshFrom + 1)()
    @setState({refreshFrom: false, refreshTo: false, recoverForStepId: false})

  # set what step needs to be recovered.  this will trigger loadRecovery to be called within shouldComponentUpdate
  recoverFor: (stepId) ->
    TaskStepActions.loadRecovery(stepId)

  # if the step loaded is the recovered step, unset the recoveredStepId and stop listening for steps loaded
  # when the recoveredStepId is unset, then shouldComponentUpdate will see that the step has been loaded.
  recoverStep: (targetStepId) ->
    {id} = @props

    (loadedStepId) =>
      if loadedStepId is targetStepId
        @onNextStep() unless @state.refreshTo
        TaskStore.emit('task.afterRecovery', id)
        TaskStepStore.off('step.loaded', @recoverStep)

  # Curried for React
  goToStep: (stepKey) ->
    =>
      params = @context.router.getCurrentParams()
      # url is 1 based so it matches the breadcrumb button numbers
      params.stepIndex = stepKey + 1
      params.id = @props.id # if we were rendered directly, the router might not have the id
      @context.router.replaceWith('viewTaskStep', params)
      @setState({currentStep: stepKey})

  goToCrumb: ->
    crumbs = @generateCrumbs()
    _.findWhere crumbs, {key: @state.currentStep}

  renderStep: (data) ->
    <TaskStep
      id={data.id}
      taskId={@props.id}
      goToStep={@goToStep}
      onNextStep={@onNextStep}
      refreshStep={@refreshStep}
      recoverFor={@recoverFor}
    />

  renderEnd: (data) ->
    {courseId} = @context.router.getCurrentParams()
    type = if data.type then data.type else 'task'
    End = Ends.get(type)

    panel = <End courseId={courseId} taskId={data.id} reloadPractice={@reloadTask}/>

  renderSpacer: (data) ->
    <Spacer onNextStep={@onNextStep} taskId={@props.id}/>

  # add render methods for different panel types as needed here

  render: ->
    {id} = @props
    task = TaskStore.get(id)
    return null unless task?

    # get the crumb that matches the current state
    crumb = @goToCrumb()

    # crumb.type is one of ['intro', 'step', 'end']
    renderPanelMethod = camelCase "render-#{crumb.type}"

    throw new Error("BUG: panel #{crumb.type} for #{task.type} does not have a render method") unless @[renderPanelMethod]?
    panel = @[renderPanelMethod]?(crumb.data)

    taskClasses = "task task-#{task.type}"
    taskClasses += ' task-completed' if TaskStore.isTaskCompleted(id)

    unless TaskStore.isSingleStepped(id)
      breadcrumbs = <Breadcrumbs
        id={id}
        goToStep={@goToStep}
        currentStep={@state.currentStep}
        key="task-#{id}-breadcrumbs"/>

    <PinnedHeaderFooterCard
      className={taskClasses}
      header={breadcrumbs}
      cardType='task'>
      {panel}
    </PinnedHeaderFooterCard>

  reloadTask: ->
    @setState({currentStep: 0})

  onNextStep: ->
    @goToStep(@state.currentStep + 1)()
