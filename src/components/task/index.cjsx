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
      refreshFor: false
    }

  shouldComponentUpdate: (nextProps, nextState) ->
    return true unless nextState.currentStep is nextState.refreshFor

    # If attempt next step is a step that triggered a refresh,
    # don't update on this cycle.
    # Instead, reset the refreshFor state
    # and advance step to the next step after.
    @untrackRefreshStep()
    @goToStep(nextState.currentStep + 1)()
    return false

  trackRefreshStep: ->
    @setState({refreshFor: @state.currentStep})

  untrackRefreshStep: ->
    @setState({refreshFor: false})

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
      trackRefreshStep={@trackRefreshStep}
    />

  renderEnd: (data) ->
    {courseId} = @context.router.getCurrentParams()
    type = if data.type then data.type else 'task'
    End = Ends.get(type)

    panel = <End courseId={courseId} taskId={data.id} reloadPractice={@reloadTask}/>

  renderSpacer: (data) ->
    <Spacer onNextStep={@onNextStep}/>

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
      breadcrumbs = [
          <Details task={task} key="task-#{id}-details"/>
          <Breadcrumbs
            id={id}
            goToStep={@goToStep}
            currentStep={@state.currentStep}
            key="task-#{id}-breadcrumbs"/>
        ]

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
