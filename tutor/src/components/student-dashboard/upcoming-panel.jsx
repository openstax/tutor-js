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
    const startAt = moment(TimeStore.getNow()).startOf('isoweek').add(1, 'week');
    const events  = StudentTasks.get(this.props.courseId).upcomingEvents(startAt);

    if (isEmpty(events)) {
      return <EmptyPanel>No upcoming assignments</EmptyPanel>;
    }

    return (
      <EventsPanel
        className="-upcoming"
        onTaskClick={this.onTaskClick}
        courseId={this.props.courseId}
        isCollege={this.props.isCollege}
        events={events}
        title="Coming Up" />
    );
  }

}
