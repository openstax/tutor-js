React = require 'react'

{TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
LoadableItem = require '../loadable-item'
{Reading, Interactive, Video, Exercise, Placeholder, Spacer, ExternalUrl} = require './all-steps'

{StepPanel} = require '../../helpers/policies'

# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))

STEP_TYPES =
  reading     : Reading
  interactive : Interactive
  video       : Video
  exercise    : Exercise
  placeholder : Placeholder
  spacer : Spacer
  external_url: ExternalUrl

getStepType = (typeName) ->
  type = STEP_TYPES[typeName]
  type or err('BUG: Invalid task step type', typeName)


TaskStepLoaded = React.createClass
  displayName: 'TaskStepLoaded'

  propTypes:
    id: React.PropTypes.string.isRequired
    onNextStep: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired
    onStepCompleted: React.PropTypes.func.isRequired

  render: ->
    {id, taskId} = @props
    {type} = TaskStepStore.get(id)
    {ecosystem_title} = TaskStore.get(taskId)

    Type = getStepType(type)
    <div>
      <Type {...@props}/>
      <div className="task-ecosystem-info visible-when-debugging">
        TaskId: {taskId}, StepId: {id}, Ecosystem: {ecosystem_title}
      </div>
    </div>

module.exports = React.createClass
  displayName: 'TaskStep'

  propTypes:
    id: React.PropTypes.string.isRequired
    onNextStep: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired

  onStepCompleted: ->
    {id} = @props
    canWrite = StepPanel.canWrite(id)

    if canWrite
      TaskStepActions.complete(id)

  render: ->
    {id} = @props

    <LoadableItem
      id={id}
      store={TaskStepStore}
      actions={TaskStepActions}
      renderItem={=> <TaskStepLoaded {...@props} onStepCompleted={@onStepCompleted}/>}
    />
