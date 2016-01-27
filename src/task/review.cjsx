React = require 'react'
_ = require 'underscore'
tasks = require './collection'

{ExerciseStep} = require '../exercise'
{ExerciseButton, ContinueToBookLink} = require '../buttons'

TaskReview = React.createClass
  displayName: 'TaskReview'

  propTypes:
    moduleUUID:     React.PropTypes.string.isRequired
    collectionUUID: React.PropTypes.string.isRequired

  getInitialState: ->
    @getSteps(@props)

  componentWillMount: ->
    {collectionUUID, moduleUUID} = @props
    tasks.fetchByModule({collectionUUID, moduleUUID})

  componentWillReceiveProps: (nextProps) ->
    @setState(@getSteps(nextProps))

  getSteps: (props) ->
    {taskId} = props
    completeSteps: tasks.getCompleteSteps(taskId)
    incompleteSteps: tasks.getIncompleteSteps(taskId)

  render: ->
    {completeSteps, incompleteSteps} = @state
    {status, taskId, moduleUUID} = @props

    if _.isEmpty(completeSteps)
      completeStepsReview = <div className='card-body'>
        <h3>Exercise to see Review</h3>
        <ExerciseButton onClick={_.partial(@props.goToStep, 0)}/>
      </div>
    else
      completeStepsReview = _.map completeSteps, (step) ->
        <ExerciseStep
          id={step.id}
          key={step.id}
          pinned={false}
          review='completed'
          focus={false}
          taskId={taskId}
          allowKeyNext={false}/>

    if _.isEmpty(incompleteSteps)
      completedMessage = <div className='review-continue-to-book'>
        <h2>You're done.</h2>
        <ContinueToBookLink moduleUUID={moduleUUID} taskId={taskId}/>
      </div>

    <div className='concept-coach-task-review'>
      {completedMessage}
      {completeStepsReview}
    </div>

module.exports = {TaskReview}
