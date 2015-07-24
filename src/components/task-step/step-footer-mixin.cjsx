_ = require 'underscore'
React = require 'react'
camelCase = require 'camelcase'
Router = require 'react-router'

Details = require '../task/details'
BrowseTheBook = require '../buttons/browse-the-book'
LateIcon = require '../late-icon'

ChapterSectionMixin = require '../chapter-section-mixin'

{TaskStore} = require '../../flux/task'
{ViewingAsStudentNameShell} = require '../task/viewing-as-student-name'

{StepPanel} = require '../../helpers/policies'

module.exports =

  mixins: [ ChapterSectionMixin ]

  renderTeacherReadOnlyDetails: ({stepId, taskId, courseId, review}) ->

    unless review?.length
      taskDetails = @renderDefaultDetails({stepId, taskId, courseId, review})

      taskDetails = [
        <ViewingAsStudentNameShell
          key='viewing-as'
          courseId={courseId}
          taskId={taskId}
          className='task-footer-detail' />
        taskDetails
      ]

    taskDetails

  renderCoversSections: (sections) ->
    sections = _.map sections, (section) =>
      combined = @sectionFormat(section)
      <BrowseTheBook unstyled key={combined} section={combined}>
        {combined}
      </BrowseTheBook>

    <div key='task-covers' className='task-covers'>
      Reading covers: {sections}
    </div>

  renderDefaultDetails: ({stepId, taskId, courseId, review}) ->
    return null if review?.length

    task = TaskStore.get(taskId)
    sections = TaskStore.getRelatedSections(taskId)

    taskAbout = <div key='about' className='task-footer-detail'>
      <div className='task-title'>{task.title}</div>
      {@renderCoversSections(sections) if sections.length}
    </div>

    buildLateMessage = (task, status) ->
      "#{status.how_late} late"

    taskDetails = <Details
      key='details'
      task={task}
      className='task-footer-detail'>
        <LateIcon
          task={task}
          buildLateMessage={buildLateMessage}/>
    </Details>

    [
      taskAbout
      taskDetails
    ]

  renderTaskDetails: ({stepId, taskId, courseId, review}) ->
    panel = StepPanel.getPanel(stepId)
    renderDetailsForPanelMethod = camelCase "render-#{panel}-details"

    @[renderDetailsForPanelMethod]?({stepId, taskId, courseId, review}) or @renderDefaultDetails({stepId, taskId, courseId, review})

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
          Back to Performance Report
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

  renderDefaultButtons: ({taskId, courseId, review, panel}) ->
    @renderContinueButton?() or @renderBackButton({taskId, courseId})

  renderButtons: ({stepId, taskId, courseId, review}) ->
    panel = StepPanel.getPanel(stepId)
    renderButtonsForPanelMethod = camelCase "render-#{panel}-buttons"

    @renderFooterButtons?() or
      @[renderButtonsForPanelMethod]?({taskId, courseId, review, panel}) or
      @renderDefaultButtons({taskId, courseId, review, panel})

  getFooterClasses: ({stepId, taskId, courseId, review}) ->
    sections = TaskStore.getRelatedSections(taskId)

    className = 'task-footer-details'
    className += ' has-sections' if sections.length

    className

  renderFooter: ({stepId, taskId, courseId, review}) ->
    buttons = @renderButtons({stepId, taskId, courseId, review})
    className = @getFooterClasses({stepId, taskId, courseId, review})

    taskDetails = <div className={className}>
      {@renderTaskDetails({stepId, taskId, courseId, review})}
    </div>

    [
      buttons
      taskDetails
    ]

  renderEndFooter: ({stepId, taskId, courseId, review}) ->
    panel = StepPanel.getPanel(stepId)
    className = @getFooterClasses({stepId, taskId, courseId, review})

    backButton = @renderBackButton({taskId, courseId, review, panel}, 'btn btn-primary')
    taskDetails = <div className={className}>
      {@renderTaskDetails({stepId, taskId, courseId, review})}
    </div>

    [
      backButton
      taskDetails
    ]
