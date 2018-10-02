import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import Course from '../../models/course';
import EmptyPanel from './empty-panel';
import EventsPanel from './events-panel';
import StudentTasks from '../../models/student-tasks';
import { map, isEmpty } from 'lodash';

@observer
export default class AllEventsByWeek extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
  }

  @autobind
  renderWeek(events, week) {
    const startAt = moment(week, 'YYYYww');
    return (
      <EventsPanel
        key={week}
        className="-weeks-events"
        course={this.props.course}
        events={events}
        startAt={startAt}
        endAt={startAt.clone().add(1, 'week')} />
    );
  }

  render() {
    const { course, course: { studentTasks } } = this.props;
    const weeks = studentTasks.pastEventsByWeek;

    if (studentTasks.isPendingTaskLoading || isEmpty(weeks)) {
      return <EmptyPanel course={course} message="No past assignments" />;
    }

    return (
      <div>
        {map(weeks, this.renderWeek)}
      </div>
    );
  }
}
