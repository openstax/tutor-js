React = require 'react'
{ Route, DefaultRoute, RouteHandler, Link } = require('react-router')
BS = require 'react-bootstrap'
_ = require 'underscore'
camelCase = require 'camelcase'

{ScrollListenerMixin} = require 'react-scroll-components'

{TaskActions, TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'

TaskStep = require './index'
{Spacer} = require './all-steps'
Ends = require './ends'

PinnedHeaderFooterCard = require '../pinned-header-footer-card'
CrumbMixin = require '../task/crumb-mixin'

module.exports = React.createClass
  propTypes:
    id: React.PropTypes.string

  displayName: 'TaskStepChild'

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
      @context.router.replaceWith('viewTaskStep', params)
      @setState({currentStep: stepKey})

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

  goToCrumb: ->
    crumbs = @generateCrumbs()
    _.findWhere crumbs, {key: @state.currentStep}

  render: ->
    # get the crumb that matches the current state
    {crumb} = @props
    # crumb.type is one of ['intro', 'step', 'end']
    renderPanelMethod = camelCase "render-#{crumb.type}"

    throw new Error("BUG: panel #{crumb.type} does not have a render method") unless @[renderPanelMethod]?
    panel = @[renderPanelMethod]?(crumb.data)

  reloadTask: ->
    @setState({currentStep: 0})

  onNextStep: ->
    @goToStep(@state.currentStep + 1)()
