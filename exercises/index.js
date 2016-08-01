require('coffee-script/register');
require('coffee-react/register');

var AnswerActionsStore = require('./src/flux/answer');
var ExerciseActionsStore = require('./src/flux/exercise');
var Components = require('./src/components');
module.exports = {
  Exercise: Components.Exercise,
  getQuestionType: Components.getQuestionType,
  AnswerStore: AnswerActionsStore.AnswerStore,
  AnswerActions: AnswerActionsStore.AnswerActions,
  ExerciseStore: ExerciseActionsStore.ExerciseStore,
  ExerciseActions: ExerciseActionsStore.ExerciseActions,
};
