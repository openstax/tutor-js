React = require 'react'

BS = require 'react-bootstrap'
isEmpty = require 'lodash/isEmpty'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'

camelCase = require 'camelcase'
Icon = require '../../icon'
Loading = require './loading'
TutorLink = require '../../link'
TaskingDateTimes = require '../builder/tasking-date-times'
BindStoresMixin = require '../../bind-stores-mixin'
{TutorInput, TutorTextArea} = require '../../tutor-input'
{TaskingStore, TaskingActions} = require '../../../flux/tasking'
{TeacherTaskPlanActions} = require '../../../flux/teacher-task-plan'
taskPlanEditingInitialize = require '../initialize-editing'

PublishButton = require '../footer/save-button'
DraftButton   = require '../footer/save-as-draft'

PlanMixin       = require '../plan-mixin'
ServerErrorMessage = require '../../server-error-message'

TaskPlanMiniEditor = React.createClass

  propTypes:
    courseId:     React.PropTypes.string.isRequired
    id:           React.PropTypes.string.isRequired
    onHide:       React.PropTypes.func.isRequired
    handleError:  React.PropTypes.func.isRequired

  mixins: [PlanMixin, BindStoresMixin]
  getBindEvents: ->
    {id} = @props
    taskingChanged:
      store: TaskingStore
      listenTo: "taskings.#{id}.*.changed"
      callback: @changeTaskPlan
    taskErrored:
      store: TaskPlanStore
      listenTo: 'errored'
      callback: @setError

  changeTaskPlan: ->
    {id} = @props

    taskings = TaskingStore.getChanged(id)
    TaskPlanActions.replaceTaskings(id, taskings)

  setTitle: (title) ->
    {id} = @props
    TaskPlanActions.updateTitle(id, title)

  setError: (error) ->
    @props.handleError(error)
    @setState({error})

  componentWillMount: ->
    {id, courseId} = @props
    taskPlanEditingInitialize(id, courseId)

  onSave: ->
    @setState({saving: true, publishing: false})
    @save()

  onPublish: ->
    @setState({saving: false, publishing: true})
    @publish()

  afterSave: ->
    @setState({saving: false, publishing: false})
    @props.onHide()

  onCancel: ->
    plan = TaskPlanStore.get(@props.id)
    @props.onHide()
    if TaskPlanStore.isNew(@props.id)
      TaskPlanActions.removeUnsavedDraftPlan(@props.id)
      TeacherTaskPlanActions.removeClonedPlan(@props.courseId, @props.id)
      #TaskTeacherReviewActions.removeTask(@props.id)

  render: ->
    plan = TaskPlanStore.get(@props.id)
    isPublished = TaskPlanStore.isPublished(@props.id)

    <div className='task-plan-mini-editor'>
      <div className="row">
        <BS.Col xs=12>
          <h4>Add Copied Assignment</h4>
        </BS.Col>
      </div>
      <div className="row">
        <BS.Col xs=12>
          <TutorInput
            label="Title"
            className='assignment-name'
            id='reading-title'
            value={plan.title or ''}
            required={true}
            onChange={@setTitle}
            disabled={@state.error} />
        </BS.Col>
      </div>
      <div className="row times">
        <TaskingDateTimes
          bsSizes={{}}
          id={plan.id}
          isEditable={not @state.error?}
          courseId={@props.courseId}
          taskingIdentifier='all'
        />
      </div>
      <div className="row">
        <BS.Col xs=6>
          Assigned to all sections
        </BS.Col>
        <BS.Col xs=6 className='text-right'>
          <TutorLink
            to={camelCase("edit-#{plan.type}")}
            params={id: plan.id, courseId: @props.courseId}
          >
              Edit other assignment details
          </TutorLink>
        </BS.Col>
      </div>

      {<BS.Alert bsStyle='danger' onDismiss={@onCancel}>
        <ServerErrorMessage {...@state.error} debug={false} />
      </BS.Alert> if @state.error}

      <div className="builder-footer-controls">
        <PublishButton
          bsSize='small'
          onSave={@onSave}
          onPublish={@onPublish}
          isWaiting={!!(@isWaiting() and @state.publishing and isEmpty(@state.error))}
          isSaving={!!@state.saving}
          isEditable={!!@state.isEditable}
          isPublishing={!!@state.publishing}
          isPublished={isPublished}
          disabled={@isWaiting() or @state.error}
        />
        <DraftButton
          bsSize='small'
          isSavable={@isSaveable()}
          onClick={@onSave}
          isWaiting={!!(@isWaiting() and @state.saving and isEmpty(@state.error))}
          disabled={@isWaiting() or @state.error}
          isFailed={TaskPlanStore.isFailed(@props.idinde)}
        />
        <BS.Button
          bsSize='small'
          className='cancel'
          onClick={@onCancel}
          disabled={@isWaiting() and not @state.error}
        >
          Cancel
        </BS.Button>
      </div>
    </div>

module.exports = TaskPlanMiniEditor
