import {
  React, PropTypes, observer, styled, action, css,
} from '../../../helpers/react';
import { invoke } from 'lodash';
import { Button } from 'react-bootstrap';
import TaskStep from '../../../models/student-tasks/step';
import ResponseValidation from '../../../models/response_validation';
import Question from 'shared/model/exercise/question';
import QuestionStem from './question-stem';
import Theme from '../../../theme';
import Course from '../../../models/course';
import { ExerciseFooter } from './exercise-footer';
import { ResponseValidationUX } from '../response-validation-ux';
import { FrNudgeHelp } from './fr-nudge-help';

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

const AnswerButton = styled(Button)`
  align-self: flex-start;
  margin: 0;
`;

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
    course: PropTypes.instanceOf(Course).isRequired,
    step: PropTypes.instanceOf(TaskStep).isRequired,
    question: PropTypes.instanceOf(Question).isRequired,
    response_validation: PropTypes.instanceOf(ResponseValidation),
  };

  ux = new ResponseValidationUX({
    step: this.props.step,
    validator: this.props.response_validation,
  });

  textArea = React.createRef();

  @action.bound async onSave() {
    await this.ux.onSave();
    invoke(this.textArea.current, 'focus');
  }

  render() {
    const { ux, props: { course, step, question } } = this;

    return (
      <StyledFreeResponse>
        <QuestionStem question={question} />
        <TextArea
          ref={this.textArea}
          value={ux.response}
          onChange={ux.setResponse}
          placeholder="Enter your response"
          isErrored={ux.isTextaAreaErrored}
          aria-label="question response text box"
        />
        <ControlsRow isDisplayingNudge={ux.isDisplayingNudge}>
          {ux.isDisplayingNudge &&
            <FrNudgeHelp course={course} step={step} ux={ux} />}
          <AnswerButton disabled={ux.isSubmitDisabled} onClick={this.onSave}>
            {ux.submitBtnLabel}
          </AnswerButton>
        </ControlsRow>
        <ExerciseFooter hideContentLink={ux.isDisplayingNudge}
          course={course} step={step} />
      </StyledFreeResponse>
    );
  }

}

export { FreeResponseInput, FreeResponseReview };
