# coffeelint: disable=no_empty_functions

React = require 'react/addons'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

PracticeButton = require '../buttons/practice-button'
BindStoreMixin = require '../bind-store-mixin'

TaskStep = require './index'
{CourseStore} = require '../../flux/course'
{TaskStore} = require '../../flux/task'
{TaskStepStore} = require '../../flux/task-step'
{CardBody, PinnableFooter} = require '../pinned-header-footer-card/sections'
Details = require '../task/details'

ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

# A function to render the status message.
# Shared between the various ending components
renderStatusMessage = (completeSteps, totalSteps) ->
  if completeSteps is totalSteps
    <span>
      <h1>You are done</h1>
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
        <Router.Link
          to='viewGuide'
          params={{courseId}}
          className='btn btn-default'>Return to Flight Path</Router.Link>
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

    stepsList = _.map steps, (step, index) =>
      <TaskStep
        id={step.id}
        goToStep={@goToStep}
        onNextStep={@onNextStep}
        key="task-review-#{step.id}"
        # focus on first problem
        focus={index is 0}
        review={type}
        pinned={false}
        taskId={taskId}
      />

    stepsReview =
      <div className="task task-review-#{type}">
        {label}
        <ReactCSSTransitionGroup transitionName="homework-review-problem">
          {stepsList}
        </ReactCSSTransitionGroup>
        <PinnableFooter>
          <Router.Link
            to='viewStudentDashboard'
            params={{courseId}}
            className='btn btn-primary'>Back to Dashboard</Router.Link>
            <Details task={task} key="task-#{taskId}-details"/>
            <div className='task-title'>{task.title}</div>
        </PinnableFooter>
      </div>

  renderAfterDue: (taskId) ->
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
    </div>

  renderBeforeDue: (taskId) ->
    {courseId} = @props
    completedStepsCount = TaskStore.getCompletedStepsCount(taskId)
    totalStepsCount = TaskStore.getTotalStepsCount(taskId)

    footer = <Router.Link
      to='viewStudentDashboard'
      params={{courseId}}
      className='btn btn-primary'>Back to Dashboard</Router.Link>

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

  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->
    {courseId} = @props
    footer = <Router.Link
      to='viewStudentDashboard'
      params={{courseId}}
      className='btn btn-primary'>Back to Dashboard</Router.Link>

    <div className='task task-completed'>
      <CardBody footer={footer} className='-reading-completed'>
        <div className="completed-message">
          <h1>You Are Done.</h1>
          <h3>Great job completing all the steps</h3>
        </div>
      </CardBody>
    </div>

ends = {task: TaskEnd, homework: HomeworkEnd, practice: PracticeEnd, chapter_practice: PracticeEnd, reading: TaskEnd}

module.exports =
  get: (type) ->
    ends[type] or TaskEnd
