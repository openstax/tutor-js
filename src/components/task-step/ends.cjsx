# coffeelint: disable=no_empty_functions

React = require 'react/addons'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

PracticeButton = require '../buttons/practice-button'
BackButton = require '../buttons/back-button'
BindStoreMixin = require '../bind-store-mixin'
StepFooterMixin = require './step-footer-mixin'

TaskStep = require './index'
{CourseStore} = require '../../flux/course'
{TaskStore} = require '../../flux/task'
{TaskStepStore} = require '../../flux/task-step'
{CardBody, PinnableFooter} = require '../pinned-header-footer-card/sections'
Review = require '../task/review'

# A function to render the status message.
# Shared between the various ending components
renderStatusMessage = (completeSteps, totalSteps) ->
  if completeSteps is totalSteps
    <span>
      <h1>You are done.</h1>
      <h3>Great job answering all the questions</h3>
    </span>
  else
    <h3>You have answered {completeSteps} of {totalSteps} questions.</h3>

PracticeEnd = React.createClass
  displayName: 'PracticeEnd'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired
    reloadPractice: React.PropTypes.func.isRequired

  render: ->
    {courseId, taskId, reloadPractice} = @props

    pageIds = CourseStore.getPracticePageIds(courseId)

    fallbackLink =
      to: 'viewGuide'
      params: {courseId}
      text: 'Back to Learning Guide'

    backButton = <BackButton fallbackLink={fallbackLink} />

    # custom footer for practices
    footer =
      <div className='-practice-end'>
        <PracticeButton
          courseId={courseId}
          loadedTaskId={taskId}
          reloadPractice={reloadPractice}
          pageIds={pageIds}
          forceCreate={true}>
          Do more practice
        </PracticeButton>
        {backButton}
      </div>

    completeSteps = TaskStore.getCompletedStepsCount(taskId)
    totalSteps = TaskStore.getTotalStepsCount(taskId)
    <div className='task task-completed'>
      <CardBody footer={footer} className='-practice-completed'>
        <div className='completed-message'>
          {renderStatusMessage(completeSteps, totalSteps)}
        </div>
      </CardBody>
    </div>

HomeworkEnd = React.createClass
  displayName: 'HomeworkEnd'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired

  goToStep: ->
  onNextStep: ->
    @setState({})

  renderReviewSteps: (taskId, steps, label, type) ->
    {courseId} = @props
    task = TaskStore.get(taskId)

    stepsReview =
      <div className="task task-review-#{type}">
        {label}
        <Review
          steps={steps}
          taskId={taskId}
          courseId={courseId}
          goToStep={@goToStep}
          onNextStep={@onNextStep}
          review={type}
          focus={type is 'todo'}/>
      </div>

  renderAfterDue: (taskId) ->
    {footer} = @props

    completedSteps = TaskStore.getCompletedSteps taskId
    incompleteSteps = TaskStore.getIncompleteSteps taskId
    totalStepsCount = TaskStore.getTotalStepsCount taskId
    completedLabel = null
    todoLabel = null

    if completedSteps.length
      completedLabel = <h1>Problems Review</h1>

    if incompleteSteps.length
      todoLabel =
        <h1>Problems To Do <small>{incompleteSteps.length} remaining</small></h1>

    completedReview = @renderReviewSteps(taskId, completedSteps, completedLabel, 'completed')
    todoReview = @renderReviewSteps(taskId, incompleteSteps, todoLabel, 'todo')

    <div className='task-review -homework-completed'>
      <CardBody>
        <div className='completed-message'>
          <div className='task-status-message'>
            {renderStatusMessage(completedSteps.length, totalStepsCount)}
          </div>
        </div>
      </CardBody>
      {todoReview}
      {completedReview}
      <PinnableFooter>
        {footer}
      </PinnableFooter>
    </div>

  renderBeforeDue: (taskId) ->
    {footer} = @props
    completedStepsCount = TaskStore.getCompletedStepsCount(taskId)
    totalStepsCount = TaskStore.getTotalStepsCount(taskId)

    <div className='task task-completed'>
      <CardBody footer={footer} className='-homework-completed'>
        <div className='completed-message'>
          {renderStatusMessage(completedStepsCount, totalStepsCount)}
          <ul>
            <li>You can still review and update your answers until the due date.</li>
            <li>Your homework will be automatically turned in on the due date.</li>
          </ul>
        </div>
      </CardBody>
    </div>

  render: ->
    {taskId} = @props
    isTaskPastDue = TaskStore.isTaskPastDue(taskId)

    if isTaskPastDue
      @renderAfterDue taskId
    else
      @renderBeforeDue taskId

TaskEnd = React.createClass
  displayName: 'TaskEnd'
  render: ->
    {footer} = @props

    <div className='task task-completed'>
      <CardBody footer={footer} className='-reading-completed'>
        <div className="completed-message">
          <h1>You are done.</h1>
          <h3>Great job completing all the steps</h3>
        </div>
      </CardBody>
    </div>

ends = {task: TaskEnd, homework: HomeworkEnd, practice: PracticeEnd, chapter_practice: PracticeEnd, reading: TaskEnd}

module.exports =
  get: (type) ->
    ends[type] or TaskEnd
