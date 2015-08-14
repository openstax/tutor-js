React = require 'react'
BS = require 'react-bootstrap'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
AsyncButton = require '../buttons/async-button'
TutorDialog = require '../tutor-dialog'

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

  onSave: ->
    @setState({saving: true, publishing: false})
    @props.onSave()

  onPublish: ->
    @setState({publishing: true, saving: false})
    @props.onPublish()

  onCancel: ->
    {id, courseId} = @props

    if not TaskPlanStore.isChanged(id)
      @reset()
    else
      TutorDialog.show(
        title: 'Unsaved Changes'
        body: 'Are you sure you want to cancel?'
      ).then( =>
        @reset()
      )

  reset: ->
    {id, courseId} = @props
    TaskPlanActions.reset(id)
    @context.router.transitionTo('taskplans', {courseId})

  onViewStats: ->
    {id, courseId} = @props
    @context.router.transitionTo('viewStats', {courseId, id})

  render: ->
    {id, courseId, clickedSelectProblem, onPublish, onSave} = @props

    plan = TaskPlanStore.get(id)

    saveable = not TaskPlanStore.isPublished(id)
    isWaiting = TaskPlanStore.isSaving(id)
    deleteable = not TaskPlanStore.isNew(id) and not (TaskPlanStore.isOpened(id) and TaskPlanStore.isPublished(id)) and not isWaiting
    isFailed = TaskPlanStore.isFailed(id)

    publishButton =
        <AsyncButton
          bsStyle='primary'
          className='-publish'
          onClick={@onPublish}
          isWaiting={isWaiting and @state.publishing}
          isFailed={isFailed}
          waitingText='Publishing…'
          disabled={isWaiting}
          >
          {'Publish'}
        </AsyncButton>

    if deleteable
      deleteLink =
        <AsyncButton
          className='delete-link pull-right'
          onClick={@onDelete}
          isWaiting={TaskPlanStore.isDeleting(id)}
          isFailed={isFailed}
          waitingText='Deleting…'
        >
          <i className="fa fa-trash"></i> Delete Assignment
        </AsyncButton>

    if saveable
      saveLink =
          <AsyncButton
            className='-save'
            onClick={@onSave}
            isWaiting={isWaiting and @state.saving}
            isFailed={isFailed}
            waitingText='Saving…'
            disabled={isWaiting}
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
      <BS.Button aria-role='close' disabled={isWaiting} onClick={@onCancel}>Cancel</BS.Button>
      {saveLink}
      <BS.OverlayTrigger trigger='click' placement='top' overlay={tips} rootClose={true}>
        <BS.Button className="footer-instructions" bsStyle="link">
          <i className="fa fa-info-circle"></i>
        </BS.Button>
      </BS.OverlayTrigger>
      {deleteLink}
    </div>

module.exports = PlanFooter
