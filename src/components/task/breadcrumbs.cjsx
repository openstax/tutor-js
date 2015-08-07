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
    shouldCoverflow: false
    coverflowWidth: null

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
    @setState(coverflowWidth: (crumbs.length * 47))


  componentWillUnmount: ->
    TaskStepStore.setMaxListeners(10)
    TaskStore.off('task.beforeRecovery', @stopUpdate)
    TaskStore.off('task.afterRecovery', @update)

  _resizeListener: (sizes) ->
    shouldCoverflow = @shouldCoverflow(sizes)
    @setState({shouldCoverflow})

  shouldCoverflow: (sizes) ->
    sizes.windowEl.width < @state.coverflowWidth

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
        style={crumbStyle}
        crumb={crumb}
        currentStep={currentStep}
        goToStep={goToStep}
        key="breadcrumb-#{crumb.type}-#{crumb.key}"/>

    classes = 'task-breadcrumbs'
    classes += ' shrink' if @state.shouldCoverflow

    <div className={classes}>
      {stepButtons}
    </div>
