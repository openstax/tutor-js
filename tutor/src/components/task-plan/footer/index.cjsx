React = require 'react'
BS = require 'react-bootstrap'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'
{PlanPublishStore} = require '../../../flux/plan-publish'
PlanHelper = require '../../../helpers/plan'

HelpTooltip  = require './help-tooltip'
SaveButton   = require './save-button'
CancelButton = require './cancel-button'
BackButton   = require './back-button'
DraftButton  = require './save-as-draft'
DeleteLink   = require './delete-link'

PlanFooter = React.createClass
  displayName: 'PlanFooter'
  contextTypes:
    router: React.PropTypes.func
  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    goBackToCalendar: React.PropTypes.func
    isVisibleToStudents: React.PropTypes.bool.isRequired

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
    {id} = @props
    plan = TaskPlanStore.get(id)
    isSaveable  = not (TaskPlanStore.isPublished(id) or TaskPlanStore.isPublishing(id))
    isWaiting   = TaskPlanStore.isSaving(id) or TaskPlanStore.isPublishing(id) or TaskPlanStore.isDeleteRequested(id)
    isFailed    = TaskPlanStore.isFailed(id)
    isPublished = TaskPlanStore.isPublished(id)

    <div className='footer-buttons'>
      <SaveButton
        onSave={@onSave}
        onPublish={@props.onPublish}
        isWaiting={isWaiting}
        isSaving={@state.saving}
        isEditable={@state.isEditable}
        isPublishing={@state.publishing}
        isPublished={isPublished}
      />
      <CancelButton
        isWaiting={isWaiting}
        onClick={@props.onCancel}
        isEditable={@state.isEditable}
      />
      <BackButton
        isEditable={@state.isEditable}
        getBackToCalendarParams={@props.getBackToCalendarParams}
      />
      <DraftButton
        isSavable={isSaveable}
        onClick={@onSave}
        isWaiting={isWaiting and @state.saving}
        isFailed={isFailed}
      />
      <HelpTooltip
        isPublished={isPublished}
      />
      <DeleteLink
        isNew={TaskPlanStore.isNew(id)}
        onClick={@onDelete}
        isFailed={isFailed}
        isVisibleToStudents={@props.isVisibleToStudents}
        isWaiting={TaskPlanStore.isDeleting(id)}
        isPublished={isPublished}
      />
    </div>

module.exports = PlanFooter
