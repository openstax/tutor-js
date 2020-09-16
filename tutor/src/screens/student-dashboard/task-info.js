import { React, PropTypes, styled, observer } from 'vendor';
import { Icon } from 'shared';
import EventInfoIcon from './event-info-icon';
import TutorLink from '../../components/link';
import Router from '../../helpers/router';
import { UNWORKED } from '../../helpers/scores';

import TourAnchor from '../../components/tours/anchor';

const Feedback = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  a {
    font-weight: 600;
  }
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

const TaskScore = observer(({ event, course }) => {
  return (
    <Feedback> 
      {
        event.humanScore === UNWORKED
          ? event.humanScore
          : 
          <TutorLink to={Router.makePathname('viewGradebook', { courseId: course.id })}>
            {event.humanScore}
          </TutorLink>
      }
      {event.is_provisional_score && <Icon variant="circledStar" />}
    </Feedback>
  );
});

export { TaskStatus, TaskScore };
