React = require 'react'

{TaskStore} = require '../../flux/task'
{TaskStepStore} = require '../../flux/task-step'
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
    id: React.PropTypes.string.isRequired

  componentWillMount: -> TaskStepStore.addChangeListener(@update)
  componentWillUnmount: -> TaskStepStore.removeChangeListener(@update)

  update: -> @setState({})

  render: ->
    {id} = @props
    {type} = TaskStepStore.get(id)
    Type = getStepType(type)

    <Type
      id={id}
      onNextStep={@props.onNextStep}
      onStepCompleted={@props.onStepCompleted}
    />
