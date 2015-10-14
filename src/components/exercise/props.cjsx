React = require 'react'
_ = require 'underscore'

extendPropTypes = (propTypes...) ->
  propTypes.unshift({})
  _.extend.apply(_, propTypes)

STEP_PROP_TYPES =
  content: React.PropTypes.object.isRequired
  feedback_html: React.PropTypes.string
  correct_answer_id: React.PropTypes.string
  answer_id: React.PropTypes.string
  free_response: React.PropTypes.string
  group: React.PropTypes.string
  related_content: React.PropTypes.array

CONTINUE_PROP_TYPES =
  isContinueEnabled: React.PropTypes.bool
  isContinueFailed: React.PropTypes.bool
  waitingText: React.PropTypes.string
  children: React.PropTypes.string
  onContinue: React.PropTypes.func

REVIEW_CONTROL_PROP_TYPES =
  review: React.PropTypes.string
  isRecovering: React.PropTypes.bool
  canTryAnother: React.PropTypes.bool
  tryAnother: React.PropTypes.func
  canRefreshMemory: React.PropTypes.bool
  refreshMemory: React.PropTypes.func

FREE_RESPONSE_PROP_TYPES =
  free_response: React.PropTypes.string
  focus: React.PropTypes.bool.isRequired
  disabled: React.PropTypes.bool
  onFreeResponseChange: React.PropTypes.func

MULTIPLE_CHOICE_PROP_TYPES =
  choicesEnabled: React.PropTypes.bool.isRequired
  canReview: React.PropTypes.bool.isRequired
  onAnswerChanged: React.PropTypes.func


EXERCISE_STEP_CARD_PROP_TYPES = _.extend({}, CONTINUE_PROP_TYPES, REVIEW_CONTROL_PROP_TYPES)
EXERCISE_STEP_CARD_PROP_TYPES.step = React.PropTypes.shape(STEP_PROP_TYPES).isRequired
EXERCISE_STEP_CARD_PROP_TYPES.footer = React.PropTypes.element.isRequired
EXERCISE_STEP_CARD_PROP_TYPES.pinned = React.PropTypes.bool
EXERCISE_STEP_CARD_PROP_TYPES.panel = React.PropTypes.oneOf(['review', 'multiple-choice', 'free-response', 'teacher-read-only'])
EXERCISE_STEP_CARD_PROP_TYPES.review = React.PropTypes.string

EXERCISE_STEP_CARD_PROP_TYPES.onAnswerChanged = React.PropTypes.func
EXERCISE_STEP_CARD_PROP_TYPES.onFreeResponseChange = React.PropTypes.func
EXERCISE_STEP_CARD_PROP_TYPES.onChangeAnswerAttempt = React.PropTypes.func

CONTROL_PROPS = _.union(_.keys(CONTINUE_PROP_TYPES), _.keys(REVIEW_CONTROL_PROP_TYPES))
FOOTER_PROPS = ['pinned', 'courseId', 'id', 'taskId', 'review', 'panel']
NOT_PANEL_PROPS = _.union(
  CONTROL_PROPS,
  FOOTER_PROPS,
  ['onContinue', 'isContinueEnabled', 'step']
)

propTypes =
  ExContinueButton: extendPropTypes(CONTINUE_PROP_TYPES)
  ExReviewControls: extendPropTypes(CONTINUE_PROP_TYPES, REVIEW_CONTROL_PROP_TYPES)
  ExFreeResponse: extendPropTypes(STEP_PROP_TYPES, FREE_RESPONSE_PROP_TYPES)
  ExMultipleChoice: extendPropTypes(STEP_PROP_TYPES, MULTIPLE_CHOICE_PROP_TYPES)
  ExReview: extendPropTypes(STEP_PROP_TYPES)
  ExerciseStepCard: EXERCISE_STEP_CARD_PROP_TYPES

props = _.mapObject(propTypes, _.keys)
props.StepFooter = ['pinned', 'courseId', 'id', 'taskId', 'review', 'panel']
props.notPanel = _.union(props.ExReviewControls, props.StepFooter, ['step'])

module.exports = {propTypes, props}
