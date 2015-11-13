React = require 'react'
_ = require 'underscore'
tasks = require './collection'

{ExerciseStep} = require '../exercise'
{ExerciseButton} = require '../buttons'

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
    {status} = @props

    if status is 'loaded' and _.isEmpty(completeSteps)
      completeStepsReview = <div>
        <h3>Exercise to see Review</h3>
        <ExerciseButton onClick={_.partial(@props.goToStep, 0)}/>
      </div>
    else
      completeStepsReview = _.map completeSteps, (step) ->
        <ExerciseStep
          id={step.id}
          pinned={false}
          review='completed'
          focus={false}/>

    <div className='concept-coach-task-review'>
      <h1>Review</h1>
      {completeStepsReview}
    </div>

module.exports = {TaskReview}
