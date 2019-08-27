import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import EventsCard from './events-panel';
import Course from '../../models/course';

export default
@observer
class UpcomingCard extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  }

  render() {
    const { course, course: { studentTaskPlans } } = this.props;

    const tasks = studentTaskPlans.upcomingTasks;

    return (
      <React.Fragment>
        <EventsCard
          className="upcoming"
          onTaskClick={this.onTaskClick}
          course={course}
          events={tasks}
          title="Coming Up"
          emptyClassName="upcoming"
          emptyMessage='No upcoming assignments' />
      </React.Fragment>
    );
  }

}
