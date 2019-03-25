import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import React from 'react';
import Course from '../../models/course';
import { observer } from 'mobx-react';
import Events from './events-panel';
import EmptyCard from './empty-panel';
import LateIconLedgend from './late-icon-ledgend';

export default
@observer
class ThisWeekCard extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  }

  render() {
    const { course, course: { studentTaskPlans } } = this.props;
    const tasks = studentTaskPlans.thisWeeksTasks;

    if (studentTaskPlans.isPendingTaskLoading || isEmpty(tasks)) {
      return <EmptyCard course={course} message='No assignments this week' />;
    }

    return (
      <React.Fragment>
        <Events
          className="-this-week"
          course={course}
          events={tasks}
          startAt={studentTaskPlans.startOfThisWeek}
          endAt={studentTaskPlans.endOfThisWeek}
        />
        <LateIconLedgend />
      </React.Fragment>
    );
  }
};
