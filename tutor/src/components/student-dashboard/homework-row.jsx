import React from 'react';
import { observer } from 'mobx-react';
import EventRow from './event-row';

@observer
export default class HomeworkRow extends React.PureComponent {

  static propTypes = {
    event: React.PropTypes.object.isRequired,
    courseId: React.PropTypes.string.isRequired,
  }

  render() {
    const { event } = this.props;
    const feedback = event.correct_exercise_count ?
                     `${event.correct_exercise_count}/${event.exercise_count} correct` :
                     `${event.complete_exercise_count}/${event.exercise_count} answered`;

    return (
      <EventRow {...this.props} feedback={feedback} eventType="homework">
        {event.title}
      </EventRow>
    );
  }
}
