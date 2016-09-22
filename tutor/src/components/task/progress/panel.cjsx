React = require 'react'
PureRenderMixin = require 'react-addons-pure-render-mixin'

keymaster = require 'keymaster'

PagingNavigation  = require '../../paging-navigation'

{TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'
{TaskStepStore, TaskStepActions} = require '../../../flux/task-step'

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
    TaskStepStore.off('step.completed', @updateShouldShows)

  componentWillMount: ->
    TaskStepStore.on('step.completed', @updateShouldShows)

  componentWillReceiveProps: (nextProps) ->
    @setState(@getShouldShows(nextProps))

  getShouldShows: (props = @props) ->
    {stepKey, stepId, isSpacer} = props
    shouldShowLeft: stepKey > 0
    shouldShowRight: isSpacer or (stepId? and StepPanel.canForward(stepId))

  updateShouldShows: ->
    @setState(@getShouldShows())

  goForward: ->
    { stepId } = @props
    if stepId and not TaskStepStore.get(stepId)?.is_completed
      TaskStepStore.once('step.completed', =>
        @props.goToStep(@props.stepKey + 1)
      )
      TaskStepActions.complete(stepId)
    else
      @props.goToStep(@props.stepKey + 1)
    undefined # silence React return value warning

  goBackward: ->
    @props.goToStep(@props.stepKey - 1)
    undefined # silence React return value warning

  render: ->
    <PagingNavigation
      className="progress-panel"
      enableKeys={@props.enableKeys}
      isForwardEnabled={@state.shouldShowRight}
      isBackwardEnabled={@state.shouldShowLeft}
      onForwardNavigation={@goForward}
      onBackwardNavigation={@goBackward}
    >
      {@props.children}
    </PagingNavigation>

module.exports = ProgressPanel
