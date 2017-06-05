React = require 'react'
{SpyMode} = require 'shared'

{TaskActions, TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'
LoadableItem = require '../loadable-item'
{Reading, Interactive, Video, Exercise, Placeholder, ExternalUrl} = require './all-steps'
BindStoreMixin = require '../bind-store-mixin'

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
  external_url: ExternalUrl

getStepType = (typeName) ->
  type = STEP_TYPES[typeName]
  type or err('BUG: Invalid task step type', typeName)


TaskStep = React.createClass
  displayName: 'TaskStep'

  propTypes:
    id: React.PropTypes.string.isRequired
    onNextStep: React.PropTypes.func.isRequired

  mixins: [BindStoreMixin]
  bindStore: TaskStepStore

  onStepCompleted: (id) ->
    {id} = @props unless id?

    if StepPanel.canWrite(id)
      TaskActions.completeStep(id)

  render: ->
    {id, taskId} = @props
    {type, spy: taskStepSpy} = TaskStepStore.get(id)
    {spy: taskSpy} = TaskStore.get(taskId)
    Type = getStepType(type)
    <div>
      <Type
        {...@props}
        onStepCompleted={@onStepCompleted}
      />
      <SpyMode.Content className='task-ecosystem-info'>
        TaskId: {taskId}, StepId: {id}, Ecosystem: {taskSpy?.ecosystem_title}
        TaskStep: {JSON.stringify(taskStepSpy)}
      </SpyMode.Content>
    </div>


module.exports = TaskStep
