import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';

const extendPropTypes = function(...propTypes) {
  propTypes.unshift({});
  return _.extend.apply(_, propTypes);
};

const PANEL_PROPS_TYPES =
  { panel: PropTypes.oneOf(['review', 'multiple-choice', 'free-response', 'teacher-read-only']) };

const CONTROL_PROPS_TYPES =
  { controlText: PropTypes.string };

const STEP_PROP_TYPES = {
  content: PropTypes.object.isRequired,
  feedback_html: PropTypes.string,
  correct_answer_id: PropTypes.string,
  answer_id: PropTypes.string,
  free_response: PropTypes.string,
  group: PropTypes.string,
  related_content: PropTypes.array,
  task: PropTypes.object,
};

const CONTINUE_PROP_TYPES = {
  isContinueEnabled: PropTypes.bool,
  isContinueFailed: PropTypes.bool,
  waitingText: PropTypes.string,
  children: PropTypes.string,
  onContinue: PropTypes.func,
};

const REVIEW_CONTROL_PROP_TYPES = {
  review: PropTypes.string,
  isRecovering: PropTypes.bool,
  canTryAnother: PropTypes.bool,
  tryAnother: PropTypes.func,
};

const FREE_RESPONSE_PROP_TYPES = {
  free_response: PropTypes.string,
  focus: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onFreeResponseChange: PropTypes.func,
};

const MULTIPLE_CHOICE_PROP_TYPES = {
  choicesEnabled: PropTypes.bool.isRequired,
  canReview: PropTypes.bool.isRequired,
  onAnswerChanged: PropTypes.func,
};


const EXERCISE_STEP_CARD_PROP_TYPES = _.extend({}, CONTINUE_PROP_TYPES, REVIEW_CONTROL_PROP_TYPES);
EXERCISE_STEP_CARD_PROP_TYPES.step = PropTypes.shape(STEP_PROP_TYPES).isRequired;
EXERCISE_STEP_CARD_PROP_TYPES.pinned = PropTypes.bool;
EXERCISE_STEP_CARD_PROP_TYPES.allowKeyNav = PropTypes.bool;
EXERCISE_STEP_CARD_PROP_TYPES.review = PropTypes.string;
EXERCISE_STEP_CARD_PROP_TYPES.controlText = PropTypes.string;

EXERCISE_STEP_CARD_PROP_TYPES.onAnswerChanged = PropTypes.func;
EXERCISE_STEP_CARD_PROP_TYPES.onFreeResponseChange = PropTypes.func;
EXERCISE_STEP_CARD_PROP_TYPES.onChangeAnswerAttempt = PropTypes.func;

const CONTROL_PROPS = _.union(_.keys(CONTINUE_PROP_TYPES), _.keys(REVIEW_CONTROL_PROP_TYPES));
const FOOTER_PROPS = ['pinned', 'courseId', 'id', 'taskId', 'review', 'panel', 'controlButtons', 'idLink'];
const NOT_PANEL_PROPS = _.union(
  CONTROL_PROPS,
  FOOTER_PROPS,
  ['onContinue', 'isContinueEnabled', 'step']
);

const propTypes = {
  ExContinueButton: extendPropTypes(CONTINUE_PROP_TYPES),
  ExReviewControls: extendPropTypes(CONTINUE_PROP_TYPES, REVIEW_CONTROL_PROP_TYPES),
  ExControls: extendPropTypes(CONTINUE_PROP_TYPES, REVIEW_CONTROL_PROP_TYPES, PANEL_PROPS_TYPES, CONTROL_PROPS_TYPES),
  ExFreeResponse: extendPropTypes(STEP_PROP_TYPES, FREE_RESPONSE_PROP_TYPES),
  ExMultipleChoice: extendPropTypes(STEP_PROP_TYPES, MULTIPLE_CHOICE_PROP_TYPES),
  ExReview: extendPropTypes(STEP_PROP_TYPES),
  ExerciseStepCard: extendPropTypes(EXERCISE_STEP_CARD_PROP_TYPES, PANEL_PROPS_TYPES),
};

const props = _.mapObject(propTypes, _.keys);
props.StepFooter = FOOTER_PROPS;
props.notCard = _.union(props.ExReviewControls, props.StepFooter, ['step']);

export { propTypes, props };
