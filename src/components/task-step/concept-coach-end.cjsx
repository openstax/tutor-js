React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{TaskStore} = require '../../flux/task'
{CardBody, PinnableFooter, ChapterSectionMixin} = require 'openstax-react-components'
Review = require '../task/review'

# TODO: will no longer need this when we move coach into this repo.
ConceptCoachReviewControls = React.createClass
  displayName: 'ConceptCoachReviewControls'
  mixins: [ ChapterSectionMixin ]
  render: ->
    {taskId} = @props
    details = TaskStore.getDetails(taskId)
    current = _.map details.sections, @sectionFormat

    <BS.ButtonGroup justified className='concept-coach-task-review-controls'>
      <BS.Button disabled bsSize='large'>
        <i className='fa fa-caret-left'></i>Return to {current}</BS.Button>
      <BS.Button disabled bsSize='large' bsStyle='primary'>
        Continue to …<i className='fa fa-caret-right'></i></BS.Button>
    </BS.ButtonGroup>


ConceptCoachEnd = React.createClass
  displayName: 'TaskEnd'
  renderReviewSteps: (taskId, steps, type = 'completed') ->
    {courseId} = @props

    stepsReview =
      <div className="task task-review-#{type}">
        <Review
          steps={steps}
          taskId={taskId}
          courseId={courseId}
          goToStep={@goToStep}
          onNextStep={@onNextStep}
          review={type}
          key={"task-review-#{type}"}
          focus={type is 'todo'}/>
      </div>

  isDone: ->
    {taskId} = @props
    incompleteSteps = TaskStore.getIncompleteSteps taskId
    _.isEmpty(incompleteSteps)

  renderStatusMessage: ->
    {taskId} = @props

    doneMessage = 'You\'re done.'
    <CardBody className='completed-message'>
      <div className='task-status-message'>
        <h1>{doneMessage}</h1>
      </div>
      <ConceptCoachReviewControls taskId={taskId}/>
      <p>or review your work below.</p>
    </CardBody>

  renderBottomControl: ->
    {taskId} = @props

    <CardBody className='completed-message'>
      <ConceptCoachReviewControls taskId={taskId}/>
    </CardBody>

  render: ->
    {footer, taskId} = @props
    completedSteps = TaskStore.getCompletedSteps taskId
    completedReview = @renderReviewSteps(taskId, completedSteps)

    <div className='task-review -concept-coach-completed'>
      {@renderStatusMessage() if @isDone()}
      {completedReview}
      {@renderBottomControl() if @isDone()}
      <PinnableFooter>
        {footer}
      </PinnableFooter>
    </div>

module.exports = {ConceptCoachReviewControls, ConceptCoachEnd}
