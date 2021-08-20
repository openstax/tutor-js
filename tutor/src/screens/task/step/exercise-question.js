import {
    React, PropTypes, observer, styled, action,
    observable, computed, modelize, runInAction,
} from 'vendor';
import UX from '../ux';
import keymaster from 'keymaster';
import { Button } from 'react-bootstrap';
import { Question, AsyncButton } from 'shared';
import { StudentTaskStep } from '../../../models';
import QuestionModel from 'shared/model/exercise/question';
import { FreeResponseInput, FreeResponseReview } from './exercise-free-response';
import { breakpoint, colors } from 'theme';
import ScoresHelper from '../../../helpers/scores';
import { StepCardFooter } from './card';
import { PointsAndFeedback } from './wrq-status';
import { isNil } from 'lodash';

const StyledExerciseQuestion = styled.div`
  font-size: 2rem;
  line-height: 3.5rem;

  .question-body {
      margin-left: 2rem; // TODO: Still needed? Something for iframes?
  }

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

    renderPoints(step) {
        const points = [step.available_points];

        if (!isNil(step.published_points_without_lateness)) {
            points.unshift(step.published_points);
        }
        console.log(points)
        return points.map((p) => ScoresHelper.formatPoints(p)).join(' / ');
    }

    renderFeedback(step) {
        if (!step.published_comments) { return null; }

        return (
            <div>
                <strong>Feedback:</strong> {step.published_comments}
            </div>
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
                    correct_answer_feedback_html={step.correct_answer_feedback_html}
                    hasCorrectAnswer={step.hasCorrectAnswer}
                    correct_answer_id={step.is_completed ? step.correct_answer_id : null}
                    incorrectAnswerId={step.incorrectAnswerId}
                    className="step-card-body"
                >
                    <FreeResponseReview course={course} step={step} />
                </Question>
                <StepCardFooter>
                    <div className="points">
                        <strong>Points: {this.renderPoints(step)}</strong>
                        <span className="attempts-left">{ux.hasMultipleAttempts && this.renderMultipleAttempts(step)}</span>
                        {this.renderFeedback(step)}
                        {step.isOpenEndedExercise && step.detailedSolution && (<div><strong>Detailed solution:</strong> {step.detailedSolution}</div>)}
                    </div>
                    <div className="controls">
                        {step.canAnswer && this.needsSaved ?
                            this.renderSaveButton() : this.renderNextButton()}
                    </div>
                </StepCardFooter>
            </StyledExerciseQuestion>
        );
    }
}
