import React from 'react';
import Course from '../../models/course';
import { observer } from 'mobx-react';
import moment from 'moment';
import Events from './events-panel';
import EmptyPanel from './empty-panel';
import { TimeStore } from '../../flux/time';

@observer
export default class ThisWeekPanel extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
  }

  render() {
    const { course, course: { studentTasks } } = this.props;

    const startAt = moment(TimeStore.getNow()).startOf('isoweek');
    const events = studentTasks.weeklyEventsForDay(startAt);
    if (studentTasks.isPendingTaskLoading || !events.length) {
      return <EmptyPanel course={course} message='No assignments this week' />;
    }

    return (
      <Events
        className="-this-week"
        course={course}
        events={events}
        startAt={startAt}
        endAt={startAt.clone().add(1, 'week').subtract(1, 'second')}
      />
    );
  }
}
