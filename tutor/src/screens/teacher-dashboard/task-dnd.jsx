import { React, cn } from 'vendor';
import { DragSource } from 'react-dnd';

import GrabbyDots from '../../components/grabby-dots';

const NewTaskDrag = {
    beginDrag(props) {
        const { link, onDrag } = props;
        if (typeof onDrag === 'function') {
            onDrag();
        }

        return (
            link
        );
    },

    endDrag(props, monitor) {
        const { onDrop, offset } = monitor.getDropResult() || {};
        return (
            (typeof onDrop === 'function' ? onDrop(
                monitor.getItem(), offset
            ) : undefined)
        );
    },
};

const CloneTaskDrag = {
    beginDrag({ plan, offHover }) {
    // start loading task plan details as soon as it starts to drag
    // hopefully the load will have completed by the time it's dropped
        offHover();

        if (!plan.api.isFetchedOrFetching) {
            plan.fetch();
        }
        return { id: plan.id, type: plan.type };
    },

    endDrag(props, monitor) {
        const { onDrop, offset } = monitor.getDropResult() || {};
        return (
            (typeof onDrop === 'function' ? onDrop(
                monitor.getItem(), offset
            ) : undefined)
        );
    },
};

const ItemTypes = {
    NewTask: 'NEW_TASK',
    CloneTask: 'CLONE_TASK',
};

const TaskDrop = {
    drop(props, monitor, comp) {
        return (
            { onDrop: comp.onDrop, offset: monitor.getClientOffset() }
        );
    },

};

const DragInjector = (connect, monitor) => ({ connectDragSource: connect.dragSource(), isDragging: monitor.isDragging() });

const DropInjector = (connect, monitor) => ({ connectDropTarget: connect.dropTarget(), isDragging: monitor.isOver() });


const AddAssignmentLink = DragSource(ItemTypes.NewTask, NewTaskDrag, DragInjector)(
    props => props.connectDragSource(
        <div
            data-assignment-type={props.link.type}
            className={cn('new-task', { 'is-dragging': props.isDragging })}>
            <GrabbyDots />
            <a
                href={props.link.pathname}
                onClick={props.goToBuilder}
                draggable="false">
                {props.link.text}
            </a>
        </div>
    )
);

AddAssignmentLink.displayName = 'AddAssignmentLink';


const CloneAssignmentLink = DragSource(ItemTypes.CloneTask, CloneTaskDrag, DragInjector)(
    props => props.connectDragSource(
        <div
            onMouseEnter={props.onHover}
            onMouseLeave={props.offHover}
            data-assignment-id={`${props.plan.id}`}
            data-assignment-type={props.plan.type}
            className={cn('task-plan', {
                'is-dragging': props.isDragging,
                'is-editing': props.isEditing,
            })}
            title={props.toolTip}
        >
            <GrabbyDots />
            <div>
                {props.plan.title}
            </div>
        </div>
    )
);

CloneAssignmentLink.displayName = 'CloneAssignmentLink';

export {
    NewTaskDrag,
    CloneTaskDrag,
    TaskDrop,
    DragInjector,
    DropInjector,
    ItemTypes,
    CloneAssignmentLink,
    AddAssignmentLink,
};
