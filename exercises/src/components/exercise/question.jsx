import PropTypes from 'prop-types';
import React from 'react';
import { modelize } from 'shared/model'
import { Alert } from'react-bootstrap';
import { SuretyGuard, Icon } from 'shared';
import { partial } from 'lodash';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import QuestionModel  from 'shared/model/exercise/question';
import AnswerModel from 'shared/model/exercise/answer'
import QuestionFormatType from './question-format-type';
import Answer from './answer';

@observer
export default
class Question extends React.Component {
    static propTypes = {
        question: PropTypes.instanceOf(QuestionModel).isRequired,
        onMove: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound setCorrectAnswer(answer) {
        this.props.question.setCorrectAnswer(answer);
    }

    @action.bound updateStimulus(ev) {
        this.props.question.stimulus_html = ev.target.value;
    }

    @action.bound updateStem(event) {
        this.props.question.stem_html = event.target.value;
    }

    @action.bound updateSolution(event) {
        const { question } = this.props;
        question.collaborator_solution_html = event.target.value;
    }

    @action.bound updateSummary(event) {
        const { question } = this.props;
        question.summary_html = event.target.value;
    }

    @action.bound addAnswer() {
        this.props.question.answers.push(new AnswerModel());
    }

    @action.bound removeAnswer(answer) {
        this.props.question.answers.remove(answer);
    }

    @action.bound moveAnswer(answer, direction) {
        this.props.question.moveAnswer(answer, direction);
    }

    renderControls() {
        const { onMove, onRemove, question, question: { exercise } } = this.props;
        const canMoveLeft = question.index > 0;
        const canMoveRight = question.index < exercise.questions.length - 1;
        return (
            <div className="controls">
                {canMoveLeft &&
                    <Icon type="arrow-circle-left"
                        className="move-question"
                        onClick={partial(onMove, question, -1)}
                    />}
                <SuretyGuard
                    onConfirm={partial(onRemove, question)}
                    onlyPromptIf={function() { return question.isChanged; }}
                    message="Removing a question will permanently remove the question and it's answers">
                    <a className="remove-question">
                        <Icon type="trash" />
                        <span>Remove Question</span>
                    </a>
                </SuretyGuard>
                {canMoveRight &&
                    <Icon type="arrow-circle-right"
                        className="move-question"
                        onClick={partial(onMove, question, 1)}
                    />}
            </div>
        );
    }

    render() {
        const {
            question,
        } = this.props;
        const { validity } = question;

        return (
            <div className="question">

                {question.exercise.isMultiPart && this.renderControls()}

                {!validity.valid && (
                    <Alert variant="warning">
                        To save your work, you must fill out the {validity.part}
                    </Alert>)}

                <QuestionFormatType question={question} addAnswer={this.addAnswer} />
                {!question.exercise.isMultiPart && (
                    <div className="question-stimulus">
                        <label>
                            Question Stimulus
                        </label>
                        <textarea
                            onChange={this.updateStimulus}
                            defaultValue={question.stimulus_html} />
                    </div>
                )}
                <div>
                    <label>
                        Question Stem
                    </label>
                    <textarea onChange={this.updateStem} value={question.stem_html} />
                </div>

                <div>
                    <label>Answers</label>
                    <Icon tooltip="Add New" type="plus-square" onClick={this.addAnswer} />
                    <ol className="answer-choices">
                        {question.answers.map((answer, index) => (
                            <Answer
                                key={answer.id || `index-${index}`}
                                answer={answer}
                                canMoveUp={index !== (question.answers.length - 1)}
                                canMoveDown={index !== 0}
                                moveAnswer={this.moveAnswer}
                                changeCorrect={this.setCorrectAnswer}
                                removeAnswer={this.removeAnswer}
                                changeAnswer={this.changeAnswer}
                            />))}
                    </ol>
                </div>
                <div>
                    <label>
                        Detailed Solution
                    </label>
                    <textarea onChange={this.updateSolution} value={question.collaborator_solution_html} />
                    <label>
                        Summary
                    </label>
                    <textarea onChange={this.updateSummary} value={question.summary_html} />
                </div>
            </div>
        );
    }
}
