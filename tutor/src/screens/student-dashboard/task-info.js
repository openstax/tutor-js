import { React, PropTypes, styled, observer } from 'vendor';
import { Icon } from 'shared';
import EventInfoIcon from './event-info-icon';
import TourAnchor from '../../components/tours/anchor';


const Feedback = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

// const LateCaption = styled.div`
//   font-size: 1.2rem;
//   margin-top: 5px;
//   color: ${({ theme }) => theme.colors.neutral.thin};
// `;

// const LateInfo = observer(({ event }) => {
//   if (!event.isHomework || !event.workedLate) { return null; }
//   return (
//     <LateCaption>
//       {event.completed_on_time_exercise_count}/{event.exercise_count} answered on due date
//     </LateCaption>
//   );
// });


const DescriptionPopoverIcon = observer(({ event }) => {
  if (!event.description) { return null; }
  return (
    <Icon variant="info" tooltip={event.description} />
  );
});

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
        <DescriptionPopoverIcon event={event} />
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
    </Feedback>
  );
});

export { TaskStatus, TaskScore };
