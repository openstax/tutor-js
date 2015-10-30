React = require 'react'
Hello = {Breadcrumb} = require 'openstax-react-components'
_ = require 'underscore'

tasks = require './collection'
api = require '../api'

exercises = {ExerciseStep} = require '../exercise'

Breadcrumbs = React.createClass
  displayName: 'Breadcrumbs'
  getInitialState: ->
    {collectionUUID, moduleUUID} = @props
    taskId = "#{collectionUUID}/#{moduleUUID}"

    task: tasks.get(taskId)

  goToStep: (stepIndex) ->
    console.info("goToStep #{stepIndex}")
    @props.goToStep(stepIndex)

  render: ->
    {task} = @state
    {currentStep} = @props

    crumbs = _.map(task.steps, (crumbStep, index) ->
      crumb =
        key: index
        data: crumbStep
        crumb: true
        type: 'step'
    )

    crumbs.push(type: 'end', key: crumbs.length, data: {})

    breadcrumbs = _.map(crumbs, (crumb) =>
      <Breadcrumb
        crumb={crumb}
        step={crumb.data or {}}
        currentStep={currentStep}
        canReview={-> true}
        goToStep={@goToStep}/>
    )

    <div className='task-homework'>
      <div className='task-breadcrumbs'>
        {breadcrumbs}
      </div>
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
      <div>
        <Breadcrumbs {...@props} goToStep={@goToStep} currentStep={currentStep}/>
        <ExerciseStep id={task.steps[currentStep].id}/>
      </div>
    else
      null


module.exports = {Task}
