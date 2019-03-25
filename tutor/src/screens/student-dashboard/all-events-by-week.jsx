import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import Course from '../../models/course';
import EmptyCard from './empty-panel';
import EventsCard from './events-panel';
import { map, isEmpty } from 'lodash';
import LateIconLedgend from './late-icon-ledgend';

export default
@observer
class AllEventsByWeek extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  }

  @autobind
  renderWeek(tasks, week) {
    const startAt = moment(week, 'YYYYww');
    return (
      <EventsCard
        key={week}
        className="-weeks-events"
        course={this.props.course}
        events={tasks}
        startAt={startAt}
        endAt={startAt.clone().add(1, 'week')} />
    );
  }

  render() {
    const { course, course: { studentTaskPlans } } = this.props;
    const weeks = studentTaskPlans.pastTasksByWeek;

    if (studentTaskPlans.isPendingTaskLoading || isEmpty(weeks)) {
      return <EmptyCard course={course} message="No past assignments" />;
    }

    return (
      <div>
        {map(weeks, this.renderWeek)}
        <LateIconLedgend />
      </div>
    );
  }
};
