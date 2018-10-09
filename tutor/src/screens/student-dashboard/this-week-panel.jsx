import React from 'react';
import Course from '../../models/course';
import { observer } from 'mobx-react';
import Events from './events-panel';
import EmptyPanel from './empty-panel';

@observer
export default class ThisWeekPanel extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
  }

  render() {
    const { course, course: { studentTasks } } = this.props;
    const tasks = studentTasks.thisWeeksTasks;

    if (studentTasks.isPendingTaskLoading || !tasks.length) {
      return <EmptyPanel course={course} message='No assignments this week' />;
    }

    return (
      <Events
        className="-this-week"
        course={course}
        events={tasks}
        startAt={studentTasks.startOfThisWeek}
        endAt={studentTasks.endOfThisWeek}
      />
    );
  }
}
