import {
    React, PropTypes, observer, styled,
} from 'vendor';
import { colors } from 'theme';
import { StudentTaskStep } from '../../../models';

const StyledMessage = styled.div`
  color: ${colors.neutral.thin};
  font-size: 1.4rem;
`;

const WRQStatus = observer(({ step }) => {
    if ((!step.isOpenEndedExercise) || step.task.course?.currentRole.isTeacher) {
        return null;
    }

    if (step.can_be_updated) {
        return (
            <StyledMessage>
                Multiple attempts allowed. Only the last submitted answer will be graded.
            </StyledMessage>
        );
    }

    return null;
});
WRQStatus.propTypes = {
    step: PropTypes.instanceOf(StudentTaskStep).isRequired,
};

export { WRQStatus };
