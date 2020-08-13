import {
  React, PropTypes, observer, styled, action, observable, computed,
} from 'vendor';
import UX from '../ux';
import keymaster from 'keymaster';
import { StepFooter } from './footer';
import { Button } from 'react-bootstrap';
import { Question, AsyncButton } from 'shared';
import Step from '../../../models/student-tasks/step';
import QuestionModel from 'shared/model/exercise/question';
import { FreeResponseInput, FreeResponseReview } from './exercise-free-response';
import { breakpoint } from 'theme';

const Controls = styled.div`
  margin: 2.5rem 0;
  display: flex;
  justify-content: flex-end;
`;

const StyledExerciseQuestion = styled.div`
  font-size: 2rem;
  line-height: 3.5rem;
  margin-left: 2rem;

  ${breakpoint.tablet`
    margin: ${breakpoint.margins.tablet};
  `}
  ${breakpoint.mobile`
    margin: ${breakpoint.margins.mobile};
  `}
`;

export default
@observer
class ExerciseQuestion extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    step: PropTypes.instanceOf(Step).isRequired,
    question: PropTypes.instanceOf(QuestionModel).isRequired,
  }

  @observable selectedAnswer = null;

  @computed get needsSaved() {
    const { step } = this.props;
    return (
      !step.is_completed || step.api.isPending ||
        (this.answerId != step.answer_id)
    );

  }

  componentDidMount() {
    keymaster('enter', 'multiple-choice', this.onEnter);
  }

  componentWillUnmount() {
    keymaster.unbind('enter', 'multiple-choice');
  }

  @action.bound onEnter() {
    this.needsSaved && this.answerId ?
      this.onAnswerSave() : this.onNextStep();
  }

  @action.bound onAnswerChange(answer) {
    const { ux, step } = this.props;

    ux.setCurrentMultiPartStep(step);
    this.selectedAnswer = answer;
  }

  @action.bound async onAnswerSave() {
    const { ux, step } = this.props;

    ux.setCurrentMultiPartStep(step);
    await ux.onAnswerSave(step, this.selectedAnswer);
    this.selectedAnswer = null;
  }

  @action.bound onNextStep() {
    const { ux, step } = this.props;
    ux.onAnswerContinue(step);
  }

  @computed get answerId() {
    return this.selectedAnswer ?
      this.selectedAnswer.id : this.props.step.answer_id;
  }

  renderSaveButton() {
    const { step } = this.props;
    return (
      <AsyncButton
        size="lg"
        waitingText="Saving…"
        disabled={!this.answerId}
        onClick={this.onAnswerSave}
        isWaiting={step.api.isPending}
        data-test-id="submit-answer-btn"
      >
        Answer
      </AsyncButton>
    );
  }

  renderNextButton() {
    const { canUpdateCurrentStep } = this.props.ux;
    return (
      <Button size="lg" onClick={this.onNextStep} data-test-id="continue-btn">
        {canUpdateCurrentStep ? 'Continue' : 'Next'}
      </Button>
    );
  }

  render() {
    const { ux, question, step, ux: { course } } = this.props;
    const questionNumber = ux.questionNumberForStep(step);

    if (step.canEditFreeResponse) {
      return (
        <FreeResponseInput
          step={step} question={question}
          questionNumber={questionNumber}
          taskUX={ux}
          key={question.id} course={course}
        />
      );
    }

    return (
      <StyledExerciseQuestion data-test-id="student-exercise-question">
        <Question
          task={ux.task}
          question={question}
          choicesEnabled={!ux.isReadOnly && step.canAnswer}
          answer_id={this.answerId}
          focus={!step.multiPartGroup}
          questionNumber={questionNumber}
          onChange={this.onAnswerChange}
          feedback_html={step.feedback_html}
          hasCorrectAnswer={step.hasCorrectAnswer}
          correct_answer_id={step.is_completed ? step.correct_answer_id : null}
        >
          <FreeResponseReview course={course} step={step} />
        </Question>
        <Controls>
          {step.canAnswer && this.needsSaved ?
            this.renderSaveButton() : this.renderNextButton()}
        </Controls>
        <StepFooter course={course} step={step} />
      </StyledExerciseQuestion>
    );
  }
}
