# coffeelint: disable=no_empty_functions

React = require 'react'
BS = require 'react-bootstrap'

TutorLink = require '../link'
_ = require 'underscore'

PracticeButton = require '../buttons/practice-button'
BackButton = require '../buttons/back-button'
BindStoreMixin = require '../bind-store-mixin'
StepFooterMixin = require './step-footer-mixin'

TaskStep = require './index'
{CoursePracticeStore} = require '../../flux/practice'
{TaskStore} = require '../../flux/task'
{TaskStepStore} = require '../../flux/task-step'
{CardBody, PinnableFooter} = require 'shared'
Review = require '../task/review'
{ConceptCoachEnd} = require './concept-coach-end'

# A function to render the status message.
# Shared between the various ending components
renderStatusMessage = (completeSteps, totalSteps) ->
  if completeSteps is totalSteps
    <span>
      <h1>You are done.</h1>
      <h3>Great job answering all the questions.</h3>
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
    {type} = TaskStore.get(taskId)

    pageIds = CoursePracticeStore.getCurrentTopics(courseId, taskId)

    fallbackLink =
      to: 'viewPerformanceGuide'
      params: {courseId}
      text: 'Back to Performance Forecast'

    # custom footer for practices
    footer =
      <div className="-#{type}-end">
        <BackButton bsStyle="primary" fallbackLink={fallbackLink} />
      </div>

    completeSteps = TaskStore.getCompletedStepsCount(taskId)
    totalSteps = TaskStore.getTotalStepsCount(taskId)
    <div className='task task-completed'>
      <CardBody footer={footer} className="-#{type}-completed">
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
    windowImpl: React.PropTypes.object

  getInitialState: ->
    scrollPos: 0
  getDefaultProps: ->
    windowImpl: window

  goToStep: ->
  onNextStep: ->
    scrollPos = @props.windowImpl.scrollY
    @setState({scrollPos})

  componentDidUpdate: ->
    @props.windowImpl.scroll(0, @state.scrollPos)

  renderReviewSteps: (taskId, steps, label, type) ->
    {courseId} = @props

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
          key={"task-review-#{type}"}
          focus={type is 'todo'}/>
      </div>

  renderAfterDue: (taskId) ->
    {footer, courseId} = @props

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
    {footer, courseId} = @props
    completedStepsCount = TaskStore.getCompletedStepsCount(taskId)
    totalStepsCount = TaskStore.getTotalStepsCount(taskId)

    if not TaskStore.isFeedbackImmediate(taskId)
      feedback = <ul>
        <li>You can still review and update your answers until the due date.</li>
        <li>Your homework will be automatically turned in on the due date.</li>
      </ul>

    <div className='task task-completed'>
      <CardBody footer={footer} className='-homework-completed'>
        <div className='completed-message'>
          {renderStatusMessage(completedStepsCount, totalStepsCount)}
          {feedback}
          <p className="link-to-forecast">
            <TutorLink to="viewPerformanceGuide" params={{courseId}}>
              View your Performance Forecast
            </TutorLink> to see your progress in the course and get more practice.
          </p>
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
    {courseId} = @props
    <div className='task task-completed'>
      <CardBody className='-reading-completed'>
        <div className="completed-message">
          <h1>You are done.</h1>
          <h3>Great job completing all the steps.</h3>
          <TutorLink
            to='dashboard'
            key='step-end-back'
            params={{courseId}}
            className='btn btn-primary'>
              Back to Dashboard
          </TutorLink>
        </div>
      </CardBody>
    </div>

ends = {
  task: TaskEnd,
  concept_coach: ConceptCoachEnd,
  homework: HomeworkEnd,
  practice: PracticeEnd,
  chapter_practice: PracticeEnd,
  page_practice: PracticeEnd,
  practice_worst_topics: PracticeEnd,
  reading: TaskEnd
}

module.exports =
  get: (type) ->
    ends[type] or TaskEnd
