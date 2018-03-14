import React from 'react';
import { map } from 'lodash';
import Question  from 'shared/model/exercise/question';

const PREFIX = 'format';
const TYPES = {
  'multiple-choice' : 'Multiple Choice',
  'true-false'      : 'True/False'
};

// Temporarily removed as options (not needed & causes 500 on BE)
//  'vocabulary'      : 'Vocabulary'
//  'open-ended'      : 'Open Ended'

class QuestionFormatType extends React.Component {

  static propTypes = {
    question: React.PropTypes.instanceOf(Question).isRequired,
  };

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

  updateFormat = (ev) => {
    const selected = ev.target.value;
    for (let id in TYPES) {
      const name = TYPES[id];
      QuestionActions.toggleFormat(this.props.questionId, id, selected === id);
    }
    return (
        this.props.sync()
    );
  };

  isFormatChecked = (name) => {
    return this.props.question.hasFormat(name);
  };

  setChoiceRequired = (ev) => {
    QuestionActions.toggleFormat(this.props.questionId, 'free-response', !ev.target.checked);
    return (
        this.props.sync()
    );
  };

  doesRequireChoices = () => {
    return (
        !this.isFormatChecked('free-response')
    );
  };

  preserveOrderClicked = (event) => {
    QuestionActions.togglePreserveOrder(this.props.questionId);
    return (
        this.props.sync()
    );
  };

  render() {
    const { question } = this.props;

    return (
      <div className="format-type">
      {map(TYPES, (name, id) => (
        <div key={id}>
          <input
            type="radio"
            id={`input-${id}`}
            name={`${this.props.questionId}-formats`}
            value={id}
            onChange={this.update}
            onClick={this.updateFormat}
            checked={this.isFormatChecked(id)} />
          <label htmlFor={`input-${id}`}>
            {name}
          </label>
        </div>
      ))}
      {question.isMultipleChoice && (
        <div className="requires-choices">
          <input
            type="checkbox"
            id="input-rq"
            checked={this.doesRequireChoices()}
            onChange={this.setChoiceRequired}
          />
          <label htmlFor="input-rq">
            Requires Choices
          </label>
        </div>)}
      {question.isMultipleChoice && (
        <div className="order-matters">
          <input
            type="checkbox"
            id="input-om"
            checked={question.is_answer_order_important}
            onChange={this.preserveOrderClicked}
          />
          <label htmlFor="input-om">
            Order Matters
          </label>
        </div>
      )}
      </div>
    );
  }
}


export default QuestionFormatType;
