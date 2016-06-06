React = require 'react'
Arrow = require './arrow'
{TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'
{TaskStepStore} = require '../../../flux/task-step'

ProgressPanel = React.createClass
  propTypes:
    taskId: React.PropTypes.string
    stepId: React.PropTypes.string
    stepKey: React.PropTypes.number
    goToStep: React.PropTypes.func

  componentWillMount: -> TaskStepStore.on('step.completed', @update)
  removeListeners: -> TaskStepStore.off('step.completed', @update)
  componentWillUnmount: -> @removeListeners()

  update: -> @setState({})

  render: ->
    step = TaskStepStore.get(@props.stepId)

    shouldShowLeft = @props.stepKey > 0
    shouldShowRight = StepPanel.canForward(@props.stepId)

    <div className="progress-panel">
      <Arrow {...@props} direction="left" shouldShow={shouldShowLeft} />
      {@props.children}
      <Arrow {...@props} direction="right" shouldShow={shouldShowRight} />
    </div>

module.exports = ProgressPanel
