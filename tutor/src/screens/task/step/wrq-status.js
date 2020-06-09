import {
  React, PropTypes, observer, styled,
} from 'vendor';
import { Icon } from 'shared';
import { colors } from 'theme';
import { isNil } from 'lodash';
import S from '../../../helpers/string';
import TaskStep from '../../../models/student-tasks/step';

const StyledMessage = styled.div`
  color: ${colors.neutral.thin};
  font-size: 1.4rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Message = ({ text, tooltip }) => {
  return (
    <StyledMessage>
      <span>{text}</span>
      <Icon variant="infoCircle" tooltip={tooltip} />
    </StyledMessage>
  );
};

Message.propTypes = {
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.node,
};

const WRQStatus = observer(({ step }) => {
  if (!step.isOpenEndedExercise) {
    return null;
  }
  
  if (step.can_be_updated) {
    return (
      <Message
        text="You can submit this answer multiple times"
        tooltip={(
          <ul className="m-4">
            <li>Only the last answer will be graded</li>
            <li><b>After due date,</b> late work policy will be in effect</li>
          </ul>
        )}
      />
    );
  }
  if (isNil(step.grader_points)) {
    return (
      <Message
        text="This question is closed"
        tooltip="This question is closed for grading. You can no longer add or edit a response"
      />
    );
  }

  return null;
});
WRQStatus.propTypes = {
  step: PropTypes.instanceOf(TaskStep).isRequired,
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
const PointsAndFeedback = observer(({ step }) => {
  if (!step.isOpenEndedExercise || isNil(step.grader_points)) {
    return null;
  }

  return (
    <StyledPoints>
      <div>
        <Label>Points:</Label>
        <Value>
          {S.numberWithOneDecimalPlace(step.grader_points)} / {S.numberWithOneDecimalPlace(step.available_points)}
        </Value>
      </div>
      {step.grader_comments && (
        <div>
          <Label>Feedback:</Label>
          <span>{step.grader_comments}</span>
        </div>)}
    </StyledPoints>
  );
});
PointsAndFeedback.propTypes = {
  step: PropTypes.instanceOf(TaskStep).isRequired,
};


export { WRQStatus, PointsAndFeedback };