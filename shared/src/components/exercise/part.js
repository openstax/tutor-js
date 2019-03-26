import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';

import camelCase from 'lodash/camelCase';

import ExerciseStepCard from './part-card';
import { propTypes } from './props';
let { step } = propTypes.ExerciseStepCard;

// TODO clean this up.
const REVIEW_CONTROL_PROPS = ['recoverFor', 'canTryAnother'];

const NOT_REVIEW_PROPS = ['onNextStep', 'canReview', 'disabled'];
const NOT_TEACHER_READ_ONLY_PROPS = _.union(NOT_REVIEW_PROPS, ['onStepCompleted', 'canTryAnother']);
const NOT_MULTIPLE_CHOICE_PROPS = _.union(REVIEW_CONTROL_PROPS, ['disabled']);
const NOT_FREE_RESPONSE_PROPS = _.union(REVIEW_CONTROL_PROPS, ['onStepCompleted', 'onNextStep', 'canReview']);

class ExercisePart extends React.Component {
  static defaultProps = {
    focus: true,
    review: '',
    pinned: true,
    canTryAnother: false,
    canReview: false,
  };

  static displayName = 'ExercisePart';

  static propTypes = {
    id: PropTypes.string.isRequired,
    onStepCompleted: PropTypes.func.isRequired,
    onNextStep: PropTypes.func.isRequired,
    getCurrentCard: PropTypes.func.isRequired,
    step,
    setFreeResponseAnswer: PropTypes.func.isRequired,
    setAnswerId: PropTypes.func.isRequired,
    getReadingForStep: PropTypes.func,
    recoverFor: PropTypes.func,
    review: PropTypes.string,
    focus: PropTypes.bool,
    courseId: PropTypes.string,
    canTryAnother: PropTypes.bool,
    canReview: PropTypes.bool,
    disabled: PropTypes.bool,
    idLink: PropTypes.element,
  };

  constructor(props) {
    super(props);
    const { id } = props;

    this.state = { currentCard: props.getCurrentCard(id) };
  }

  onFreeResponseContinue = (state) => {
    const { id } = this.props;
    const { freeResponse } = state;
    return this.props.setFreeResponseAnswer(id, freeResponse);
  };

  onMultipleChoiceAnswerChanged = (answer) => {
    const { id } = this.props;
    return this.props.setAnswerId(id, answer.id);
  };

  getFreeResponseProps = () => {
    const freeResponseProps = _.omit(this.props, NOT_FREE_RESPONSE_PROPS);
    freeResponseProps.onContinue = this.onFreeResponseContinue;

    return freeResponseProps;
  };

  getMultipleChoiceProps = () => {
    const multipleChoiceProps = _.omit(this.props, NOT_MULTIPLE_CHOICE_PROPS);
    multipleChoiceProps.onAnswerChanged = this.onMultipleChoiceAnswerChanged;

    return multipleChoiceProps;
  };

  getReviewProps = () => {
    const reviewProps = _.omit(this.props, NOT_REVIEW_PROPS);
    reviewProps.onContinue = this.props.onNextStep;
    reviewProps.tryAnother = this.tryAnother;

    return reviewProps;
  };

  getTeacherReadOnlyProps = () => {
    const teacherReadOnlyProps = _.omit(this.props, NOT_TEACHER_READ_ONLY_PROPS);
    teacherReadOnlyProps.onContinue = this.props.onNextStep;
    teacherReadOnlyProps.controlButtons = false;
    teacherReadOnlyProps.type = 'teacher-review';

    return teacherReadOnlyProps;
  };

  UNSAFE_componentWillMount() {
    const { id } = this.props;
    if (!this.state.currentCard) { return this.updateCurrentCard(this.props); }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    return this.updateCurrentCard(nextProps);
  }

  tryAnother = () => {
    const { id } = this.props;
    return this.props.recoverFor(id);
  };

  updateCurrentCard = (props) => {
    const { id, getCurrentCard } = props || this.props;
    const currentCard = getCurrentCard(id);
    if ((currentCard != null) && (this.state.currentCard !== currentCard)) { return this.setState({ currentCard }); }
  };

  // add get props methods for different panel types as needed here

  render() {
    let getWaitingText, id, waitingText;
    ({ id, step, getWaitingText, waitingText } = this.props);
    const { currentCard } = this.state;

    // panel is one of ['review', 'multiple-choice', 'free-response', 'teacher-read-only']
    const getPropsForCard = camelCase(`get-${currentCard}-props`);
    const cardProps = typeof this[getPropsForCard] === 'function' ? this[getPropsForCard]() : undefined;

    return (
      <ExerciseStepCard
        {...cardProps}
        step={step}
        panel={currentCard}
        waitingText={(typeof getWaitingText === 'function' ? getWaitingText(id) : undefined) || waitingText} />
    );
  }
}

export default ExercisePart;
