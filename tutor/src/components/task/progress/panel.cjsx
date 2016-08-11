React = require 'react/addons'
keymaster = require 'keymaster'

Arrow = require './arrow'
{TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'
{TaskStepStore} = require '../../../flux/task-step'

KEYBINDING_SCOPE  = 'reading-progress'

ProgressPanel = React.createClass
  propTypes:
    taskId: React.PropTypes.string
    stepId: React.PropTypes.string
    stepKey: React.PropTypes.number
    goToStep: React.PropTypes.func

  mixins: [React.addons.PureRenderMixin]

  getInitialState: ->
    @getShouldShows()

  componentWillUnmount: ->
    TaskStepStore.off('step.completed', @updateShouldShows)
    @disableKeys() if @props.enableKeys

  componentWillMount: ->
    TaskStepStore.on('step.completed', @updateShouldShows)
    @enableKeys() if @props.enableKeys

  componentWillReceiveProps: (nextProps) ->
    @setState(@getShouldShows(nextProps))

    if nextProps.enableKeys and not @props.enableKeys
      @enableKeys()
    else if not nextProps.enableKeys and @props.enableKeys
      @disableKeys()

  enableKeys: ->
    keymaster.setScope(KEYBINDING_SCOPE)

  disableKeys: ->
    keymaster.setScope()

  getShouldShows: (props) ->
    props ?= @props
    {stepKey, stepId, isSpacer} = props

    shouldShowLeft: stepKey > 0
    shouldShowRight: isSpacer or (stepId? and StepPanel.canForward(stepId))

  updateShouldShows: ->
    @setState(@getShouldShows())

  render: ->
    {shouldShowLeft, shouldShowRight} = @state

    <div className="progress-panel">
      {<Arrow {...@props} direction="left"/> if shouldShowLeft}
      {@props.children}
      {<Arrow {...@props} direction="right"/> if shouldShowRight}
    </div>

module.exports = ProgressPanel
