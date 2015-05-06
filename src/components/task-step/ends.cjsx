# coffeelint: disable=no_empty_functions

React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

PracticeButton = require '../practice-button'
BindStoreMixin = require '../bind-store-mixin'

TaskStep = require './index'
{TaskStore} = require '../../flux/task'
{TaskStepStore} = require '../../flux/task-step'

PracticeEnd = React.createClass
  displayName: 'PracticeEnd'

  propTypes:
    courseId: React.PropTypes.any.isRequired
    taskId: React.PropTypes.any.isRequired
    reloadPractice: React.PropTypes.func.isRequired

  render: ->
    {courseId, taskId, reloadPractice} = @props

    footer =
      <div className='-practice-end'>
        <PracticeButton
          courseId={courseId}
          loadedTaskId={taskId}
          reloadPractice={reloadPractice}
          forceCreate={true}>
          Do more practice
        </PracticeButton>
        <Router.Link
          to='viewStudentDashboard'
          params={{courseId}}
          className='btn btn-primary'>Back to Dashboard</Router.Link>
      </div>

    <div className='task task-completed'>
      <BS.Panel bsStyle='default' footer={footer} className='-practice-completed'>
        <h1>You earned a star!</h1>
        <h3>Great Job!</h3>
      </BS.Panel>
    </div>

HomeworkEnd = React.createClass
  displayName: 'HomeworkEnd'

  mixins: [BindStoreMixin]

  bindStore: TaskStepStore

  propTypes:
    courseId: React.PropTypes.any.isRequired
    taskId: React.PropTypes.any.isRequired

  # _addListener: ->
  #   TaskStepStore.addChangeListener(@_update)

  # _removeListener: ->
  #   TaskStepStore.removeChangeListener(@_update)

  # componentWillMount:   -> @_addListener()
  # componentWillUnmount: -> @_removeListener()
  # componentWillUpdate: -> @_removeListener()
  # componentDidUpdate:  -> @_addListener()
  # _update: -> @setState({})

  goToStep: ->
  onNextStep: ->

  renderReviewSteps: (steps, label, type) ->
    stepsList = _.map steps, (step, index) =>
      <TaskStep
        id={step.id}
        goToStep={@goToStep}
        onNextStep={@onNextStep}
        key="task-review-#{step.id}"
        # focus on first problem
        focus={index is 0}
      />

    stepsReview =
      <div className="task task-review-#{type}">
        {label}
        {stepsList}
      </div>

  renderAfterDue: (taskId) ->
    completedSteps = TaskStore.getCompletedSteps taskId
    incompleteSteps = TaskStore.getIncompleteSteps taskId
    totalSteps = TaskStore.getTotalStepsCount taskId

    if completedSteps.length
      completedLabel = <h1>Problems Review</h1>
      completedReview = @renderReviewSteps(completedSteps, completedLabel, 'completed')

    if incompleteSteps.length
      todoLabel =
        <h1>Problems To Do <small>{incompleteSteps.length} remaining</small></h1>
      todoReview = @renderReviewSteps(incompleteSteps, todoLabel, 'todo')

    <div className='task-review -homework-completed'>
      {todoReview}
      {completedReview}
    </div>

  renderBeforeDue: (taskId) ->
    {courseId} = @props
    completeSteps = TaskStore.getCompletedStepsCount(taskId)
    totalSteps = TaskStore.getTotalStepsCount(taskId)

    congratsMessage = <h1>It looks like you are done!</h1> if completeSteps is totalSteps

    footer = <Router.Link
      to='viewStudentDashboard'
      params={{courseId}}
      className='btn btn-primary'>Back to Dashboard</Router.Link>

    <div className='task task-completed'>
      <BS.Panel bsStyle='default' footer={footer} className='-homework-completed'>
        {congratsMessage}
        <h3>You have answered {completeSteps} of {totalSteps} questions.</h3>
        <ul>
          <li>You can still review and update your answers until the due date.</li>
          <li>Your homework will be automatically turned in on the due date.</li>
        </ul>
      </BS.Panel>
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
    courseId: React.PropTypes.any.isRequired

  render: ->
    {courseId} = @props
    footer = <Router.Link
      to='viewStudentDashboard'
      params={{courseId}}
      className='btn btn-primary'>Back to Dashboard</Router.Link>

    <div className='task task-completed'>
      <BS.Panel bsStyle='default' footer={footer} className='-reading-completed'>
        <h1>You Are Done.</h1>
        <h3>Great Job!</h3>
      </BS.Panel>
    </div>

ends = {task: TaskEnd, homework: HomeworkEnd, practice: PracticeEnd, reading: TaskEnd}

module.exports =
  get: (type) ->
    ends[type] or TaskEnd
