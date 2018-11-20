import PropTypes from 'prop-types';
import React from 'react';
import Course from '../../models/course';
import { observer } from 'mobx-react';
import EventRow from './event-row';
import Task from '../../models/student/task';

export default
@observer
class EventTaskRow extends React.Component {

  static propTypes = {
    event:  PropTypes.instanceOf(Task).isRequired,
    course: PropTypes.instanceOf(Course).isRequired,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  render() {
    const { event } = this.props;
    return (
      <EventRow feedback="" {...this.props} workable={false} eventType="event">
        {event.title}
      </EventRow>
    );
  }

};
