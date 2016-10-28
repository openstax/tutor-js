React = require 'react'

BS = require 'react-bootstrap'

{TaskPlanStore, TaskPlanActions} = require '../../../flux/task-plan'

Icon = require '../../icon'
Loading = require './loading'
TaskingDateTimes = require '../builder/tasking-date-times'
{TutorInput, TutorTextArea} = require '../../tutor-input'

taskPlanEditingInitialize = require '../initialize-editing'

TaskPlanMiniEditor = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    planId:   React.PropTypes.string.isRequired
    findPopOverTarget: React.PropTypes.func.isRequired

  onHide: ->


  setTitle: (title) ->
    {id} = @props
    TaskPlanActions.updateTitle(id, title)


  componentWillMount: ->
    {planId, courseId} = @props
    taskPlanEditingInitialize(planId, courseId)

  render: ->
    plan = TaskPlanStore.get(@props.planId)

    <div className="task-plan-mini-editor">

      <BS.Overlay
        show={true}
        onHide={@onHide}
        placement='left'

        target={@props.findPopOverTarget}
      >
        <BS.Popover id='mini-task-editor' title="Adding Past Assignment">
          <div className="row">
            <TutorInput
              label="Title"
              className='assignment-name'
              id='reading-title'
              default={plan.title}
              required={true}
              onChange={@setTitle} />
          </div>
          <div className="row">

            <TaskingDateTimes
              id={plan.id} isEditable={true} courseId={@props.courseId}
              taskingIdentifier='all'

            />
          </div>
        </BS.Popover>

      </BS.Overlay>
    </div>



module.exports = TaskPlanMiniEditor
