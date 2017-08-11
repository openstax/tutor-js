import React from 'react';
import { observer } from 'mobx-react';
import EventRow from './event-row';

@observer
export default class EventTaskRow extends React.PureComponent {

  static propTypes = {
    event: React.PropTypes.object.isRequired,
    courseId: React.PropTypes.string.isRequired,
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
