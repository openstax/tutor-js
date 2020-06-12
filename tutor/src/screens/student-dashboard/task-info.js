import { React, PropTypes, styled, observer } from 'vendor';
import { Icon } from 'shared';
import { isNumber } from 'lodash';
import EventInfoIcon from './event-info-icon';
import TourAnchor from '../../components/tours/anchor';

const Feedback = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const TaskStatus = observer(({ event, course }) => {
  if (event.is_deleted) { return null; }

  return (
    <React.Fragment>
      <Feedback>
        <TourAnchor id="assignment-progress-status" tag="span">
          {event.humanProgress}
        </TourAnchor>
        <EventInfoIcon
          event={event}
          isCollege={course.is_college}
        />
      </Feedback>
    </React.Fragment>
  );
});

TaskStatus.displayName = 'TaskStatus';
TaskStatus.propTypes = {
  event: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
};

const TaskScore = observer(({ event }) => {
  return (
    <Feedback>
      {event.humanScore}
      {isNumber(event.score) && event.is_provisional_score && <Icon variant="circledStar" />}
    </Feedback>
  );
});

export { TaskStatus, TaskScore };
