import React from 'react';
import { observer } from 'mobx-react';
import EventRow from './event-row';

@observer
export default class ExternalRow extends React.PureComponent {

  static propTypes = {
    event: React.PropTypes.object.isRequired,
    courseId: React.PropTypes.string.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  render() {
    const { event } = this.props;
    const feedback = event.complete ? 'Clicked' : 'Not started';
    return (
      <EventRow {...this.props} feedback={feedback} eventType="external">
        {event.title}
      </EventRow>
    );
  }
}
