React = require 'react'
BS = require 'react-bootstrap'


{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
{PlanPublishStore, PlanPublishActions} = require '../../../flux/plan-publish'
PlanHelper = require '../../../helpers/plan'
{AsyncButton, SuretyGuard} = require 'shared'
TutorDialog = require '../../tutor-dialog'


HelpTooltip  = require './help-tooltip'
SaveButton   = require './save-button'
CancelButton = require './cancel-button'
BackButton   = require './back-button'

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
    {id, courseId, clickedSelectProblem, onPublish} = @props
    {isEditable} = @state

    plan = TaskPlanStore.get(id)

    saveable = not (TaskPlanStore.isPublished(id) or TaskPlanStore.isPublishing(id))
    isWaiting = TaskPlanStore.isSaving(id) or TaskPlanStore.isPublishing(id) or TaskPlanStore.isDeleteRequested(id)
    deleteable = not TaskPlanStore.isNew(id) and not isWaiting
    isFailed = TaskPlanStore.isFailed(id)

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
      <SaveButton
        onSave={@onSave}
        onPublish={@onPublish}
        isWaiting={isWaiting}
        isSaving={@state.saving}
        isSaving={@state.isSaving}
        isEditable={@state.isEditable}
        isPublishing={@state.publishing}
        isPublished={TaskPlanStore.isPublished(id)}
      />
      <CancelButton
        isWaiting={isWaiting}
        onClick={@props.onCancel}
        isEditable={@state.isEditable}
      />
      <BackButton getBackToCalendarParams={@props.getBackToCalendarParams} />

      {saveLink}
      <HelpTooltip isEditable={@state.isEditable} isPublished={TaskPlanStore.isPublished(id)} />
      {deleteLink}
    </div>

module.exports = PlanFooter
