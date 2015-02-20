React = require 'react'

{TaskStore} = require '../../flux/task'
{Reading, Interactive, Exercise} = require './all-steps'

# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))

STEP_TYPES =
  reading     : Reading
  interactive : Interactive
  exercise    : Exercise

getStepType = (typeName) ->
  type = STEP_TYPES[typeName]
  type or err('BUG: Invalid task step type', typeName)


module.exports = React.createClass
  displayName: 'TaskStep'

  propTypes:
    model: React.PropTypes.object.isRequired
    task: React.PropTypes.object.isRequired

  render: ->
    {model} = @props
    {type} = model
    Type = getStepType(type)

    <Type
      model={@props.model}
      task={@props.task}
      onNextStep={@props.onNextStep}
      onStepCompleted={@props.onStepCompleted}
    />
