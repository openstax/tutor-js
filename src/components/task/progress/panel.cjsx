React = require 'react'
Arrow = require './arrow'
{TaskStore} = require '../../../flux/task'
{StepPanel} = require '../../../helpers/policies'
{TaskStepStore} = require '../../../flux/task-step'

module.exports = React.createClass
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
    shouldShowRight = (
      @props.stepKey < TaskStore.getTotalStepsCount(@props.taskId) - 1 and
      StepPanel.canContinue(@props.stepId) and
      step and
      step.type isnt 'exercise' or (
        step and
        step.type is 'exercise' and
        TaskStepStore.isAnswered(@props.stepId)
      ) or
      @props.isSpacer is true
    )

    <div>
      <Arrow {...@props} direction="left" shouldShow={shouldShowLeft} />
      {@props.children}
      <Arrow {...@props} direction="right" shouldShow={shouldShowRight} />
    </div>
