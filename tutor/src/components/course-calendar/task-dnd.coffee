NewTaskDrag =
  beginDrag: ({link}) ->
    link

  endDrag: (props, monitor) ->
    {onDrop, offset} = monitor.getDropResult() or {}
    onDrop?(
      monitor.getItem(), offset
    )

ItemTypes =
  NewTask: 'NEW_TASK'

TaskDrop =
  drop: (props, monitor, comp) ->
    {onDrop: comp.onDrop, offset: monitor.getClientOffset()}

DragInjector = (connect, monitor) ->
  { connectDragSource: connect.dragSource(), isDragging: monitor.isDragging() }

DropInjector = (connect, monitor) ->
  { connectDropTarget: connect.dropTarget() }

module.exports = {
  NewTaskDrag
  TaskDrop
  DragInjector
  DropInjector
  ItemTypes
}
