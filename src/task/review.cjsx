React = require 'react'
_ = require 'underscore'
tasks = require './collection'

{ExerciseStep} = require '../exercise'

TaskReview = React.createClass
  displayName: 'TaskReview'
  getInitialState: ->
    {collectionUUID, moduleUUID} = @props
    taskId = "#{collectionUUID}/#{moduleUUID}"

    completeSteps: tasks.getCompleteSteps(taskId)
    incompleteSteps: tasks.getIncompleteSteps(taskId)

  componentWillMount: ->
    {collectionUUID, moduleUUID} = @props
    tasks.fetchByModule({collectionUUID, moduleUUID})

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
      <h1>Review</h1>
      {completeStepsReview}
    </div>

module.exports = {TaskReview}
