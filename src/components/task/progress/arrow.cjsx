React = require 'react'
{TaskStore} = require '../../../flux/task'
{TaskStepStore, TaskStepActions} = require '../../../flux/task-step'

module.exports = React.createClass
  propTypes:
    taskId: React.PropTypes.string
    stepId: React.PropTypes.string
    stepKey: React.PropTypes.number
    goToStep: React.PropTypes.func


  transition: ->
    { stepId, stepKey, direction, goToStep } = @props
    increment = -1
    increment = 1 if direction is 'right'

    TaskStepStore.off('step.completed', @transition)

    { stepId, goToStep } = @props
    goToStep(stepKey + increment)

  arrowClicked: ->
    { stepId, direction } = @props

    if (direction is 'right' and not TaskStepStore.get(stepId).is_completed)
      TaskStepStore.on('step.completed', @transition)
      TaskStepActions.complete(stepId)
    else
      @transition()

  render: ->
    if not @props.shouldShow
      return null

    <a onClick={@arrowClicked} className="arrow #{@props.direction}">
      <i className="fa fa-angle-#{@props.direction}" />
    </a>
