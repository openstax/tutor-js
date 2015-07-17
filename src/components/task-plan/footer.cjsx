
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

  saved: ->
    courseId = @props.courseId
    TaskPlanStore.removeChangeListener(@saved)
    @context.router.transitionTo('taskplans', {courseId})

  onDelete: ->
    {id, courseId} = @props
    if confirm('Are you sure you want to delete this?')
      TaskPlanActions.delete(id)
      @context.router.transitionTo('taskplans', {courseId})

  onCancel: ->
    {id, courseId} = @props
    if confirm('Are you sure you want to cancel?')
      TaskPlanActions.reset(id)
      @context.router.transitionTo('taskplans', {courseId})

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
      {publishButton}
      <BS.Button aria-role='close' onClick={@onCancel}>Cancel</BS.Button>
      {saveLink}
      <BS.OverlayTrigger trigger='click' placement='top' overlay={tips} rootClose={true}>
        <BS.Button className="footer-instructions" bsStyle="link">
          <i className="fa fa-info-circle"></i>
        </BS.Button>
      </BS.OverlayTrigger>
      {deleteLink}
    </div>

module.exports = PlanFooter
