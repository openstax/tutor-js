import React from 'react';

import classnames from 'classnames';
import partial from 'lodash/partial';
import { DragSource, DropTarget } from 'react-dnd';

const CloneCourseDrag = {
  beginDrag({ course }) {
    return (
      course
    );
  },

  endDrag(props, monitor) {
    const { onDrop, offset } = monitor.getDropResult() || {};
    return (
      __guardFunc__(onDrop, f => f(
        monitor.getItem(), offset
      ))
    );
  },
};

const Types =
  { CloneCourse: 'CLONE_COURSE' };

const DragInjector = (connect, monitor) => ({ connectDragSource: connect.dragSource(), isDragging: monitor.isDragging() });


const CloneCourseDrop = {
  drop(props, monitor, comp) {
    return (
      { onDrop: comp.onDrop, offset: monitor.getClientOffset() }
    );
  },
};

const DropInjector = (connect, monitor) => ({ connectDropTarget: connect.dropTarget(), isHovering: monitor.isOver() });


export function wrapCourseDragComponent(component) {
  return DragSource(Types.CloneCourse, CloneCourseDrag, DragInjector)(component);
}


export function wrapCourseDropComponent(component) {
  return DropTarget(Types.CloneCourse, CloneCourseDrop, DropInjector)(component);
}


function __guardFunc__(func, transform) {
  return (
    typeof func === 'function' ? transform(func) : undefined
  );
}
