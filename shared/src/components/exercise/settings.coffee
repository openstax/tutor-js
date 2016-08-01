{ExContinueButton, ExReviewControls} = require './controls'

CONTROLS =
  'free-response': ExContinueButton
  'multiple-choice': ExContinueButton
  'review': ExReviewControls
  'teacher-read-only': ExContinueButton

CONTROLS_TEXT =
  'free-response': 'Answer'
  'multiple-choice': 'Submit'
  'review': 'Next Question'
  'teacher-read-only': 'Next Question'

CONTINUE_CHECKS =
  'free-response': 'freeResponse'
  'multiple-choice': 'answerId'
  'review': null
  'teacher-read-only': null

ON_CHANGE =
  'free-response': 'onFreeResponseChange'
  'multiple-choice': 'onAnswerChanged'
  'review': 'onChangeAnswerAttempt'
  'teacher-read-only': 'onChangeAnswerAttempt'

module.exports = {CONTROLS, CONTROLS_TEXT, CONTINUE_CHECKS, ON_CHANGE}
