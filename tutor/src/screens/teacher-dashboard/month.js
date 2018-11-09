import { React, ReactDOM, observable, computed, observer, action, cn } from '../../helpers/react';
import moment from 'moment';
import TimeHelper from '../../helpers/time';
import { isEmpty, find, defer, get, invoke } from 'lodash';
import 'moment-timezone';
import twix from 'twix';
import PropTypes from 'prop-types';
import qs from 'qs';
import extend from 'lodash/extend';
import { DropTarget } from 'react-dnd';
import Dayz from 'dayz';
import { ItemTypes, TaskDrop, DropInjector } from './task-dnd';
import Course from '../../models/course';
//
// {plans && (
//   <CourseDuration
//     referenceDate={moment(TimeStore.getNow())}
//     durations={plans}
//     viewingDuration={calendarDuration}
//     groupingDurations={calendarWeeks}
//     course={course}
//     ref="courseDurations"
//   >
//     <CoursePlan
//       course={course}
//       onShow={this.onIfIsEditing}
//       onHide={this.offIfIsEditing}
//     />
//   </CourseDuration>
// )

const eventRenderer = ({ event }) => {
  return (
    <div>{event.attributes.plan.title}</div>
  )
}

@observer
class Month extends React.Component {

  static propTypes = {
    date: TimeHelper.PropTypes.moment,
    course: PropTypes.instanceOf(Course).isRequired,
  }

  @computed get events() {
    return new Dayz.EventsCollection(
      this.props.course.taskPlans.active.array.map(plan => ({
        plan,
        range: plan.dueRange,
        render: eventRenderer,
      })));
  }

  render() {
    const { date } = this.props;

    return this.props.connectDropTarget(
      <div className="month-wrapper">
        <Dayz
          date={date}
          events={this.events}
        />
      </div>
    );
  }

}

export default DropTarget([ItemTypes.NewTask, ItemTypes.CloneTask], TaskDrop, DropInjector)(Month);
