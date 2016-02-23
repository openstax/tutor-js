_ = require 'underscore'
React = require 'react'
camelCase = require 'camelcase'
Router = require 'react-router'
classnames = require 'classnames'

{Details} = require '../task/details'
BrowseTheBook = require '../buttons/browse-the-book'
LateIcon = require '../late-icon'

{ChapterSectionMixin} = require 'openstax-react-components'

{TaskStore} = require '../../flux/task'
{ViewingAsStudentName} = require '../task/viewing-as-student-name'

{StepPanel} = require '../../helpers/policies'

module.exports =

  mixins: [ ChapterSectionMixin ]

  renderTeacherReadOnlyDetails: ({stepId, taskId, courseId, review}) ->

    unless review?.length
      taskDetails = @renderDefaultDetails({stepId, taskId, courseId, review})

      taskDetails = [
        <ViewingAsStudentName
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
      <BrowseTheBook unstyled key={combined} section={combined} onlyShowBrowsable={false}>
        {combined}
      </BrowseTheBook>

    <div key='task-covers' className='task-covers'>
      Reading covers: {sections}
    </div>

  renderDefaultDetails: ({stepId, taskId, courseId, review}) ->
    return null if review?.length

    task = TaskStore.get(taskId)
    {title, sections} = TaskStore.getDetails(taskId)

    taskAbout = <div key='about' className='task-footer-detail'>
      <div className='task-title'>{title}</div>
      {@renderCoversSections(sections) if sections.length}
    </div>

    buildLateMessage = (task, status) ->
      "#{status.how_late} late"

    lateIcon = <LateIcon
      key='step-late'
      task={task}
      buildLateMessage={buildLateMessage}/>

    taskDetails = <Details
      lateStatus={lateIcon}
      key='details'
      task={task}
      className='task-footer-detail'/>

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
      key='step-back'
      params={{courseId}}
      className={custombuttonClasses or defaultButtonClasses}>
        Back to Dashboard
    </Router.Link>

    if panel? and panel is 'teacher-read-only'
      defaultButtonClasses = 'btn btn-default'

      backButton = <Router.Link
        to='viewScores'
        key='step-back'
        params={{courseId}}
        className={custombuttonClasses or defaultButtonClasses}>
          Back to Scores
      </Router.Link>

    backButton

  renderTeacherReadOnlyButtons: ({taskId, courseId, review, panel}) ->
    unless review?.length
      continueButton = @renderContinueButton?() or @props.controlButtons

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
    {sections} = TaskStore.getDetails(taskId)

    className = 'task-footer-details'
    className += ' has-sections' if sections.length

    className

  renderFooter: ({stepId, taskId, courseId, review}) ->
    buttons = @renderButtons({stepId, taskId, courseId, review})
    className = @getFooterClasses({stepId, taskId, courseId, review})

    taskDetails = <div className={className} key='step-footer'>
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
    taskDetails = <div className={className} key='step-end-footer'>
      {@renderTaskDetails({stepId, taskId, courseId, review})}
    </div>

    [
      backButton
      taskDetails
    ]
