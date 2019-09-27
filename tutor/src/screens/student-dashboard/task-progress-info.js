import { React, PropTypes, styled, observer } from 'vendor';
import EventInfoIcon from './event-info-icon';
import TourAnchor from '../../components/tours/anchor';
import Theme from '../../theme';

const Feedback = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;


const LateCaption = styled.div`
  font-size: 1.2rem;
  margin-top: 5px;
  color: ${Theme.colors.neutral.thin};
`;

const LateInfo = observer(({ event }) => {
  if (!event.isHomework || !event.workedLate) { return null; }
  return (
    <LateCaption>
      {event.completed_on_time_exercise_count}/{event.exercise_count} answered on due date
    </LateCaption>
  );
});


const TaskProgressInfo = observer(({ event, course }) => {
  if (event.is_deleted) { return null; }

  return (
    <React.Fragment>
      <Feedback>
        {event.studentFeedback &&
          <TourAnchor id="assignment-progress-status" tag="span">
            {event.studentFeedback}
          </TourAnchor>}
        <EventInfoIcon
          event={event}
          isCollege={course.is_college}
        />
      </Feedback>
      <LateInfo event={event} />
    </React.Fragment>
  );
});

TaskProgressInfo.displayName = 'TaskProgressInfo';
TaskProgressInfo.propTypes = {
  event: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
};

export default TaskProgressInfo;
