import { ExContinueButton, ExReviewControls } from './controls';

const CONTROLS = {
  'free-response': ExContinueButton,
  'multiple-choice': ExContinueButton,
  'review': ExReviewControls,
  'teacher-read-only': ExContinueButton,
};

const CONTROLS_TEXT = {
  'free-response': 'Answer',
  'multiple-choice': 'Submit',
  'review': 'Next Question',
  'teacher-read-only': 'Next Question',
};

const CONTINUE_CHECKS = {
  'free-response': 'freeResponse',
  'multiple-choice': 'answerId',
  'review': null,
  'teacher-read-only': null,
};

const ON_CHANGE = {
  'free-response': 'onFreeResponseChange',
  'multiple-choice': 'onAnswerChanged',
  'review': 'onChangeAnswerAttempt',
  'teacher-read-only': 'onChangeAnswerAttempt',
};

export { CONTROLS, CONTROLS_TEXT, CONTINUE_CHECKS, ON_CHANGE };
