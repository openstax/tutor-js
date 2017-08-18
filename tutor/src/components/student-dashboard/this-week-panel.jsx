import React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import Events from './events-panel';
import EmptyPanel from './empty-panel';
import { TimeStore } from '../../flux/time';
import StudentTasks from '../../models/student-tasks';

@observer
export default class ThisWeekPanel extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    isCollege: React.PropTypes.bool.isRequired,
  }

  render() {
    const { courseId } = this.props;
    const startAt = moment(TimeStore.getNow()).startOf('isoweek');
    const tasks = StudentTasks.get(this.props.courseId);
    const events = tasks ? tasks.weeklyEventsForDay(startAt) : [];

    if (!events.length) { return <EmptyPanel courseId={courseId} message='No assignments this week' />; }

    return (
      <Events
        className="-this-week"
        courseId={courseId}
        isCollege={this.props.isCollege}
        events={events}
        startAt={startAt}
        endAt={startAt.clone().add(1, 'week').subtract(1, 'second')}
      />
    );
  }
}
