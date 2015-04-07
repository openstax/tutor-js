React = require 'react'

{TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
LoadableItem = require '../loadable-item'
{Reading, Interactive, Video, Exercise} = require './all-steps'

# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))

STEP_TYPES =
  reading     : Reading
  interactive : Interactive
  video       : Video
  exercise    : Exercise

getStepType = (typeName) ->
  type = STEP_TYPES[typeName]
  type or err('BUG: Invalid task step type', typeName)


TaskStepLoaded = React.createClass
  displayName: 'TaskStepLoaded'

  propTypes:
    id: React.PropTypes.string.isRequired
    onNextStep: React.PropTypes.func.isRequired
    onStepCompleted: React.PropTypes.func.isRequired

  render: ->
    {id, onNextStep, onStepCompleted} = @props
    {type} = TaskStepStore.get(id)
    Type = getStepType(type)

    <Type
      id={id}
      onNextStep={onNextStep}
      onStepCompleted={onStepCompleted}
    />

module.exports = React.createClass
  displayName: 'TaskStep'

  onStepCompleted: ->
    {id} = @props
    TaskStepActions.complete(id)

  render: ->
    {id, onNextStep, onStepCompleted} = @props

    <LoadableItem
      id={id}
      store={TaskStepStore}
      actions={TaskStepActions}
      renderItem={=> <TaskStepLoaded id={id} onNextStep={onNextStep} onStepCompleted={@onStepCompleted}/>}
    />
