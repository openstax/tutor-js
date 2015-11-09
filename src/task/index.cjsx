React = require 'react'
_ = require 'underscore'
{channel} = tasks = require './collection'
api = require '../api'

exercises = {ExerciseStep} = require '../exercise'
breadcrumbs = {Breadcrumbs} = require '../breadcrumbs'

TaskReview = React.createClass
  displayName: 'TaskReview'
  getInitialState: ->
    {collectionUUID, moduleUUID} = @props
    taskId = "#{collectionUUID}/#{moduleUUID}"

    completeSteps: tasks.getCompleteSteps(taskId)
    incompleteSteps: tasks.getIncompleteSteps(taskId)

  render: ->
    {completeSteps, incompleteSteps} = @state

    completeStepsReview = _.map completeSteps, (step) ->
      <ExerciseStep
        id={step.id}
        pinned={false}
        review='completed'
        focus={false}/>

    incompleteStepsReview = _.map incompleteSteps, (step, index) ->
      # onStepCompleted need to set
      <ExerciseStep
        id={step.id}
        pinned={false}
        review='review'
        focus={index is 0}/>

    <div className='concept-coach-task-review'>
      <h1>To Do</h1>
      {incompleteStepsReview}
      <h1>Completed</h1>
      {completeStepsReview}
    </div>


Task = React.createClass
  displayName: 'Task'
  getInitialState: ->
    {collectionUUID, moduleUUID} = @props
    taskId = "#{collectionUUID}/#{moduleUUID}"

    task: tasks.get(taskId)
    currentStep: 0

  update: (eventData) ->
    {collectionUUID, moduleUUID} = @props
    taskId = "#{collectionUUID}/#{moduleUUID}"

    task = tasks.get(taskId)
    @setState(task: task)

  nextStep: ->
    {currentStep} = @state

    @setState(currentStep: currentStep + 1)

  goToStep: (stepIndex) ->
    @setState(currentStep: stepIndex)

  componentWillMount: ->
    {collectionUUID, moduleUUID} = @props
    taskId = "#{collectionUUID}/#{moduleUUID}"

    tasks.fetchByModule(collectionUUID, moduleUUID)
    tasks.channel.on("load.#{taskId}", @update)
    exercises.channel.on('leave.*', @nextStep)

  componentWillUnmount: ->
    {collectionUUID, moduleUUID} = @props
    taskId = "#{collectionUUID}/#{moduleUUID}"

    tasks.channel.off("load.#{taskId}", @update)
    exercises.channel.off('leave.*', @nextStep)

  render: ->
    {task, currentStep} = @state
    if task?
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
    else
      # TODO finesse
      null


module.exports = {Task, channel}
