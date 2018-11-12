import { React, ReactDOM, observable, computed, observer, action, cn } from '../../helpers/react';
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

@observer
class Month extends React.Component {

  static propTypes = {
    date: TimeHelper.PropTypes.moment,
    connectDropTarget: PropTypes.func.isRequired,
    course: PropTypes.instanceOf(Course).isRequired,
  }

  @observable viewingPlan;

  @action.bound onPlanView(plan) {
    this.viewingPlan = plan;
  }

  @computed get events() {
    return new Dayz.EventsCollection(
      this.props.course.taskPlans.active.array.map(plan => ({
        plan,
        range: plan.dueRange,
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
      })));
  }

  render() {
    const { date, course } = this.props;

    return (
      <React.Fragment>
        {this.props.connectDropTarget(
          <div className="month-wrapper">
            <Dayz date={date} events={this.events} />
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
