React = require 'react'
_ = require 'underscore'
{channel} = tasks = require './collection'
api = require '../api'
{Reactive} = require '../reactive'
channelName = 'task'

exercises = {ExerciseStep} = require '../exercise'
breadcrumbs = {Breadcrumbs} = require '../breadcrumbs'

{TaskReview} = require './review'

TaskBase = React.createClass
  displayName: 'TaskBase'
  getInitialState: ->
    {item} = @props

    task: item
    currentStep: 0

  nextStep: ->
    {currentStep} = @state
    @setState(currentStep: currentStep + 1)

  goToStep: (stepIndex) ->
    @setState(currentStep: stepIndex)

  componentWillMount: ->
    exercises.channel.on('leave.*', @nextStep)

  componentWillUnmount: ->
    exercises.channel.off('leave.*', @nextStep)

  componentWillReceiveProps: (nextProps) ->
    {item} = nextProps
    @setState(task: item)

  render: ->
    {task, currentStep} = @state
    return null unless task?

    breadcrumbs = <Breadcrumbs
      {...@props}
      goToStep={@goToStep}
      currentStep={currentStep}/>

    if task.steps[currentStep]?
      panel = <ExerciseStep id={task.steps[currentStep].id} pinned={false}/>
    else if currentStep is task.steps.length
      panel = <TaskReview {...@props}/>

    <div className='concept-coach-task'>
      {breadcrumbs}
      {panel}
    </div>


Task = React.createClass
  displayName: 'Task'
  filter: (props, eventData) ->
    setProps = _.pick(props, 'collectionUUID', 'moduleUUID')
    receivedData = _.pick(eventData.data, 'collectionUUID', 'moduleUUID')

    _.isEqual(setProps, receivedData)

  render: ->
    {collectionUUID, moduleUUID} = @props
    taskId = "#{collectionUUID}/#{moduleUUID}"

    <Reactive
      id={taskId}
      store={tasks}
      channelName={channelName}
      collectionUUID={collectionUUID}
      moduleUUID={moduleUUID}
      fetcher={tasks.fetchByModule}
      filter={@filter}>
      <TaskBase {...@props}/>
    </Reactive>



module.exports = {Task, channel}
