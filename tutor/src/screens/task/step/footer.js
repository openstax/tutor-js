import {
    React, PropTypes, observer, styled,
} from 'vendor';
import Theme from '../../../theme';
import { StudentTaskStep, Course } from '../../../models'
import { ExerciseIdentifierLink } from 'shared';
import RelatedContentLink from '../../../components/related-content-link';

const StyledExerciseFooter = styled.div`
  display: flex;
  margin-top: 3rem;
  padding-top: 1rem;
  font-size: 1.4rem;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${Theme.colors.neutral.light};

  ${({ theme }) => theme.breakpoint.only.mobile`
    .exercise-identifier-link {
      display: none;
    }
  `}
`;

const StyledExerciseIdentifierLink = styled(ExerciseIdentifierLink)`
color: ${Theme.colors.neutral.lite};
`;


const StepFooter = observer(({ course, step, hideContentLink }) => {
    return (
        <StyledExerciseFooter>
            {!hideContentLink &&
        <RelatedContentLink
            course={course}
            content={step.content.related_content}
        />}
            <StyledExerciseIdentifierLink
                exerciseId={step.uid}
                bookUUID={course.ecosystem_book_uuid}
                related_content={step.content.related_content}
            />
        </StyledExerciseFooter>
    );
});

StepFooter.propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    step: PropTypes.instanceOf(StudentTaskStep).isRequired,
    hideContentLink: PropTypes.bool,
};
StepFooter.displayName = 'StepFooter';

export { StepFooter };
