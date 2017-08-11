import React from 'react';
import { observer } from 'mobx-react';
import EventRow from './event-row';

// Represents a generic event, such as a Holiday.
// It's the fallback renderer for events that do not
// have a designated renderer
@observer
export default class GenericEventRow extends React.PureComponent {

  static propTypes = {
    event: React.PropTypes.object.isRequired,
    courseId: React.PropTypes.string.isRequired,
  }

  render() {
    return (
      <EventRow feedback="" {...this.props} eventType="generic">
        {this.props.event.title}
      </EventRow>
    );
  }
}
