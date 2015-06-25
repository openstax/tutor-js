React = require 'react'
camelCase = require 'camelcase'
Router = require 'react-router'

Details = require '../task/details'
{TaskStore} = require '../../flux/task'
{ViewingAsStudentNameShell} = require '../task/viewing-as-student-name'

{StepPanel} = require '../../helpers/policies'

module.exports =
  renderTeacherReadOnlyDetails: ({taskId, courseId, review}) ->
    task = TaskStore.get(taskId)
    unless review?.length
      taskDetails = [
          <Details task={task} key="task-#{taskId}-details"/>
          <div className='task-title'>{task.title}</div>
          <ViewingAsStudentNameShell courseId={courseId} taskId={taskId} />
        ]

    taskDetails

  renderDefaultDetails: ({taskId, courseId, review}) ->
    task = TaskStore.get(taskId)

    unless review?.length
      taskDetails = [
          <Details task={task} key="task-#{taskId}-details"/>
          <div className='task-title'>{task.title}</div>
        ]

    taskDetails

  renderTaskDetails: ({stepId, taskId, courseId, review}) ->
    panel = StepPanel.getPanel(stepId)
    renderDetailsForPanelMethod = camelCase "render-#{panel}-details"

    @[renderDetailsForPanelMethod]?({taskId, courseId, review}) or @renderDefaultDetails({taskId, courseId, review})

  renderBackButton: ({taskId, courseId, review, panel}, custombuttonClasses) ->
    defaultButtonClasses = 'btn btn-primary'

    backButton = <Router.Link
      to='viewStudentDashboard'
      params={{courseId}}
      className={custombuttonClasses or defaultButtonClasses}>
        Back to Dashboard
    </Router.Link>

    if panel? and panel is 'teacher-read-only'
      defaultButtonClasses = 'btn btn-default'

      backButton = <Router.Link
        to='viewPerformance'
        params={{courseId}}
        className={custombuttonClasses or defaultButtonClasses}>
          Return to Performance Report
      </Router.Link>

    backButton

  renderTeacherReadOnlyButtons: ({taskId, courseId, review, panel}) ->
    unless review?.length
      continueButton = @renderContinueButton?()

      backButtonClasses = 'btn btn-primary'
      backButtonClasses = 'btn btn-default' if continueButton?

      backButton = @renderBackButton({taskId, courseId, review, panel}, backButtonClasses)

    [
      continueButton
      backButton
    ]

  renderDefaultButtons: ->
    @renderContinueButton?()

  renderButtons: ({stepId, taskId, courseId, review}) ->
    panel = StepPanel.getPanel(stepId)
    renderButtonsForPanelMethod = camelCase "render-#{panel}-buttons"

    @renderFooterButtons?() or @[renderButtonsForPanelMethod]?({taskId, courseId, review, panel}) or @renderDefaultButtons()

  renderFooter: ({stepId, taskId, courseId, review}) ->
    buttons = @renderButtons({stepId, taskId, courseId, review})
    taskDetails = @renderTaskDetails({stepId, taskId, courseId, review})

    [
      buttons
      taskDetails
    ]

  renderEndFooter: ({stepId, taskId, courseId, review}) ->
    panel = StepPanel.getPanel(stepId)

    backButton = @renderBackButton({taskId, courseId, review, panel}, 'btn btn-primary')
    taskDetails = @renderTaskDetails({stepId, taskId, courseId, review})

    [
      backButton
      taskDetails
    ]
