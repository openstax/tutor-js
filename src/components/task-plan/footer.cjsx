
React = require 'react'
BS = require 'react-bootstrap'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
AsyncButton = require '../buttons/async-button'

PlanFooter = React.createClass
  displayName: 'PlanFooter'
  contextTypes:
    router: React.PropTypes.func
  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    clickedSelectProblem: React.PropTypes.func

  saved: ->
    courseId = @props.courseId
    TaskPlanStore.removeChangeListener(@saved)
    @context.router.transitionTo('taskplans', {courseId})

  onDelete: ->
    {id} = @props
    if confirm('Are you sure you want to delete this?')
      TaskPlanActions.delete(id)
      @context.router.transitionTo('dashboard')

  onCancel: ->
    {id} = @props
    if confirm('Are you sure you want to cancel?')
      TaskPlanActions.reset(id)
      @context.router.transitionTo('dashboard')

  onViewStats: ->
    {id, courseId} = @props
    @context.router.transitionTo('viewStats', {courseId, id})

  render: ->
    {id, courseId, clickedSelectProblem, onPublish, onSave} = @props

    plan = TaskPlanStore.get(id)

    saveable = not TaskPlanStore.isPublished(id)
    deleteable = not TaskPlanStore.isNew(id) and not TaskPlanStore.isOpened(id)
    isWaiting = TaskPlanStore.isSaving(id)
    isFailed = TaskPlanStore.isFailed(id)

    publishButton =
        <AsyncButton
          bsStyle='primary'
          className='-publish'
          onClick={onPublish}
          isWaiting={isWaiting}
          isFailed={isFailed}
          waitingText='Publishing…'
          >
          {'Publish'}
        </AsyncButton>

    if deleteable
      deleteLink = <a className='delete-link pull-right' onClick={@onDelete}>
        <i className="fa fa-trash"></i> Delete Assignment</a>

    if saveable
      saveLink =
          <AsyncButton
            className='-save'
            onClick={onSave}
            isWaiting={isWaiting}
            isFailed={isFailed}
            waitingText='Saving…'
            >
            {'Save as Draft'}
          </AsyncButton>

    hasExercises = TaskPlanStore.getExercises(id)?.length
    if TaskPlanStore.isHomework(id) and not TaskPlanStore.isVisibleToStudents(id) and not hasExercises
      publishButton = null
      saveLink = null
      selectProblems = <BS.Button
        bsStyle='primary'
        className='-select-problems'
        onClick={clickedSelectProblem}>Select Problems
      </BS.Button>

    tips = <BS.Popover>
      <p>
        <strong>Publish</strong> will make the assignment visible to students on the open date.
        If open date is today, it will be available immediately.
      </p>
      <p>
        <strong>Cancel</strong> will discard all changes and return to the calendar.
      </p>
      <p>
        <strong>Save as draft</strong> will add the assignment to the teacher calendar only.
        It will not be visible to students, even if the open date has passed.
      </p>
    </BS.Popover>

    <div className='footer-buttons'>
      {selectProblems}
      {publishButton}
      <BS.Button aria-role='close' onClick={@onCancel}>Cancel</BS.Button>
      {saveLink}
      <BS.OverlayTrigger trigger='click' placement='top' overlay={tips} rootClose={true}>
        <i className="fa fa-info-circle" onClick={@toggleTips}></i>
      </BS.OverlayTrigger>
      {deleteLink}
    </div>

module.exports = PlanFooter
