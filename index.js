require('coffee-script/register');
require('coffee-react/register');

var AnswerStore = require('./src/answer-store');
var Components = require('./src/components');
module.exports = {
  Exercise: Components.Exercise,
  getQuestionType: Components.getQuestionType,
  AnswerStore: AnswerStore
};
