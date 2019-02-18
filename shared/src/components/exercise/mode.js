import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { extend, isEmpty, pick, map, omit } from 'lodash';

import ArbitraryHtmlAndMath from '../html';
import Question from '../question';
import FreeResponse from './free-response';
import QuestionModel from '../../model/exercise/question';

const RESPONSE_CHAR_LIMIT = 10000;

import { propTypes, props } from './props';
const modeType = propTypes.ExerciseStepCard.panel;
const modeProps = extend({}, propTypes.ExFreeResponse, propTypes.ExMulitpleChoice, propTypes.ExReview, { mode: modeType });
modeProps.focusParent = PropTypes.object;

class ExMode extends React.Component {
  static defaultProps = {
    disabled: false,
    free_response: '',
    answer_id: '',
  };

  static displayName = 'ExMode';
  static propTypes = modeProps;

  constructor(props) {
    super(props);
    const { free_response, answer_id } = props;

    this.state = {
      freeResponse: free_response,
      answerId: answer_id,
    };
  }

  componentDidMount() {
    return this.setFocus();
  }

  componentDidUpdate(prevProps) {
    return this.setFocus(prevProps);
  }

  onAnswerChanged = (answer) => {
    if ((answer.id === this.state.answerId) || (this.props.mode !== 'multiple-choice')) { return; }
    this.setState({ answerId: answer.id });
    return (typeof this.props.onAnswerChanged === 'function' ? this.props.onAnswerChanged(answer) : undefined);
  };

  onFreeResponseChange = (ev) => {
    const freeResponse = ev.target.value;
    if (freeResponse.length <= RESPONSE_CHAR_LIMIT) {
      this.setState({ freeResponse });
      return (typeof this.props.onFreeResponseChange === 'function' ? this.props.onFreeResponseChange(freeResponse) : undefined);
    }
  };
  setFreeResponseRef = (textArea) => {
    this.freeResponseEl = textArea;
  }

  getFreeResponse = () => {
    const { mode, free_response, disabled } = this.props;
    const { freeResponse } = this.state;

    if (mode === 'free-response') {
      return (
        <textarea
          aria-label="question response text box"
          disabled={disabled}
          ref={this.setFreeResponseRef}
          placeholder="Enter your response"
          value={freeResponse}
          onChange={this.onFreeResponseChange} />
      );
    } else {
      return <FreeResponse free_response={free_response} />;
    }
  };

  setFocus = (prevProps = {}) => {
    let focusEl;
    const { mode, focus, id } = prevProps;
    if (this.props.mode === mode) { return; }

    if (this.props.mode === 'free-response') {
      focusEl = this.freeResponseEl;
    } else {
      focusEl = ReactDOM.findDOMNode(this.props.focusParent);
    }

    if (focusEl) {
      if (this.props.focus) {
        return (typeof focusEl.focus === 'function' ? focusEl.focus() : undefined);
      } else {
        return (typeof focusEl.blur === 'function' ? focusEl.blur() : undefined);
      }
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { free_response, answer_id, cachedFreeResponse } = nextProps;

    const nextAnswers = {};
    const freeResponse = free_response || cachedFreeResponse || '';

    if (this.state.freeResponse !== freeResponse) { nextAnswers.freeResponse = freeResponse; }
    if (this.state.answerId !== answer_id) { nextAnswers.answerId = answer_id; }

    if (!isEmpty(nextAnswers)) { return this.setState(nextAnswers); }
  }

  render() {
    let changeProps, stimulus;
    let { mode, content, onChangeAnswerAttempt, answerKeySet, choicesEnabled } = this.props;
    const { answerId } = this.state;

    if (!choicesEnabled) { answerKeySet = null; }

    const questionProperties = [
      'processHtmlAndMath',
      'choicesEnabled',
      'correct_answer_id',
      'task',
      'feedback_html',
      'type',
      'questionNumber',
      'project',
      'context',
      'focus',
    ];

    const questionProps = pick(this.props, questionProperties);
    if (mode === 'multiple-choice') {
      changeProps =
        { onChange: this.onAnswerChanged };
    } else if (mode === 'review') {
      changeProps =
        { onChangeAttempt: onChangeAnswerAttempt };
    }

    const htmlAndMathProps = pick(this.props, 'processHtmlAndMath');

    const { stimulus_html } = content;
    if ((stimulus_html != null ? stimulus_html.length : undefined) > 0) { stimulus = <ArbitraryHtmlAndMath
      {...htmlAndMathProps}
      className="exercise-stimulus"
      block={true}
      html={stimulus_html} />; }

    const questions = map(content.questions, question => {
      if (mode === 'free-response') { question = omit(question, 'answers'); }
      question = new QuestionModel(question);
      return (
        <Question
          {...questionProps}
          {...changeProps}
          key={`step-question-${question.id}`}
          question={question}
          answer_id={answerId}
          keySet={answerKeySet}
        >
          {this.getFreeResponse()}
        </Question>
      );
    });

    return (
      <div className="openstax-exercise">
        {stimulus}
        {questions}
      </div>
    );
  }
}


export { ExMode };
