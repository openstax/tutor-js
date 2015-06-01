React = require 'react'
_ = require 'underscore'
{RouteHandler} = require 'react-router'

{TaskActions, TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'

Breadcrumbs = require './breadcrumbs'
PinnedHeaderFooterCard = require '../pinned-header-footer-card'
LoadableItem = require '../loadable-item'

CrumbMixin = require './crumb-mixin'


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

  componentWillMount: ->
    listeners = @getMaxListeners()
    # TaskStepStore listeners include:
    #   One per step for the crumb status updates
    #   Two additional listeners for step loading and completion
    #     if there are placeholder steps.
    #   One for step being viewed in the panel itself
    #     this is the + 1 to the max listeners being returned
    #
    # Only update max listeners if it is greater than the default of 10
    TaskStepStore.setMaxListeners(listeners + 1) if listeners? and (listeners + 1) > 10
    TaskStepStore.on('step.recovered', @prepareToRecover)

  componentWillUnmount: ->
    TaskStepStore.setMaxListeners(10)
    TaskStepStore.off('step.recovered', @prepareToRecover)

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
    =>
      params = @context.router.getCurrentParams()
      # url is 1 based so it matches the breadcrumb button numbers
      params.stepIndex = stepKey + 1
      params.id = @props.id # if we were rendered directly, the router might not have the id
      @setState({currentStep: stepKey})
      @context.router.transitionTo('viewTaskStep', params)

  goToCrumb: ->
    crumbs = @generateCrumbs()
    _.findWhere crumbs, {key: @state.currentStep}

  render: ->
    {id} = @props
    task = TaskStore.get(id)
    return null unless task?

    # get the crumb that matches the current state
    crumb = @goToCrumb()
    console.log('crumb')
    console.log(crumb)
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
      <RouteHandler
        crumb={crumb}
        taskId={id}
        goToStep={@goToStep}
        onNextStep={@onNextStep}
        reloadTask={@reloadTask}
        refreshStep={@refreshStep}
        recoverFor={@recoverFor}/>
    </PinnedHeaderFooterCard>

  reloadTask: ->
    @setState({currentStep: 0})

  onNextStep: ->
    @goToStep(@state.currentStep + 1)()
