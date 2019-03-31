import {
  React, PropTypes, observer, styled,
} from '../../../helpers/react';
import Theme from '../../../theme';
import Course from '../../../models/course';
import TaskStep from '../../../models/student-tasks/step';
import { ExerciseIdentifierLink } from 'shared';
import RelatedContentLink from '../../../components/related-content-link';

const StyledExerciseFooter = styled.div`
  display: flex;
  margin-top: 3rem;
  padding-top: 1rem;
  font-size: 1.5rem;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${Theme.colors.neutral.light};
`;

const ExerciseFooter = observer(({ course, step, hideContentLink }) => {

  return (
    <StyledExerciseFooter>
      <ExerciseIdentifierLink
        exerciseId={step.uid}
        bookUUID={course.ecosystem_book_uuid}
        related_content={step.content.related_content}
      />
      {!hideContentLink &&
        <RelatedContentLink
          course={course}
          content={step.content.related_content}
        />}
    </StyledExerciseFooter>
  );
});

ExerciseFooter.propTypes = {
  course: PropTypes.instanceOf(Course).isRequired,
  step: PropTypes.instanceOf(TaskStep).isRequired,
  hideContentLink: PropTypes.bool,
};
ExerciseFooter.displayName = 'ExerciseFooter';

export { ExerciseFooter };
