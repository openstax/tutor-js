React = require 'react'

classnames = require 'classnames'
partial = require 'lodash/partial'
{DragSource, DropTarget} = require 'react-dnd'

CloneCourseDrag =
  beginDrag: ({course}) ->
    course

  endDrag: (props, monitor) ->
    {onDrop, offset} = monitor.getDropResult() or {}
    onDrop?(
      monitor.getItem(), offset
    )

Types =
  CloneCourse: 'CLONE_COURSE'

DragInjector = (connect, monitor) ->
  { connectDragSource: connect.dragSource(), isDragging: monitor.isDragging() }


CloneCourseDrop =
  drop: (props, monitor, comp) ->
    {onDrop: comp.onDrop, offset: monitor.getClientOffset()}

DropInjector = (connect, monitor) ->
  { connectDropTarget: connect.dropTarget(), isDragging: monitor.isOver() }



module.exports =

  wrapCourseDragComponent: (component) ->
    DragSource(Types.CloneCourse, CloneCourseDrag, DragInjector)(component)

  wrapCourseDropComponent: (component) ->
    DropTarget(Types.CloneCourse, CloneCourseDrop, DropInjector)(component)
