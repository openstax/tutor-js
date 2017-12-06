import React from 'react';
import { isNil } from 'lodash';
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
    const feedback = isNil(event.correct_exercise_count) ?
      `${event.complete_exercise_count}/${event.exercise_count} answered` :
      `${event.correct_exercise_count}/${event.exercise_count} correct`;

    return (
      <EventRow {...this.props} feedback={feedback} eventType="homework">
        {event.title}
      </EventRow>
    );
  }
}
