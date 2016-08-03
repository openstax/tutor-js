React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{TaskStore} = require '../../flux/task'
{CardBody, PinnableFooter, ChapterSectionMixin} = require 'shared'
Review = require '../task/review'

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

  render: ->
    {footer, taskId} = @props
    completedSteps = TaskStore.getCompletedSteps taskId
    completedReview = @renderReviewSteps(taskId, completedSteps)

    <div className='task-review -concept-coach-completed'>
      {completedReview}
      <PinnableFooter>
        {footer}
      </PinnableFooter>
    </div>

module.exports = {ConceptCoachEnd}
