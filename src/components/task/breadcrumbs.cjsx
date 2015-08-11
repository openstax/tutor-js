React = require 'react'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'

_ = require 'underscore'

CrumbMixin = require './crumb-mixin'
ChapterSectionMixin = require '../chapter-section-mixin'
ResizeListenerMixin = require '../resize-listener-mixin'
{BreadcrumbTaskDynamic} = require '../breadcrumb'

module.exports = React.createClass
  displayName: 'Breadcrumbs'

  mixins: [ChapterSectionMixin, CrumbMixin, ResizeListenerMixin]

  propTypes:
    id: React.PropTypes.string.isRequired
    currentStep: React.PropTypes.number.isRequired
    goToStep: React.PropTypes.func.isRequired

  getInitialState: ->
    updateOnNext: true
    hoverCrumb: @props.currentStep
    shouldShrink: null
    crumbsWidth: null

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

    crumbs = @getCrumableCrumbs()

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

  componentDidUpdate: (prevProps, prevState) ->
    @_resizeListener(@state) if @state.crumbsWidth isnt prevState.crumbsWidth

  componentWillReceiveProps: (nextProps) ->
    @setState(hoverCrumb: nextProps.currentStep)

  crumbMounted: ->
    @calculateCrumbsWidth() if @state.crumbsWidth?

  _resizeListener: (sizes) ->
    shouldShrink = @shouldShrink(sizes)
    @setState({shouldShrink})

  shouldShrink: (sizes) ->
    sizes.componentEl.width < @state.crumbsWidth

  shouldComponentUpdate: (nextProps, nextState) ->
    nextState.updateOnNext

  update: ->
    @setState(updateOnNext: true)

  stopUpdate: ->
    @setState(updateOnNext: false)

  updateHoverCrumb: (hover) ->
    @setState(hoverCrumb: hover)

  render: ->
    crumbs = @getCrumableCrumbs()
    {currentStep, goToStep} = @props

    stepButtons = _.map crumbs, (crumb, crumbIndex) =>
      crumbStyle =
        zIndex: crumbs.length - Math.abs(@state.hoverCrumb - crumbIndex)

      <BreadcrumbTaskDynamic
        onMouseEnter={@updateHoverCrumb.bind(@, crumbIndex)}
        onMouseLeave={@updateHoverCrumb.bind(@, @props.currentStep)}
        onMount={@crumbMounted}
        style={crumbStyle}
        crumb={crumb}
        currentStep={currentStep}
        goToStep={goToStep}
        key="breadcrumb-#{crumb.type}-#{crumb.key}"
        ref="breadcrumb-#{crumb.type}-#{crumb.key}"/>

    classes = 'task-breadcrumbs'
    classes += ' shrink' if @state.shouldShrink

    <div className={classes}>
      {stepButtons}
    </div>
