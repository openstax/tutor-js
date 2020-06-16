import {
  React, PropTypes, observer, styled, action, css, moment,
} from 'vendor';
import { Button } from 'react-bootstrap';
import TaskStep from '../../../models/student-tasks/step';
import ResponseValidation from '../../../models/response_validation';
import Question from 'shared/model/exercise/question';
import TaskUX from '../ux';
import { WRQStatus, PointsAndFeedback } from './wrq-status';
import QuestionStem from './question-stem';
import { colors } from '../../../theme';
import Course from '../../../models/course';
import { StepFooter } from './footer';
import { ResponseValidationUX } from '../response-validation-ux';
import { NudgeMessages, NudgeMessage } from './nudge-message';

const StyledFreeResponse = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextAreaErrorStyle = css`
  background-color: #f5e9ea;
`;

const InfoRow = styled.div`
  margin: 8px 0;
  display: flex;
  justify-content: ${props => props.hasSubmitted ? 'space-between' : 'flex-end'};
  span {
    font-size: 12px;
    line-height: 16px;
    + span {
      margin-left: 1rem;
    }
  }
`;

const ControlsRow = styled.div`
  margin: 24px 0;
  display: flex;
  justify-content: ${props => props.isDisplayingNudge ? 'space-between' : 'flex-end'};
  align-items: stretch;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 10.5em;
  line-height: 1.5em;
  margin: 2.5rem 0 0 0;
  padding: 0.5em;
  border: 1px solid ${colors.neutral.std};
  color: ${colors.neutral.dark};
  ${props => props.isErrored && TextAreaErrorStyle};
  background-color: ${props => props.readOnly && colors.neutral.cool};
`;
TextArea.displayName = 'TextArea';

const AnswerButton = styled(Button)`
  margin: 0;
  min-width: 12rem;
`;
AnswerButton.displayName = 'AnswerButton';

const StyledRevertButton = styled(Button)`
  min-width: 10rem;
  margin-right: 2rem;
`;
const RevertButton = observer(({ ux, ux: { course, step } }) => {
  if (!(step.isOpenEndedExercise &&
        !step.can_be_updated &&
        !step.last_completed_at &&
        course.currentRole.isTeacher)) {
    return null;
  }

  return (
    <StyledRevertButton
      variant="secondary"
      disabled={!ux.textHasChanged}
      onClick={ux.cancelWRQResubmit}
    >
      Cancel
    </StyledRevertButton>
  );
  
});

@observer
class FreeResponseReview extends React.Component {
  static propTypes = {
    step: PropTypes.instanceOf(TaskStep).isRequired,
  };
  render() {
    const { step } = this.props;
    if (!step.free_response) { return null; }
    return (
      <div className="free-response">{step.free_response}</div>
    );
  }
}

@observer
class FreeResponseInput extends React.Component {

  static propTypes = {
    questionNumber: PropTypes.number,
    course: PropTypes.instanceOf(Course).isRequired,
    step: PropTypes.instanceOf(TaskStep).isRequired,
    question: PropTypes.instanceOf(Question).isRequired,
    taskUX: PropTypes.instanceOf(TaskUX).isRequired,
    response_validation: PropTypes.instanceOf(ResponseValidation),
  };

  ux = new ResponseValidationUX({
    step: this.props.step,
    taskUX: this.props.taskUX,
    messages: NudgeMessages,
    validator: this.props.response_validation,
  });

  @action.bound onSave() {
    const { taskUX, step } = this.props;
    taskUX.setCurrentMultiPartStep(step);
    this.ux.onSave();
  }

  render() {
    const { ux, props: { questionNumber, course, step, question } } = this;
    return (
      <StyledFreeResponse
        data-test-id="student-free-response"
      >
        <QuestionStem
          questionNumber={questionNumber}
          question={question}
        />
        <TextArea
          value={ux.response}
          onChange={ux.setResponse}
          data-test-id="free-response-box"
          placeholder="Enter your response..."
          isErrored={ux.displayNudgeError}
          aria-label="question response text box"
          readOnly={ux.taskUX.isReadOnly}
        />
        <InfoRow hasSubmitted={!!ux.lastSubmitted}>
          {ux.lastSubmitted && <span>Last submitted on {moment(ux.lastSubmitted).format('MMM DD [at] hh:mm A')}</span>}
          <span>{ux.responseWords} words</span>
        </InfoRow>
        <ControlsRow isDisplayingNudge={ux.isDisplayingNudge}>
          {ux.isDisplayingNudge &&
            <NudgeMessage course={course} step={step} ux={ux} />}
          <PointsAndFeedback step={step} />
          <RevertButton size="lg" ux={ux} />
          <AnswerButton size="lg" data-test-id="submit-answer-btn" disabled={ux.isSubmitDisabled} onClick={this.onSave}>
            {ux.submitBtnLabel}
          </AnswerButton>
        </ControlsRow>
        <WRQStatus step={step} />
        <StepFooter
          hideContentLink={ux.isDisplayingNudge}
          course={course} step={step} />
      </StyledFreeResponse>
    );
  }

}

export { FreeResponseInput, FreeResponseReview };
