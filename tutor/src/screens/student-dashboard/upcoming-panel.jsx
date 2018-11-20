import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import EventsCard from './events-panel';
import EmptyCard from './empty-panel';
import Course from '../../models/course';

export default
@observer
class UpcomingCard extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  }

  render() {
    const { course, course: { studentTasks } } = this.props;

    const tasks = studentTasks.upcomingTasks;

    if (studentTasks.isPendingTaskLoading || isEmpty(tasks)) {
      return <EmptyCard className="upcoming" course={course} message='No upcoming assignments' />;
    }

    return (
      <EventsCard
        className="upcoming"
        onTaskClick={this.onTaskClick}
        course={course}
        events={tasks}
        title="Coming Up" />
    );
  }

};
