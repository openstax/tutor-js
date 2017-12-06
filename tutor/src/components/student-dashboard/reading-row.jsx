import React from 'react';
import { observer } from 'mobx-react';
import EventRow from './event-row';

@observer
export default class ReadingRow extends React.PureComponent {

  static propTypes = {
    event: React.PropTypes.object.isRequired,
    courseId: React.PropTypes.string.isRequired,
  }

  render() {
    let feedback;
    if (this.props.event.complete) { feedback = 'Complete';
    } else if (this.props.event.complete_exercise_count > 0) {
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
}
