React = require 'react'
BS = require 'react-bootstrap'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
AsyncButton = require '../buttons/async-button'
BackButton = require '../buttons/back-button'

PlanFooter = React.createClass
  displayName: 'PlanFooter'
  contextTypes:
    router: React.PropTypes.func
  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    goBackToCalendar: React.PropTypes.func

  getDefaultProps: ->
    goBackToCalendar: =>
      @context.router.transitionTo('taskplans', {courseId})

  getInitialState: ->
    isEditable: TaskPlanStore.isEditable(@props.id)

  saved: ->
    courseId = @props.courseId
    TaskPlanStore.removeChangeListener(@saved)
    @props.goBackToCalendar()

  onDelete: ->
    {id, courseId} = @props
    if confirm('Are you sure you want to delete this?')
      TaskPlanActions.delete(id)
      @props.goBackToCalendar()

  onSave: ->
    @setState({saving: true, publishing: false})
    @props.onSave()

  onPublish: ->
    @setState({publishing: true, saving: false, isEditable: TaskPlanStore.isEditable(@props.id)})
    @props.onPublish()

  onCancel: ->
    @props.onCancel()

  onViewStats: ->
    {id, courseId} = @props
    @context.router.transitionTo('viewStats', {courseId, id})

  render: ->
    {id, courseId, clickedSelectProblem, onPublish, onSave} = @props
    {isEditable} = @state

    plan = TaskPlanStore.get(id)

    saveable = not TaskPlanStore.isPublished(id)
    isWaiting = TaskPlanStore.isSaving(id)
    deleteable = not TaskPlanStore.isNew(id) and not (TaskPlanStore.isOpened(id) and TaskPlanStore.isPublished(id)) and not isWaiting
    isFailed = TaskPlanStore.isFailed(id)

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

    if isEditable
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

      cancelButton =
        <BS.Button aria-role='close' disabled={isWaiting} onClick={@onCancel}>Cancel</BS.Button>

      helpInfo =
        <BS.OverlayTrigger trigger='click' placement='top' overlay={tips} rootClose={true}>
          <BS.Button className="footer-instructions" bsStyle="link">
            <i className="fa fa-info-circle"></i>
          </BS.Button>
        </BS.OverlayTrigger>
    else
      fallbackLink =
        to: 'taskplans'
        params: {courseId}
        text: 'Back to Calendar'

      backButton = <BackButton fallbackLink={fallbackLink} />


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

    <div className='footer-buttons'>
      {publishButton}
      {cancelButton}
      {backButton}
      {saveLink}
      {helpInfo}
      {deleteLink}
    </div>

module.exports = PlanFooter
