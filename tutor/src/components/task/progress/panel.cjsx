React = require 'react'
PureRenderMixin = require 'react-addons-pure-render-mixin'

keymaster = require 'keymaster'
classnames = require 'classnames'

{default: PagingNavigation}  = require '../../paging-navigation'

{TaskStore, TaskActions} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'
{TaskStepStore} = require '../../../flux/task-step'
{TaskPanelStore} = require '../../../flux/task-panel'

isEqual = require 'lodash/isEqual'
pick    = require 'lodash/pick'

ProgressPanel = React.createClass
  propTypes:
    taskId: React.PropTypes.string
    stepId: React.PropTypes.string
    stepKey: React.PropTypes.number
    goToStep: React.PropTypes.func

  mixins: [PureRenderMixin]

  getInitialState: ->
    @getShouldShows()

  componentWillUnmount: ->
    TaskStore.off('step.completed', @updateShouldShows)

  componentWillMount: ->
    TaskStore.on('step.completed', @updateShouldShows)

  componentWillReceiveProps: (nextProps) ->
    props = ['stepKey', 'stepId', 'isSpacer']
    return if isEqual(pick(this.props, props), pick(nextProps, props))

    @setState(@getShouldShows(nextProps))

  getShouldShows: (props = @props) ->
    {stepKey, stepId, isSpacer} = props

    shouldShowLeft: stepKey > 0
    shouldShowRight: isSpacer or (stepId? and StepPanel.canForward(stepId))
    isCompleting: false

  updateShouldShows: ->
    @setState(@getShouldShows())

  goForward: ->
    { stepId, taskId } = @props
    if stepId and not TaskStepStore.get(stepId)?.is_completed
      @setState(isCompleting: true)
      TaskStore.once('step.completed', =>
        @props.goToStep(@props.stepKey + 1)
        @setState(isCompleting: false)
      )
      TaskActions.completeStep(stepId, taskId)
    else
      @props.goToStep(@props.stepKey + 1)
    undefined # silence React return value warning

  goBackward: ->
    @props.goToStep(@props.stepKey - 1)
    undefined # silence React return value warning

  render: ->
    {isCompleting} = @state
    isLoading = TaskStepStore.isLoading(@props.stepId)
    titles = TaskPanelStore.getTitlesForStepIndex(@props.taskId, this.props.stepKey)
    className = classnames('progress-panel', 'page-loading': isCompleting or isLoading)

    <PagingNavigation
      className={className}
      enableKeys={@props.enableKeys}
      isForwardEnabled={@state.shouldShowRight}
      isBackwardEnabled={@state.shouldShowLeft}
      onForwardNavigation={@goForward}
      onBackwardNavigation={@goBackward}
      titles={titles}
    >
      {@props.children}
    </PagingNavigation>

module.exports = ProgressPanel
