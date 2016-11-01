React = require 'react'

BS = require 'react-bootstrap'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'

camelCase = require 'camelcase'
Icon = require '../../icon'
Loading = require './loading'
TutorLink = require '../../link'
TaskingDateTimes = require '../builder/tasking-date-times'
{TutorInput, TutorTextArea} = require '../../tutor-input'

taskPlanEditingInitialize = require '../initialize-editing'

PublishButton = require '../footer/save-button'
DraftButton   = require '../footer/save-as-draft'

PlanMixin       = require '../plan-mixin'
TaskPlanMiniEditor = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    id:   React.PropTypes.string.isRequired
    onHide: React.PropTypes.func.isRequired

  mixins: [PlanMixin]

  setTitle: (title) ->
    {id} = @props
    TaskPlanActions.updateTitle(id, title)

  componentWillMount: ->
    {id, courseId} = @props
    taskPlanEditingInitialize(id, courseId)

  onSave: ->
    @setState({saving: true, publishing: false})
    @save()

  afterSave: ->
    @props.onHide()

  render: ->
    plan = TaskPlanStore.get(@props.id)
    isPublished = TaskPlanStore.isPublished(@props.id)

    <div className="task-plan-mini-editor">
      <div className="row">
        <BS.Col xs=12>
          <TutorInput
            label="Title"
            className='assignment-name'
            id='reading-title'
            value={plan.title or ''}
            required={true}
            onChange={@setTitle} />
        </BS.Col>
      </div>
      <div className="row times">
        <TaskingDateTimes
          bSSizes={xs: 12}
          id={plan.id} isEditable={true} courseId={@props.courseId}
          taskingIdentifier='all'
        />
      </div>
      <div className="row">
        <BS.Col xs=6>
          Assigned to all sections
        </BS.Col>
        <BS.Col xs=6>
          <TutorLink
            to={camelCase("edit-#{plan.type}")}
            params={id: plan.id, courseId: @props.courseId}
          >
              Edit other assignment details
          </TutorLink>
        </BS.Col>
      </div>

      <div className="controls">
        <PublishButton
          onSave={@onSave}
          onPublish={@publish}
          isWaiting={@isWaiting()}
          isSaving={!!@state.saving}
          isEditable={!!@state.isEditable}
          isPublishing={!!@state.publishing}
          isPublished={isPublished}
        />
        <DraftButton
          isSavable={@isSaveable()}
          onClick={@onSave}
          isWaiting={!!@isWaiting() and @state.saving}
          isFailed={TaskPlanStore.isFailed(@props.idinde)}
        />
        <BS.Button className="cancel" onClick={@props.onHide}>Cancel</BS.Button>

      </div>
    </div>

module.exports = TaskPlanMiniEditor
