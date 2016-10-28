React = require 'react'

{DragSource} = require 'react-dnd'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

NewTaskDrag =
  beginDrag: ({link}) ->
    link

  endDrag: (props, monitor) ->
    {onDrop, offset} = monitor.getDropResult() or {}
    onDrop?(
      monitor.getItem(), offset
    )

CloneTaskDrag =
  beginDrag: ({plan}) ->
    # start loading task plan details as soon as it starts to drag
    # hopefully the load will have completed by the time it's dropped
    TaskPlanActions.load(plan.id)
    plan

  endDrag: (props, monitor) ->
    {onDrop, offset} = monitor.getDropResult() or {}
    onDrop?(
      monitor.getItem(), offset
    )

ItemTypes =
  NewTask: 'NEW_TASK'
  CloneTask: 'CLONE_TASK'

TaskDrop =
  drop: (props, monitor, comp) ->
    {onDrop: comp.onDrop, offset: monitor.getClientOffset()}

DragInjector = (connect, monitor) ->
  { connectDragSource: connect.dragSource(), isDragging: monitor.isDragging() }

DropInjector = (connect, monitor) ->
  { connectDropTarget: connect.dropTarget() }


AddAssignmentLink = (props) ->
  <li data-assignment-type={props.link.type}>
    {props.connectDragSource(
      <a

        href={props.link.pathname}
        onClick={_.partial(props.goToBuilder, props.link)} >
        {props.link.text}
      </a>
    )}
  </li>

CloneAssignmentLink = (props) ->
  <div data-assignment-type={props.plan.type} className='task-plan'>
    {props.connectDragSource(
      <div>{props.plan.title}</div>
    )}
  </div>


module.exports = {
  NewTaskDrag,
  CloneTaskDrag,
  TaskDrop,
  DragInjector,
  DropInjector,
  ItemTypes,
  AddAssignmentLink: DragSource(ItemTypes.NewTask, NewTaskDrag, DragInjector)(
    AddAssignmentLink
  ),
  CloneAssignmentLink: DragSource(ItemTypes.CloneTask, CloneTaskDrag, DragInjector)(
    CloneAssignmentLink
  ),

}
