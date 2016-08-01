React = require 'react'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskProgressActions, TaskProgressStore} = require '../../flux/task-progress'
{TaskStore} = require '../../flux/task'

_ = require 'underscore'

CrumbMixin = require './crumb-mixin'
{ChapterSectionMixin, ResizeListenerMixin} = require 'openstax-react-components'
{BreadcrumbTaskDynamic} = require '../breadcrumb'

module.exports = React.createClass
  displayName: 'Breadcrumbs'

  mixins: [ChapterSectionMixin, CrumbMixin, ResizeListenerMixin]

  propTypes:
    id: React.PropTypes.string.isRequired
    goToStep: React.PropTypes.func.isRequired

  getInitialState: ->
    currentStep = TaskProgressStore.get(@props.id)

    updateOnNext: true
    hoverCrumb: currentStep
    shouldShrink: null
    crumbsWidth: null
    currentStep: currentStep

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

    # if a recovery step needs to be loaded, don't update breadcrumbs
    TaskStore.on('task.beforeRecovery', @stopUpdate)
    # until the recovery step has been loaded
    TaskStore.on('task.afterRecovery', @update)

    @startListeningForProgress()
    crumbs = @getCrumableCrumbs()
    @setState {crumbs}

  componentDidMount: ->
    @calculateCrumbsWidth()

  calculateCrumbsWidth: (crumbDOM) ->
    if @isMounted()
      currentCrumbWidth = 0
      crumbsWidth = _.reduce(@refs, (memo, ref) ->
        refDOM = ref.getDOMNode()
        computedStyle = window.getComputedStyle(refDOM)
        refDOMBox = refDOM.getBoundingClientRect()
        currentCrumbWidth = refDOMBox.width + parseInt(computedStyle.marginRight) + parseInt(computedStyle.marginLeft)
        currentCrumbWidth + memo
      , 0)

      crumbsWidth += currentCrumbWidth
      @setState({crumbsWidth}) if crumbsWidth > @state.crumbsWidth

  componentWillUnmount: ->
    TaskStepStore.setMaxListeners(10)
    TaskStore.off('task.beforeRecovery', @stopUpdate)
    TaskStore.off('task.afterRecovery', @update)
    @stopListeningForProgress()

  componentDidUpdate: (prevProps, prevState) ->
    if @didWidthChange(prevState, @state)
      @setShouldShrink(@state)

  componentWillReceiveProps: (nextProps) ->
    if @props.id isnt nextProps.id
      @stopListeningForProgress()
      @startListeningForProgress(nextProps)
    crumbs = @getCrumableCrumbs()
    @setState({hoverCrumb: nextProps.currentStep, crumbs})

  stopListeningForProgress: (props) ->
    props ?= @props
    {id} = props

    TaskProgressStore.off("update.#{id}", @setCurrentStep)

  startListeningForProgress: (props) ->
    props ?= @props
    {id} = props

    TaskProgressStore.on("update.#{id}", @setCurrentStep)

  crumbMounted: ->
    @calculateCrumbsWidth() if @state.crumbsWidth?

  didWidthChange: (prevState, currentState) ->
    currentState.crumbsWidth isnt prevState.crumbsWidth or currentState.componentEl.width isnt prevState.componentEl.width

  setShouldShrink: (sizes) ->
    shouldShrink = sizes.componentEl.width < @state.crumbsWidth
    @setState({shouldShrink})

  shouldComponentUpdate: (nextProps, nextState) ->
    nextState.updateOnNext

  update: ->
    @setState(updateOnNext: true)

  setCurrentStep: ({previous, current}) ->
    @setState(currentStep: current)

  stopUpdate: ->
    @setState(updateOnNext: false)

  updateHoverCrumb: (hover) ->
    @setState(hoverCrumb: hover)

  render: ->
    {crumbs, currentStep} = @state
    {goToStep, wrapper} = @props

    stepButtons = _.map crumbs, (crumb, crumbIndex) =>
      crumbStyle =
        zIndex: crumbs.length - Math.abs(@state.hoverCrumb - crumbIndex)

      <BreadcrumbTaskDynamic
        onMouseEnter={@updateHoverCrumb.bind(@, crumbIndex)}
        onMouseLeave={@updateHoverCrumb.bind(@, @props.currentStep)}
        onMount={@crumbMounted}
        style={crumbStyle}
        crumb={crumb}
        data-label={crumb.label}
        currentStep={currentStep}
        goToStep={goToStep}
        key="breadcrumb-#{crumb.type}-#{crumb.key}"
        ref="breadcrumb-#{crumb.type}-#{crumb.key}"/>

    if wrapper?
      Wrapper = wrapper
      stepButtons = _.map stepButtons, (crumb, crumbIndex) ->
        <Wrapper key={"crumb-wrapper-#{crumbIndex}"} breadcrumb={crumb}/>

    classes = 'task-breadcrumbs'
    classes += ' shrink' if @state.shouldShrink

    <div className={classes}>
      {stepButtons}
    </div>
