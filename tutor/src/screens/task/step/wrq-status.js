import {
    React, PropTypes, observer, styled,
} from 'vendor';
import { Icon } from 'shared';
import { colors } from 'theme';
import { isNil } from 'lodash';
import ScoresHelper from '../../../helpers/scores';
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

const StyledPoints = styled.div`
  font-size: 1.4rem;
  flex: 1;
`;
const Label = styled.span`
  font-weight: bold;
  color: ${colors.blue_info};
  margin-right: 0.5rem;
`;

const Value=styled.span`
  font-weight: bold;
`;
const PointsAndFeedback = observer(({ step }) => { // TODO: Move this into exercise-question
    if (!step.isOpenEndedExercise || isNil(step.published_points_without_lateness)) {
        return null;
    }

    return (
        <StyledPoints>
            <div>
                <Label>Points earned:</Label>
                {/* Show original points graded by instructor */}
                <Value>
                    {ScoresHelper.formatPoints(step.published_points)} / {ScoresHelper.formatPoints(step.available_points)}
                </Value>
            </div>
            {step.published_comments && (
                <div>
                    <Label>Feedback:</Label>
                    <span>{step.published_comments}</span>
                </div>)}
        </StyledPoints>
    );
});
PointsAndFeedback.propTypes = {
    step: PropTypes.instanceOf(StudentTaskStep).isRequired,
};


export { WRQStatus, PointsAndFeedback };
