import { React, cn, observable, computed, observer, action, modelize } from 'vendor';
import TimeHelper from '../../helpers/time';
import { partial } from 'lodash';
import 'moment-timezone';
import PropTypes from 'prop-types';
import CoursePlanDetails from './plan-details';
import { DropTarget } from 'react-dnd';
import Dayz from 'dayz';
import { ItemTypes, TaskDrop, DropInjector } from './task-dnd';
import { Time, Course } from '../../models';
import Plan from './plan';

@observer
class Month extends React.Component {
    static propTypes = {
        date: TimeHelper.PropTypes.time,
        hoveredDay: PropTypes.instanceOf(Time),
        course: PropTypes.instanceOf(Course).isRequired,
        onDrop: PropTypes.func.isRequired,
        onDrag: PropTypes.func.isRequired,
        onDayClick: PropTypes.func.isRequired,
        cloningPlan: PropTypes.object,
        connectDropTarget: PropTypes.func.isRequired,
    }

    @observable viewingPlan;

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound onPlanView(plan) {
        this.viewingPlan = plan;
    }

    @action.bound onDrop(item, offset) {
        this.props.onDrop(item, offset);
    }

    @computed get events() {
        const { course: { teacherTaskPlans } } = this.props;

        const plans = teacherTaskPlans.active.array.map(plan => ({
            plan,
            range: plan.dateRanges.due.asMoment,
            className: `type-${plan.type}`,
            render: ({ event }) => (
                <Plan
                    onPlanView={partial(this.onPlanView, plan)}
                    plan={event.get('plan')}
                    isViewingStats={plan == this.viewingPlan}
                    course={this.props.course}
                    onShow={this.onIfIsEditing}
                    onHide={this.offIfIsEditing}
                />
            ),
        }));
        return new Dayz.EventsCollection(plans);
    }

    getClassNameForDate = (date) => {
        const classes = [];
        const { course, cloningPlan, hoveredDay } = this.props;
        const now = Time.now
        if (now.isSame(date, 'day')) {
            classes.push('today');
        }
        if (now.startOf('day').isAfter(date)) {
            classes.push('past')
        } else if (now.isBefore(date)) {
            classes.push('upcoming');
        }
        if (hoveredDay?.isSame(date, 'day')) {
            classes.push('hover')
        }
        if (course.starts_at.isAfter(date)) {
            classes.push('before-term');
        } else if (course.ends_at.isBefore(date, 'day')) {
            classes.push('after-term');
        } else {
            classes.push('in-term');
        }
        if (cloningPlan && cloningPlan.due_at.isSame(date, 'day')) {
            classes.push('pending-clone');
        }
        return cn(...classes);
    };

    render() {
        const { date, course, onDayClick, onDrag } = this.props;
        return (
            <React.Fragment>
                {this.props.connectDropTarget(
                    <div className="month-wrapper">
                        <Dayz
                            highlightDays={this.getClassNameForDate}
                            date={date.asMoment}
                            events={this.events}
                            dayEventHandlers={{
                                onClick: onDayClick,
                                onDragEnter: onDrag,
                            }}
                        />
                    </div>
                )}
                {this.viewingPlan && (
                    <CoursePlanDetails
                        plan={this.viewingPlan}
                        course={course}
                        className={this.className}
                        onHide={partial(this.onPlanView, false)}
                    />
                )}
            </React.Fragment>
        );
    }
}

export default DropTarget([ItemTypes.NewTask, ItemTypes.CloneTask], TaskDrop, DropInjector)(Month);
