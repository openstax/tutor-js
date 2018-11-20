import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import EventRow from './event-row';

// Represents a generic event, such as a Holiday.
// It's the fallback renderer for events that do not
// have a designated renderer
export default
@observer
class GenericEventRow extends React.Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
    courseId: PropTypes.string.isRequired,
  }

  render() {
    return (
      <EventRow feedback="" {...this.props} eventType="generic">
        {this.props.event.title}
      </EventRow>
    );
  }
};
