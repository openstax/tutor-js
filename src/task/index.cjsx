React = require 'react'
{PinnedHeaderFooterCard} = require 'openstax-react-components'

{channel} = tasks = require './collection'
api = require '../api'

exercises = {ExerciseStep} = require '../exercise'
breadcrumbs = {Breadcrumbs} = require '../breadcrumbs'

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
      breadcrumbs = <Breadcrumbs {...@props} goToStep={@goToStep} currentStep={currentStep}/>

      <PinnedHeaderFooterCard
        forceShy={true}
        fixedOffset={0}
        header={breadcrumbs}
        cardType='task'>
        <ExerciseStep id={task.steps[currentStep].id} pinned={false}/>
      </PinnedHeaderFooterCard>
    else
      null


module.exports = {Task, channel}
