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

  componentDidMount: ->
    keymaster(@props.direction, KEYBINDING_SCOPE, @arrowClicked)

  componentWillUnmount: ->
    keymaster.unbind(@props.direction, KEYBINDING_SCOPE)

  transition: ->
    { stepKey, goToStep } = @props

    goToStep(stepKey + @getIncrement())

  arrowClicked: (clickEvent) ->
    { stepId, direction } = @props

    if (direction is 'right' and stepId and not TaskStepStore.get(stepId).is_completed)
      TaskStepStore.once('step.completed', @transition)
      TaskStepActions.complete(stepId)
    else
      @transition()

    clickEvent.preventDefault()

  getIncrement: ->
    { direction } = @props
    increment = -1
    increment = 1 if direction is 'right'
    increment

  render: ->
    step = @props.stepKey + @getIncrement()
    <a onClick={@arrowClicked} className="arrow #{@props.direction}" data-step={step}>
      <i className="fa fa-angle-#{@props.direction}" />
    </a>

module.exports = ProgressArrow
