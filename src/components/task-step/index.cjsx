React = require 'react'
camelCase = require 'camelcase'

{TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'

LoadableItem = require '../loadable-item'
{Reading, Interactive, Video, Exercise, Placeholder, Spacer} = require './all-steps'
Ends = require './ends'

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
    {id} = @props
    {type} = TaskStepStore.get(id)
    Type = getStepType(type)

    <Type {...@props}/>

TaskStep = React.createClass
  displayName: 'TaskStep'

  propTypes:
    id: React.PropTypes.string.isRequired
    onNextStep: React.PropTypes.func.isRequired
    goToStep: React.PropTypes.func.isRequired

  onStepCompleted: ->
    {id} = @props
    TaskStepActions.complete(id)

  render: ->
    {id} = @props

    <LoadableItem
      id={id}
      store={TaskStepStore}
      actions={TaskStepActions}
      renderItem={=> <TaskStepLoaded {...@props} onStepCompleted={@onStepCompleted}/>}
    />

module.exports = React.createClass
  propTypes:
    id: React.PropTypes.string

  displayName: 'TaskStepHandler'

  contextTypes:
    router: React.PropTypes.func

  renderStep: (data) ->
    <TaskStep
      id={data.id}
      taskId={@props.taskId}
      goToStep={@props.goToStep}
      onNextStep={@props.onNextStep}
      refreshStep={@props.refreshStep}
      recoverFor={@props.recoverFor}
    />

  renderEnd: (data) ->
    {courseId} = @context.router.getCurrentParams()
    type = if data.type then data.type else 'task'
    End = Ends.get(type)

    panel = <End courseId={courseId} taskId={@props.taskId} reloadPractice={@props.reloadTask}/>

  renderSpacer: (data) ->
    <Spacer onNextStep={@props.onNextStep} taskId={@props.taskId}/>

  # add render methods for different panel types as needed here
  render: ->
    # get the crumb that matches the current state
    {crumb} = @props
    # crumb.type is one of ['intro', 'step', 'end']
    renderPanelMethod = camelCase "render-#{crumb.type}"

    throw new Error("BUG: panel #{crumb.type} does not have a render method") unless @[renderPanelMethod]?
    panel = @[renderPanelMethod]?(crumb.data)
