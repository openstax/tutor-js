import React from 'react';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import EventsPanel from './events-panel';
import EmptyPanel from './empty-panel';
import { TimeStore } from '../../flux/time';
import Course from '../../models/course';

@observer
export default class UpcomingPanel extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
  }

  render() {
    const { course, course: { studentTasks } } = this.props;
    const startAt = moment(TimeStore.getNow()).startOf('week').add(1, 'week');
    const events  = studentTasks.upcomingEvents(startAt.toDate());

    if (studentTasks.isPendingTaskLoading || isEmpty(events)) {
      return <EmptyPanel className="upcoming" course={course} message='No upcoming assignments' />;
    }

    return (
      <EventsPanel
        className="upcoming"
        onTaskClick={this.onTaskClick}
        course={course}
        events={events}
        title="Coming Up" />
    );
  }

}
