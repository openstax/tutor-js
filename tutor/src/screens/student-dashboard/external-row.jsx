import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import EventRow from './event-row';
import Course from '../../models/course';

export default
@observer
class ExternalRow extends React.Component {

  static propTypes = {
    event:  PropTypes.object.isRequired,
    course: PropTypes.instanceOf(Course).isRequired,
  }

  static contextTypes = {
    router: PropTypes.object,
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
};
