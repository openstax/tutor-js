React = require 'react'
{TaskStore} = require '../../../flux/task'
{TaskStepStore, TaskStepActions} = require '../../../flux/task-step'
keymaster = require 'keymaster'
KEYBINDING_SCOPE  = 'reading-progress'

ProgressArrow = React.createClass
  propTypes:
    taskId: React.PropTypes.string
    stepId: React.PropTypes.string
    stepKey: React.PropTypes.number
    goToStep: React.PropTypes.func

  componentWillUnmount: ->
    @disableKeys() if @props.enableKeys

  componentWillMount: ->
    @enableKeys() if @props.enableKeys

  componentWillReceiveProps: (nextProps) ->
    if nextProps.enableKeys and not @props.enableKeys
      @enableKeys()
    else if not nextProps.enableKeys and @props.enableKeys
      @disableKeys()

  enableKeys: ->
    keymaster(@props.direction,  KEYBINDING_SCOPE, @arrowClicked)
    keymaster.setScope(KEYBINDING_SCOPE)

  disableKeys: ->
    keymaster.deleteScope(KEYBINDING_SCOPE)

  transition: ->
    { stepKey, goToStep } = @props

    TaskStepStore.off('step.completed', @transition)
    goToStep(stepKey + @getIncrement())

  arrowClicked: ->
    { stepId, direction } = @props

    if (direction is 'right' and stepId and not TaskStepStore.get(stepId).is_completed)
      TaskStepStore.on('step.completed', @transition)
      TaskStepActions.complete(stepId)
    else
      @transition()

  getIncrement: ->
    { direction } = @props
    increment = -1
    increment = 1 if direction is 'right'
    increment

  render: ->
    if not @props.shouldShow
      return null

    step = @props.stepKey + @getIncrement()
    <a onClick={@arrowClicked} className="arrow #{@props.direction}" data-step={step}>
      <i className="fa fa-angle-#{@props.direction}" />
    </a>

module.exports = ProgressArrow
