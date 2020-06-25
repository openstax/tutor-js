import React from 'react';
import PropTypes from 'prop-types';
import { partial, pick, debounce } from 'lodash';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import keymaster from 'keymaster';
import Icon from '../icon';
import { idType } from '../../helpers/react';
import keysHelper from '../../helpers/keys';
import ArbitraryHtmlAndMath from '../html';
import { SimpleFeedback } from './feedback';
import cn from 'classnames';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

let idCounter = 0;

const isAnswerCorrect = function(answer, correctAnswerId) {
  let isCorrect = answer.id === correctAnswerId;
  if (answer.correctness != null) { isCorrect = (answer.correctness === '1.0'); }

  return (

    isCorrect

  );
};

const isAnswerChecked = (answer, chosenAnswer) => Boolean((chosenAnswer || []).find( a => a == answer.id));

export default
@observer
class Answer extends React.Component {

  static propTypes = {
    answer: PropTypes.object.isRequired, // both shared exercise/answer and tutor/reviewanswer is passed in
    iter: PropTypes.number.isRequired,
    qid: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    type: PropTypes.string.isRequired,
    hasCorrectAnswer: PropTypes.bool.isRequired,
    onChangeAnswer: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    chosenAnswer: PropTypes.array,
    correctAnswerId: idType,
    answered_count: PropTypes.number,
    show_all_feedback: PropTypes.bool,
    keyControl: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]),
  };

  static defaultProps = {
    disabled: false,
    show_all_feedback: false,
  };

  static contextTypes = {
    processHtmlAndMath: PropTypes.func,
  };

  UNSAFE_componentWillMount() {
    if (this.shouldKey()) { this.setUpKeys(); }
  }

  componentWillUnmount() {
    const { keyControl } = this.props;
    if (keyControl != null) { keysHelper.off(keyControl, 'multiple-choice'); }
  }

  componentDidUpdate(prevProps) {
    const { keyControl } = this.props;

    if (this.shouldKey(prevProps) && !this.shouldKey()) {
      keysHelper.off(prevProps.keyControl, 'multiple-choice');
    }

    if (this.shouldKey() && (prevProps.keyControl !== keyControl)) {
      this.setUpKeys();
    }
  }

  shouldKey = (props) => {
    if (props == null) { ({ props } = this); }
    const { keyControl, disabled } = props;

    return (

      (keyControl != null) && !disabled

    );
  };

  setUpKeys = () => {
    const { answer, onChangeAnswer, keyControl } = this.props;

    const keyInAnswer = debounce(partial(onChangeAnswer, answer), 200, {
      leading: true,
      trailing: false,
    });
    keysHelper.on(keyControl, 'multiple-choice', keyInAnswer);
    return (
      keymaster.setScope('multiple-choice')
    );
  };

  onKeyPress = (ev) => {
    if ((ev.key === 'Enter') && (this.props.disabled !== true)) { this.onChange(); }
    return (
      null
    );
  }; // silence react event return value warning

  @action.bound onChange() {
    this.props.onChangeAnswer(this.props.answer);
  }

  render() {
    let feedback, onChange, radioBox, selectedCount, correctIncorrectIcon;
    let { answer, iter, qid, type, correctAnswerId, answered_count, hasCorrectAnswer, chosenAnswer, disabled } = this.props;
    if (qid == null) { qid = `auto-${idCounter++}`; }

    const isChecked = isAnswerChecked(answer, chosenAnswer);
    const isCorrect = isAnswerCorrect(answer, correctAnswerId);

    const classes = cn('answers-answer', {
      'disabled': disabled,
      'answer-checked': isChecked,
      'answer-correct': isCorrect,
    }
    );

    if (!hasCorrectAnswer && (type !== 'teacher-review') && (type !== 'teacher-preview')) {
      ({ onChange } = this);
    }

    if (onChange) {
      radioBox = <input
        type="radio"
        className="answer-input-box"
        checked={isChecked}
        id={`${qid}-option-${iter}`}
        name={`${qid}-options`}
        onChange={onChange}
        disabled={disabled} />;
    }
    if (type === 'teacher-review') {
      const percent = Math.round((answer.selected_count / answered_count) * 100) || 0;
      selectedCount = (
        <span
          className="selected-count"
          data-percent={`${percent}`}
        >
          {answer.selected_count}
        </span>
      );
    }
    if (type === 'teacher-preview') {
      correctIncorrectIcon = (
        <div className="correct-incorrect">
          {isCorrect && <Icon type="check" color="green" />}
        </div>
      );
    }

    if (this.props.show_all_feedback && answer.feedback_html) {
      feedback = <SimpleFeedback key="question-mc-feedback">
        {answer.feedback_html}
      </SimpleFeedback>;
    }

    let ariaLabel = `${isChecked ? 'Selected ' : ''}Choice ${ALPHABET[iter]}`;
    // somewhat misleading - this means that there is a correct answer,
    // not necessarily that this answer is correct
    if (this.props.hasCorrectAnswer) {
      ariaLabel += `(${isCorrect ? 'Correct' : 'Incorrect'} Answer)`;
    }
    ariaLabel += ':';
    const htmlAndMathProps = pick(this.context, ['processHtmlAndMath']);

    let body = '';
    if (type === 'teacher-review') {
      body = (
        <div className="review-wrapper">
          <div className={cn('review-count', { 'green': isCorrect, 'red': !isCorrect })}>
            {selectedCount}
            <span className={cn('letter', { 'green': isCorrect, 'red': !isCorrect })}>
              {ALPHABET[iter]}
            </span>
          </div>
          <div className="answer-answer">
            <ArbitraryHtmlAndMath
              {...htmlAndMathProps}
              className="answer-content"
              html={answer.content_html} />
            {feedback}
          </div>
        </div>
      );
    } else {
      body = (
        <>
          {correctIncorrectIcon}
          {selectedCount}
          {radioBox}
          <label
            onKeyPress={this.onKeyPress}
            htmlFor={`${qid}-option-${iter}`}
            className="answer-label">
            <button
              onClick={onChange}
              aria-label={ariaLabel}
              className="answer-letter"
              disabled={disabled}>
              {ALPHABET[iter]}
            </button>
            <div className="answer-answer">
              <ArbitraryHtmlAndMath
                {...htmlAndMathProps}
                className="answer-content"
                html={answer.content_html} />
              {feedback}
            </div>
          </label>
        </>
      );
    }

    return (
      <div className="openstax-answer">
        <section role="region" className={classes}>
          {body}
        </section>
      </div>
    );
  }
}
