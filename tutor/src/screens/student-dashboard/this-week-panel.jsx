import PropTypes from 'prop-types';
import React from 'react';
import Course from '../../models/course';
import { observer } from 'mobx-react';
import EventsCard from './events-panel';
import StatusLegend from './status-legend';
import TeacherPendingLoad from './teacher-pending-load';

export default
@observer
class ThisWeekCard extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  }

  render() {
    const { course, course: { studentTaskPlans } } = this.props;
    const tasks = studentTaskPlans.thisWeeksTasks;

    return (
      <React.Fragment>
        <EventsCard
          className="-this-week"
          course={course}
          events={tasks}
          startAt={studentTaskPlans.startOfThisWeek}
          endAt={studentTaskPlans.endOfThisWeek}
          emptyMessage='No assignments this week'
          spinner
        />
        <TeacherPendingLoad course={this.props.course} />
        <StatusLegend tasks={tasks} />
      </React.Fragment>
    );
  }
}
