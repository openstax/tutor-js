import React from 'react';
import { isNil } from 'lodash';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import Course from '../../models/course';
import Task from '../../models/student/task';
import EventRow from './event-row';
// complete_exercise_count
import TourAnchor from '../../components/tours/anchor';

@observer
export default class HomeworkRow extends React.PureComponent {

  static propTypes = {
    event:  React.PropTypes.instanceOf(Task).isRequired,
    course: React.PropTypes.instanceOf(Course).isRequired,
  }

  @computed get hasStarted() {
    const { props: { event } } = this;
    return event.complete_exercise_count > 0;
  }

  @computed get isGraded() {
    const { props: { event } } = this;
    return !isNil(event.correct_exercise_count);
  }

  render() {
    const { event } = this.props;
    let feedback = this.isGraded ?
      `${event.correct_exercise_count}/${event.exercise_count} correct`:
      `${event.complete_exercise_count}/${event.exercise_count} answered`;

    if (this.hasStarted) {
      feedback = (
        <TourAnchor id="assignment-progress-status" tag="span">
          {feedback}
        </TourAnchor>
      );
    }

    return (
      <EventRow {...this.props} feedback={feedback} eventType="homework">
        {event.title}
      </EventRow>
    );
  }
}
