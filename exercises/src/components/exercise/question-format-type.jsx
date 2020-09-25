import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'lodash';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import Question  from 'shared/model/exercise/question';

@observer
class QuestionFormatType extends React.Component {

  static propTypes = {
    question: PropTypes.instanceOf(Question).isRequired,
  };

  @action.bound updateRadioFormat(ev) {
    this.props.question.setExclusiveFormat(ev.target.value);
  }

  @action.bound setChoiceRequired(ev) {
    this.props.question.toggleFormat('free-response', !ev.target.checked);
  }

  @action.bound preserveOrderClicked(ev) {
    this.props.question.is_answer_order_important = ev.target.checked;
  }

  render() {
    const { question } = this.props;

    return (
      <div className="format-type">
        {map(question.allowedFormatTypes, (name, id) => (
          <div key={id}>
            <input
              type="radio"
              id={`input-${id}`}
              name={`${question.index}-formats`}
              value={id}
              onChange={this.updateRadioFormat}
              checked={question.hasFormat(id)}
            />
            <label htmlFor={`input-${id}`}>
              {name}
            </label>
          </div>
        ))}
        {question.isMultipleChoice && (
          <div className="multi-choice-boxes">
            <div className="requires-choices">
              <input
                type="checkbox"
                id="input-rq"
                checked={!question.hasFormat('free-response')}
                onChange={this.setChoiceRequired}
              />
              <label htmlFor="input-rq">
                Requires Choices
              </label>
            </div>
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
          </div>
        )}
      </div>
    );
  }
}


export default QuestionFormatType;
