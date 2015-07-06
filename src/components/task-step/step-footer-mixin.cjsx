_ = require 'underscore'
React = require 'react'
camelCase = require 'camelcase'
Router = require 'react-router'

Details = require '../task/details'
BrowseTheBook = require '../buttons/browse-the-book'
ChapterSectionMixin = require '../chapter-section-mixin'

{TaskStore} = require '../../flux/task'
{ViewingAsStudentNameShell} = require '../task/viewing-as-student-name'

{StepPanel} = require '../../helpers/policies'

module.exports =

  mixins: [ ChapterSectionMixin ]

  renderTeacherReadOnlyDetails: ({taskId, courseId, review}) ->

    unless review?.length
      taskDetails = @renderDefaultDetails({taskId, courseId, review})

      taskDetails = [
        taskDetails
        <ViewingAsStudentNameShell courseId={courseId} taskId={taskId} />
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

  renderDefaultDetails: ({taskId, courseId, review}) ->
    return null if review?.length

    task = TaskStore.get(taskId)
    sections = TaskStore.getRelatedSections(taskId)
    className = "details"
    className += ' has-sections' if sections.length
    <div key="details" className={className}>
      {@renderCoversSections(sections) if sections.length}
      <Details task={task} />
      <div className='task-title'>{task.title}</div>
    </div>


  renderTaskDetails: ({stepId, taskId, courseId, review}) ->
    panel = StepPanel.getPanel(stepId)
    renderDetailsForPanelMethod = camelCase "render-#{panel}-details"

    @[renderDetailsForPanelMethod]?({taskId, courseId, review}) or @renderDefaultDetails({taskId, courseId, review})

  renderBackButton: ({taskId, courseId, review, panel}, custombuttonClasses) ->
    defaultButtonClasses = 'btn btn-primary'

    backButton = <Router.Link
      to='viewStudentDashboard'
      key='back-button'
      params={{courseId}}
      className={custombuttonClasses or defaultButtonClasses}>
        Back to Dashboard
    </Router.Link>

    if panel? and panel is 'teacher-read-only'
      defaultButtonClasses = 'btn btn-default'

      backButton = <Router.Link
        to='viewPerformance'
        key='back-button'
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

  renderDefaultButtons: ->
    @renderContinueButton?()

  renderButtons: ({stepId, taskId, courseId, review}) ->
    panel = StepPanel.getPanel(stepId)
    renderButtonsForPanelMethod = camelCase "render-#{panel}-buttons"

    @renderFooterButtons?() or @[renderButtonsForPanelMethod]?({taskId, courseId, review, panel}) or @renderDefaultButtons()




  renderFooter: ({stepId, taskId, courseId, review, buttons, taskDetails}) ->
    buttons ?= @renderButtons({stepId, taskId, courseId, review})
    taskDetails ?= @renderTaskDetails({stepId, taskId, courseId, review})
    <div className="footer">
      <div className="navigation">
        {buttons}
      </div>
      {taskDetails}
    </div>


  renderEndFooter: ({stepId, taskId, courseId, review}) ->
    panel = StepPanel.getPanel(stepId)
    buttons = [@renderBackButton({taskId, courseId, review, panel}, 'btn btn-primary')]
    @renderFooter({stepId, taskId, courseId, review, buttons})
