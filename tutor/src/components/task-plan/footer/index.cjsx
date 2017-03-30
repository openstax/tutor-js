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
{ default: TourAnchor } = require '../../tours/anchor'

PlanFooter = React.createClass
  displayName: 'PlanFooter'
  propTypes:
    id:               React.PropTypes.string.isRequired
    courseId:         React.PropTypes.string.isRequired
    hasError:         React.PropTypes.bool.isRequired
    goBackToCalendar: React.PropTypes.func.isRequired

  getDefaultProps: ->
    isVisibleToStudents: false

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
    saving = @props.onSave()
    @setState({saving: saving, publishing: false})

  onPublish: ->
    publishing = @props.onPublish()
    @setState({publishing: publishing, saving: false, isEditable: TaskPlanStore.isEditable(@props.id)})

  render: ->
    {id, hasError} = @props
    plan = TaskPlanStore.get(id)
    isWaiting   = TaskPlanStore.isSaving(id) or TaskPlanStore.isPublishing(id) or TaskPlanStore.isDeleteRequested(id)
    isFailed    = TaskPlanStore.isFailed(id)
    isPublished = TaskPlanStore.isPublished(id)

    <div className='builder-footer-controls'>

      <TourAnchor id="builder-save-button">
        <SaveButton
          onSave={@onSave}
          onPublish={@onPublish}
          isWaiting={isWaiting}
          isSaving={@state.saving}
          isEditable={@state.isEditable}
          isPublishing={@state.publishing}
          isPublished={isPublished}
          hasError={hasError}
        />
      </TourAnchor>

      <TourAnchor id="builder-draft-button">
        <DraftButton
          onClick={@onSave}
          isWaiting={isWaiting and @state.saving}
          isPublishing={@state.publishing}
          isFailed={isFailed}
          hasError={hasError}
          isPublished={isPublished}
        />
      </TourAnchor>

      <TourAnchor id="builder-cancel-button">
        <CancelButton
          isWaiting={isWaiting}
          onClick={@props.onCancel}
          isEditable={@state.isEditable}
        />
      </TourAnchor>

      <TourAnchor id="builder-back-button">
        <BackButton
          isEditable={@state.isEditable}
          getBackToCalendarParams={@props.getBackToCalendarParams}
        />
      </TourAnchor>

      <HelpTooltip
        isPublished={isPublished}
      />

      <TourAnchor id="builder-delete-button">
        <DeleteLink
          isNew={TaskPlanStore.isNew(id)}
          onClick={@onDelete}
          isFailed={isFailed}
          isVisibleToStudents={@props.isVisibleToStudents}
          isWaiting={TaskPlanStore.isDeleting(id)}
          isPublished={isPublished}
        />
      </TourAnchor>

    </div>

module.exports = PlanFooter
