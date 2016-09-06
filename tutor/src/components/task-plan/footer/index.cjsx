React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
{PlanPublishStore, PlanPublishActions} = require '../../../flux/plan-publish'
PlanHelper = require '../../../helpers/plan'
{AsyncButton, SuretyGuard} = require 'shared'
TutorDialog = require '../../tutor-dialog'
BackButton = require '../../buttons/back-button'

HelpTooltip = require './help-tooltip'

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
    publishing: TaskPlanStore.isPublishing(@props.id)
    saving: TaskPlanStore.isSaving(@props.id)

  checkPublishingStatus: (published) ->
    planId = @props.id
    if published.for is planId
      planStatus =
        publishing: PlanPublishStore.isPublishing(planId)

      @setState(planStatus)
      if PlanPublishStore.isDone(planId)
        PlanPublishStore.removeAllListeners("progress.#{planId}.*", @checkPublishingStatus)
        TaskPlanActions.load(planId)

  componentWillMount: ->
    plan = TaskPlanStore.get(@props.id)
    publishState = PlanHelper.subscribeToPublishing(plan, @checkPublishingStatus)

    @setState(publishing: publishState.isPublishing)

  saved: ->
    courseId = @props.courseId
    TaskPlanStore.removeChangeListener(@saved)
    @props.goBackToCalendar()

  onDelete: ->
    {id, courseId} = @props
    TaskPlanActions.delete(id)
    @props.goBackToCalendar()

  onSave: ->
    @setState({saving: true, publishing: false})
    @props.onSave()

  onPublish: ->
    @setState({publishing: true, saving: false, isEditable: TaskPlanStore.isEditable(@props.id)})
    @props.onPublish()

  onViewStats: ->
    {id, courseId} = @props
    @context.router.transitionTo('viewStats', {courseId, id})

  render: ->
    {id, courseId, clickedSelectProblem, onPublish, onSave, onCancel, getBackToCalendarParams} = @props
    {isEditable} = @state

    plan = TaskPlanStore.get(id)

    saveable = not (TaskPlanStore.isPublished(id) or TaskPlanStore.isPublishing(id))
    isWaiting = TaskPlanStore.isSaving(id) or TaskPlanStore.isPublishing(id) or TaskPlanStore.isDeleteRequested(id)
    deleteable = not TaskPlanStore.isNew(id) and not isWaiting
    isFailed = TaskPlanStore.isFailed(id)

    if isEditable

      publishButtonProps =
        bsStyle:  'primary'
        className:  '-publish'
        isFailed: isFailed
        disabled: isWaiting

      if TaskPlanStore.isPublished(id)
        saveButton = <AsyncButton {...publishButtonProps}
          onClick={@onSave}
          isJob={true}
          isWaiting={isWaiting and (@state.saving or @state.publishing)}
          waitingText='Saving…'>
          Save
        </AsyncButton>
      else
        publishButton = <AsyncButton {...publishButtonProps}
          onClick={@onPublish}
          isWaiting={isWaiting and @state.publishing}
          waitingText='Publishing…'
          isJob={true}>
          Publish
        </AsyncButton>

      cancelButton =
        <BS.Button aria-role='close' disabled={isWaiting} onClick={onCancel}>Cancel</BS.Button>

    else
      backToCalendarParams = getBackToCalendarParams()
      backButton = <Router.Link
        {...backToCalendarParams}
        className='btn btn-default'>
          Back to Calendar
      </Router.Link>


    if deleteable
      if TaskPlanStore.isPublished(id)
        message = 'Some students may have started work on this assignment. Are you sure you want to delete?'
      else
        message = 'Are you sure you want to delete this draft?'

      deleteLink =
        <SuretyGuard
          onConfirm={@onDelete}
          okButtonLabel='Yes'
          placement='top'
          message={message}
        >
          <AsyncButton
            className='delete-link pull-right'
            isWaiting={TaskPlanStore.isDeleting(id)}
            isFailed={isFailed}
            waitingText='Deleting…'
          >
            <i className="fa fa-trash"></i> Delete Assignment
          </AsyncButton>
        </SuretyGuard>

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
      {saveButton}
      {publishButton}
      {cancelButton}
      {backButton}
      {saveLink}
      <HelpTooltip isEditable={@state.isEditable} />
      {deleteLink}
    </div>

module.exports = PlanFooter
