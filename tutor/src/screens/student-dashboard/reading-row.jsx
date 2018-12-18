import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import EventRow from './event-row';
import Course from '../../models/course';

export default
@observer
class ReadingRow extends React.Component {

  static propTypes = {
    event:  PropTypes.object.isRequired,
    course: PropTypes.instanceOf(Course).isRequired,
  }

  render() {
    let feedback;
    if (this.props.event.complete) {
      feedback = 'Complete';
    } else if (this.props.event.last_worked_at) {
      feedback = 'In progress';
    } else {
      feedback = 'Not started';
    }

    return (
      <EventRow {...this.props} feedback={feedback} eventType="reading">
        {this.props.event.title}
      </EventRow>
    );
  }
};
