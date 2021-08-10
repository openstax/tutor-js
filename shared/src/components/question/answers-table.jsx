import PropTypes from 'prop-types';
import React from 'react';
import { range, map, zip, keys, isNil, extend } from 'lodash';
import { observer } from 'mobx-react';
import { action, modelize } from '../../model';
import { idType } from '../../helpers/react';
import keymaster from 'keymaster';
import keysHelper from '../../helpers/keys';
import ExerciseQuestion, { ReviewQuestion } from '../../model/exercise/question';
import Answer from './answer';
import { Feedback } from './feedback';
import Instructions  from './instructions';


const KEYS =
  { 'multiple-choice-numbers': range(1, 10) }; // 1 - 9

// a - i
KEYS['multiple-choice-alpha'] = map(
    KEYS['multiple-choice-numbers'],
    (k) => keysHelper.getCharFromNumKey(k, 1)
);

KEYS['multiple-choice'] = zip(KEYS['multiple-choice-numbers'], KEYS['multiple-choice-alpha']);

const KEYSETS_PROPS = keys(KEYS);
KEYSETS_PROPS.push(null); // keySet could be null for disabling keyControling

let idCounter = 0;

@observer
export default
class AnswersTable extends React.Component {

    static propTypes = {
        question: PropTypes.oneOfType([
            PropTypes.instanceOf(ExerciseQuestion),
            PropTypes.instanceOf(ReviewQuestion),
        ]).isRequired,
        type: PropTypes.string.isRequired,
        answer_id: idType,
        correct_answer_id: idType,
        incorrectAnswerId: idType,
        feedback_html: PropTypes.string,
        correct_answer_feedback_html: PropTypes.string,
        answered_count: PropTypes.number,
        show_all_feedback: PropTypes.bool,
        onChange: PropTypes.func,
        hideAnswers: PropTypes.bool,
        hasCorrectAnswer: PropTypes.bool,
        onChangeAttempt: PropTypes.func,
        keySet: PropTypes.oneOf(KEYSETS_PROPS),
        focus: PropTypes.bool,
        project: PropTypes.string,
        choicesEnabled: PropTypes.bool,
    };

    static defaultProps = {
        type: 'student',
        show_all_feedback: false,
        keySet: 'multiple-choice',
    };

    constructor(props, context) {
        super(props, context);
        modelize(this)
        const originalKeyScope = this.getOriginalKeyScope();


        this.state = {
            answer_id: null,
            originalKeyScope,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const originalKeyScope = this.getOriginalKeyScope(nextProps);
        if (originalKeyScope != null) { this.setState({ originalKeyScope }); }
        if (nextProps.answer_id !== this.state.answer_id) { this.setState({ answer_id: null }); }

        if (!isNil(this.props.keySet) && isNil(nextProps.keySet)) { this.resetToOriginalKeyScope(); }
    }

    componentWillUnmount() {
        this.resetToOriginalKeyScope();
    }

    getOriginalKeyScope = (props) => {
        if (props == null) { ({ props } = this); }

        const originalKeyScope = keymaster.getScope();
        if ((props.keySet !== originalKeyScope) && (originalKeyScope !== (this.state != null ? this.state.originalKeyScope : undefined))) {
            originalKeyScope;
        }
    };

    resetToOriginalKeyScope = () => {
        const { originalKeyScope } = this.state;
        if (originalKeyScope != null) { keymaster.setScope(originalKeyScope); }
        this.setState({ originalKeyScope: undefined });
    };

    @action.bound onChangeAnswer(answer, changeEvent) {
        if (this.props.onChange) {
            this.setState({ answer_id: answer.id });
            return (
                this.props.onChange(answer)
            );
        } else {
            if (changeEvent != null) {
                changeEvent.preventDefault();
            }
            return (
                (typeof this.props.onChangeAttempt === 'function' ? this.props.onChangeAttempt(answer) : undefined)
            );
        }
    }

    shouldInstructionsShow = () => {
        const { type, question, answer_id } = this.props;
        return (
            (question.formats.length > 1) &&
                !['teacher-preview', 'teacher-review', 'student-mpp'].includes(type)
        );
    };

    hasIncorrectAnswer = () => {
        const { answer_id, correct_answer_id, incorrectAnswerId, choicesEnabled } = this.props;
        if (answer_id === incorrectAnswerId) {
            return true;
        }
        return (
            !!(answer_id && !choicesEnabled && (answer_id !== correct_answer_id))
        );
    };

    render() {
        let instructions;
        const feedback = [];

        const {
            question, hideAnswers, type, answered_count, choicesEnabled, correct_answer_id,
            incorrectAnswerId, answer_id, feedback_html, correct_answer_feedback_html,
            show_all_feedback, keySet, project, hasCorrectAnswer, focus,
        } = this.props;
        if (hideAnswers) { return null; }

        const { answers, id } = question;

        const chosenAnswer = [answer_id, this.state.answer_id];

        const questionAnswerProps = {
            qid: id || `auto-${idCounter++}`,
            correctAnswerId: correct_answer_id,
            incorrectAnswerId,
            hasCorrectAnswer,
            chosenAnswer,
            onChangeAnswer: this.onChangeAnswer,
            type,
            answered_count,
            disabled: !choicesEnabled,
            show_all_feedback,
        };

        const answersHtml = map(answers, function(answer, i) {
            const additionalProps = { answer, iter: i, key: `${questionAnswerProps.qid}-option-${i}` };
            if (focus) { additionalProps.keyControl = KEYS[keySet] != null ? KEYS[keySet][i] : undefined; }
            const answerProps = extend({}, additionalProps, questionAnswerProps);


            if (answer.id === answer_id && feedback_html) {
                feedback.push({ index: i, html: feedback_html })
            } else if (answer.id === correct_answer_id && correct_answer_feedback_html) {
                feedback.push({ index: i, html: correct_answer_feedback_html })
            }

            return (
                <Answer {...answerProps} />
            );
        });

        feedback.forEach((item, i) => {
            const spliceIndex = item.index + i + 1;
            answersHtml.splice(spliceIndex, 0, (
                <Feedback key="question-mc-feedback" key={spliceIndex}>
                    {item.html}
                </Feedback>
            ));
        });

        if (this.shouldInstructionsShow()) {
            instructions = (
                <Instructions
                    project={project}
                    hasFeedback={feedback_html != null}
                    hasIncorrectAnswer={this.hasIncorrectAnswer()}
                />
            )
        }

        return (
            <div className="answers-table">
                {instructions}
                {answersHtml}
            </div>
        );
    }
}
