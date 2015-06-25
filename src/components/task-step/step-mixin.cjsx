React = require 'react'
BS = require 'react-bootstrap'
camelCase = require 'camelcase'

{CardBody} = require '../pinned-header-footer-card/sections'
Details = require '../task/details'
AsyncButton = require '../buttons/async-button'
{ViewingAsStudentNameShell} = require '../task/viewing-as-student-name'

{TaskStore} = require '../../flux/task'
{TaskStepStore} = require '../../flux/task-step'

{StepPanel} = require '../../helpers/policies'

module.exports =

  renderContinueButton: ->
    isWaiting = TaskStepStore.isLoading(@props.id)
    isSaving = TaskStepStore.isSaving(@props.id)
    isFailed = TaskStepStore.isFailed(@props.id)

    <AsyncButton
      bsStyle='primary'
      className='-continue'
      onClick={@onContinue}
      disabled={not @isContinueEnabled()}
      isWaiting={isWaiting}
      isFailed={isFailed}
      >
      {@continueButtonText?() or 'Continue'}
    </AsyncButton>


  renderTeacherReadOnlyDetails: ->
    {review, taskId, courseId} = @props
    task = TaskStore.get(taskId)

    unless review?.length
      taskDetails = [
          <Details task={task} key="task-#{taskId}-details"/>
          <div className='task-title'>{task.title}</div>
          <ViewingAsStudentNameShell courseId={courseId} taskId={taskId} />
        ]

    taskDetails

  renderTaskDetails: ->
    {review, taskId} = @props
    task = TaskStore.get(taskId)

    unless review?.length
      taskDetails = [
          <Details task={task} key="task-#{taskId}-details"/>
          <div className='task-title'>{task.title}</div>
        ]

    taskDetails

  render: ->
    {pinned, courseId, id} = @props
    panel = StepPanel.getPanel(id)

    showFooter = true
    showFooter = @showFooter() if @showFooter?

    if showFooter
      footer = @renderFooterButtons?() or @renderContinueButton()
      renderDetailsForPanelMethod = camelCase "render-#{panel}-details"
      taskDetails = @[renderDetailsForPanelMethod]?() or @renderTaskDetails()

      footer = <div>
        {footer}
        {taskDetails}
      </div>

    {pinned} = @props
    <CardBody className='task-step' footer={footer} pinned={pinned}>
      {@renderBody()}
      {@renderGroup?()}
    </CardBody>
