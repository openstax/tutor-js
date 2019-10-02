import {
  React, PropTypes, observer, styled, action, css,
} from 'vendor';
import { Button } from 'react-bootstrap';
import TaskStep from '../../../models/student-tasks/step';
import ResponseValidation from '../../../models/response_validation';
import Question from 'shared/model/exercise/question';
import TaskUX from '../ux';
import QuestionStem from './question-stem';
import Theme from '../../../theme';
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

const ControlsRow = styled.div`
  margin: 2.5rem 0;
  display: flex;
  justify-content: ${props => props.isDisplayingNudge ? 'space-between' : 'flex-end'};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 8em;
  line-height: 1.5em;
  margin: 2.5rem 0 0 0;
  padding: 0.75em;
  border: 1px solid ${Theme.colors.neutral.std};
  ${props => props.isErrored && TextAreaErrorStyle}
`;
TextArea.displayName = 'TextArea';

const AnswerButton = styled(Button)`
  align-self: flex-start;
  margin: 0;
`;
AnswerButton.displayName = 'AnswerButton';


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
    messages: NudgeMessages,
    validator: this.props.response_validation,
  });

  textArea = React.createRef();

  @action.bound onSave() {
    const { taskUX, step } = this.props;

    taskUX.setCurrentMultiPartStep(step);
    this.ux.onSave();
  }

  render() {
    const { ux, props: { questionNumber, course, step, question } } = this;

    return (
      <StyledFreeResponse>
        <QuestionStem
          questionNumber={questionNumber}
          question={question}
        />
        <TextArea
          ref={this.textArea}
          value={ux.response}
          onChange={ux.setResponse}
          placeholder="Enter your response"
          isErrored={ux.displayNudgeError}
          aria-label="question response text box"
        />
        <ControlsRow isDisplayingNudge={ux.isDisplayingNudge}>
          {ux.isDisplayingNudge &&
            <NudgeMessage course={course} step={step} ux={ux} />}
          <AnswerButton size="lg" disabled={ux.isSubmitDisabled} onClick={this.onSave}>
            {ux.submitBtnLabel}
          </AnswerButton>
        </ControlsRow>
        <StepFooter
          hideContentLink={ux.isDisplayingNudge}
          course={course} step={step} />
      </StyledFreeResponse>
    );
  }

}

export { FreeResponseInput, FreeResponseReview };
