React = require 'react'

classnames = require 'classnames'
partial = require 'lodash/partial'
{DragSource} = require 'react-dnd'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'

GrabbyDots = require '../grabby-dots'

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
    unless TaskPlanStore.isLoaded(plan.id) or TaskPlanStore.isLoading(plan.id)
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
  { connectDropTarget: connect.dropTarget(), isDragging: monitor.isOver() }


AddAssignmentLink = (props) ->
  props.connectDragSource(
    <li
      data-assignment-type={props.link.type}
      className={classnames('new-task', 'is-dragging': props.isDragging)}
    >
      <GrabbyDots/>
      <a
        href={props.link.pathname}
        onClick={props.goToBuilder(props.link)} >
        {props.link.text}
      </a>
    </li>
  )

CloneAssignmentLink = (props) ->
  props.connectDragSource(
    <div
      data-assignment-type={props.plan.type}
      className={classnames('task-plan', 'is-dragging': props.isDragging)}
    >
      <GrabbyDots/><div>{props.plan.title}</div>
    </div>
  )


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
