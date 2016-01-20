React = require 'react'
_ = require 'underscore'
tasks = require './collection'

{ExerciseStep} = require '../exercise'
{ExerciseButton, ContinueToBookButton} = require '../buttons'

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
    {status, taskId} = @props

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
      continueToBookButton = <ContinueToBookButton bsStyle='primary' className='review-continue-to-book'/>

    <div className='concept-coach-task-review'>
      {completeStepsReview}
      {continueToBookButton}
    </div>

module.exports = {TaskReview}
