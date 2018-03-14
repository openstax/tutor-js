import React from 'react';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import EventsPanel from './events-panel';
import EmptyPanel from './empty-panel';
import { TimeStore } from '../../flux/time';
import StudentTasks from '../../models/student-tasks';

@observer
export default class UpcomingPanel extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    isCollege: React.PropTypes.bool.isRequired,
  }

  render() {
    const { courseId } = this.props;
    const startAt = moment(TimeStore.getNow()).startOf('isoweek').add(1, 'week');
    const tasks = StudentTasks.get(this.props.courseId);
    const events  = tasks ? tasks.upcomingEvents(startAt.toDate()) : [];

    if (isEmpty(events)) {
      return <EmptyPanel courseId={courseId} message='No upcoming assignments' />;
    }

    return (
      <EventsPanel
        className="-upcoming"
        onTaskClick={this.onTaskClick}
        courseId={courseId}
        isCollege={this.props.isCollege}
        events={events}
        title="Coming Up" />
    );
  }

}
