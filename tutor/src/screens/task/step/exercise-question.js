import {
    React, PropTypes, observer, styled, action,
    observable, computed, modelize, runInAction,
} from 'vendor';
import UX from '../ux';
import keymaster from 'keymaster';
import { StepFooter } from './footer';
import { Button } from 'react-bootstrap';
import { Question, AsyncButton } from 'shared';
import { StudentTaskStep } from '../../../models';
import QuestionModel from 'shared/model/exercise/question';
import { FreeResponseInput, FreeResponseReview } from './exercise-free-response';
import SavePracticeButton from '../../../components/buttons/save-practice';
import { breakpoint } from 'theme';
import ScoresHelper from '../../../helpers/scores';

const Footer = styled.div`
  margin: 2.5rem 0;
  display: flex;
  justify-content: space-between;
  font-size: 1.4rem;
  line-height: 2rem;

  ${breakpoint.mobile`
    button {
      width: 50%;
    }
  `}

  > * {
    width: 25%;
  }

  .points .attempts-left {
    color: #F36B32;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    flex-flow: column wrap-reverse;
  }

  .save-practice-button {
    margin-top: 2rem;
  }
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
  .openstax-answer {
    border-top: 1px solid #d5d5d5;
    margin: 10px 0;
    padding: 10px 0;
  }
`;


@observer
export default class ExerciseQuestion extends React.Component {
    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
        step: PropTypes.instanceOf(StudentTaskStep).isRequired,
        question: PropTypes.instanceOf(QuestionModel).isRequired,
    }

    @observable selectedAnswer = null;

    constructor(props) {
        super(props);
        modelize(this);
        window.eq = this;
    }

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
        step.clearIncorrectFeedback();
    }

    @action.bound async onAnswerSave() {
        const { ux, step } = this.props;

        ux.setCurrentMultiPartStep(step);
        await ux.onAnswerSave(step, this.selectedAnswer);
        runInAction(() => {
            this.selectedAnswer = null;
        })
    }

    @action.bound onNextStep() {
        const { ux, step } = this.props;
        ux.onAnswerContinue(step);
    }

    @action.bound async addOrRemovePracticeQuestion() {
        if (this.practiceQuestion) {
            this.practiceQuestion.destroy();
        }
        else {
            const { ux, step } = this.props;
            ux.course.practiceQuestions.create({ tasked_exercise_id: step.tasked_id });
        }
    }

    @computed get answerId() {
        return this.selectedAnswer ?
            this.selectedAnswer.id : this.props.step.answer_id;
    }

    @computed get practiceQuestion() {
        const { ux, step } = this.props;
        return ux.course.practiceQuestions.findByExerciseId(step.exercise_id);
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
                Submit
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

    renderMultipleAttempts(step) {
        const word = 'attempt';
        const count = step.attempts_remaining;

        return (
            <div>{count} {word}{count === 1 ? '' : 's'} left</div>
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
                    incorrectAnswerId={step.incorrectAnswerId}
                >
                    <FreeResponseReview course={course} step={step} />
                </Question>
                <Footer>
                    <div className="points">
                        <strong>Points: {ScoresHelper.formatPoints(step.available_points)}</strong>
                        <span className="attempts-left">{ux.hasMultipleAttempts && this.renderMultipleAttempts(step)}</span>
                    </div>
                    <div className="controls">
                        {step.canAnswer && this.needsSaved ?
                            this.renderSaveButton() : this.renderNextButton()}
                        {ux.canSaveToPractice && (
                            <SavePracticeButton
                                practiceQuestions={ux.course.practiceQuestions}
                                taskStep={step}
                            />)}
                    </div>
                </Footer>
                <StepFooter course={course} step={step} />
            </StyledExerciseQuestion>
        );
    }
}
