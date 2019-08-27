import {
  React, cn, observable, computed, observer, action,
} from '../../helpers/react';
import TimeHelper from '../../helpers/time';
import { partial } from 'lodash';
import 'moment-timezone';
import PropTypes from 'prop-types';
import CoursePlanDetails from './plan-details';
import { DropTarget } from 'react-dnd';
import Dayz from 'dayz';
import { ItemTypes, TaskDrop, DropInjector } from './task-dnd';
import Course from '../../models/course';
import Plan from './plan';
import Time from '../../models/time';

@observer
class Month extends React.Component {

  static propTypes = {
    date: TimeHelper.PropTypes.moment,
    course: PropTypes.instanceOf(Course).isRequired,
    onDrop: PropTypes.func.isRequired,
    onDrag: PropTypes.func.isRequired,
    onDayClick: PropTypes.func.isRequired,
    cloningPlan: PropTypes.object,
    connectDropTarget: PropTypes.func.isRequired,
  }

  @observable viewingPlan;

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
      range: plan.dateRanges.due,
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
    const { course, cloningPlan } = this.props;
    const { now } = Time;

    if (date.isBefore(now, 'day')) {
      classes.push('past');
    } else if (date.isAfter(now, 'day')) {
      classes.push('upcoming');
    } else {
      classes.push('today');
    }

    if (date.isBefore(course.starts_at, 'day')) {
      classes.push('before-term');
    } else if (date.isAfter(course.ends_at, 'day')) {
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
              date={date}
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
