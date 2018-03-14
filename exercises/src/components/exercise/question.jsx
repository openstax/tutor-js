import React from 'react';
import { Alert } from'react-bootstrap';
import { partial, isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import Question  from 'shared/model/exercise/question';

// import BS from 'react-bootstrap';
//
// import _ from 'underscore';
//
// import { SuretyGuard } from 'shared';
import QuestionFormatType from './question-format-type';
// import Answer from './answer';
// import { QuestionActions, QuestionStore } from 'stores/question';
// import { AnswerActions, AnswerStore } from 'stores/answer';

@observer
export default class extends React.Component {
  static displayName = 'Question';

  static propTypes = {
    question: React.PropTypes.instanceOf(Question).isRequired,
  };

  // state = {};
  // update = () => { return this.forceUpdate(); };

  // componentWillMount() {
  //   return (
  //       QuestionStore.addChangeListener(this.update)
  //   );
  // }

  // componentWillUnmount() {
  //   return (
  //       QuestionStore.removeChangeListener(this.update)
  //   );
  // }

  // sync = () => {
  //   this.props.sync();
  //   return (
  //       this.forceUpdate()
  //   );
  // };

  changeAnswer = (answerId) => {
    const curAnswer = QuestionStore.getCorrectAnswer(this.props.id);
    QuestionActions.setCorrectAnswer(this.props.id, answerId, curAnswer != null ? curAnswer.id : undefined);
    return (
        this.sync()
    );
  };

  updateStimulus = (event) => {
    QuestionActions.updateStimulus(this.props.id, event.target != null ? event.target.value : undefined);
    return (
        this.sync()
    );
  };

  @action.bound updateStem(event) {
    this.props.question.stem_html = event.target.value;
  }

  @action.bound updateSolution(event) {
    if (isEmpty(this.props.question.collaborator_solutions)) {
      this.props.question.collaborator_solutions = [{}];
    }
    this.props.question.collaborator_solutions[0].content_html = event.target.value;
  }

  addAnswer = () => {
    QuestionActions.addNewAnswer(this.props.id);
    return (
        this.sync()
    );
  };

  removeAnswer = (answerId) => {
    QuestionActions.removeAnswer(this.props.id, answerId);
    return (
        this.sync()
    );
  };

  moveAnswer = (answerId, direction) => {
    QuestionActions.moveAnswer(this.props.id, answerId, direction);
    return (
        this.sync()
    );
  };

  multipleChoiceClicked = (event) => { return QuestionActions.toggleMultipleChoiceFormat(this.props.id); };
  freeResponseClicked = (event) => { return QuestionActions.toggleFreeResponseFormat(this.props.id); };


  renderControls() {
    const { question } = this.props;

    <div className="controls">
      {canMoveLeft &&
        <a className="move-question" onClick={partial(moveQuestion, question, -1)}>
          <i className="fa fa-arrow-circle-left" />
        </a>}
      <SuretyGuard
        onConfirm={removeQuestion}
        onlyPromptIf={function() { return QuestionStore.isChanged(id) }}
        message="Removing a question will permanently remove the question and it's answers">
        <a className="remove-question">
          <i className="fa fa-trash" />
          Remove Question
        </a>
      </SuretyGuard>
      {canMoveRight &&
        <a className="move-question" onClick={partial(moveQuestion, question, 1)}>
          <i className="fa fa-arrow-circle-right" />
        </a>}
    </div>
  }


  render() {
    const {
      question, removeQuestion, moveQuestion, canMoveLeft, canMoveRight
    } = this.props;


    const { validity } = question;
    const answers = [];


    // const iterable = QuestionStore.getAnswers(id);
    // for (let index = 0; index < iterable.length; index++) {
    //   const answer = iterable[index];
    //   answers.push();
    // }

    return (
      <div className="question">

        {removeQuestion && this.renderControls()}

        {!validity.valid && (
           <Alert bsStyle="warning">
             To save your work, you must fill out the {validity.part}
           </Alert>)}

        <QuestionFormatType question={question} />

        <div>
          <label>
            Question Stem
          </label>
          <textarea onChange={this.updateStem} value={question.stem_html} />
        </div>

        <div>
          <label>Answers:</label>
          <a className="pull-right" onClick={this.addAnswer}>
            Add New
          </a>
          <ol>
            {question.answers.map((answer, index) => (
              <Answer
                key={answer.id}
                sync={this.props.sync}
                id={answer.id}
                canMoveUp={index !== (question.answers.length - 1)}
                canMoveDown={index !== 0}
                moveAnswer={this.moveAnswer}
                removeAnswer={this.removeAnswer}
                changeAnswer={this.changeAnswer}
              />))}
          </ol>
        </div>
        <div>
          <label>
            Detailed Solution
          </label>
          <textarea onChange={this.updateSolution} value={question.solution_html} />
        </div>
      </div>
    );
  }
}
