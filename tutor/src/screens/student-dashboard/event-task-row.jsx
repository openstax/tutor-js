import React from 'react';
import Course from '../../models/course';
import { observer } from 'mobx-react';
import EventRow from './event-row';
import Task from '../../models/student/task';

@observer
export default class EventTaskRow extends React.PureComponent {

  static propTypes = {
    event:  React.PropTypes.instanceOf(Task).isRequired,
    course: React.PropTypes.instanceOf(Course).isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  render() {
    const { event } = this.props;
    return (
      <EventRow feedback="" {...this.props} workable={false} eventType="event">
        {event.title}
      </EventRow>
    );
  }

}
