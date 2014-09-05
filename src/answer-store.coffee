# Stores answers for questions in an exercise

{EventEmitter}  = require 'events'
merge           = require 'react/lib/merge'

pendingAnswers = {}
questions = {}

AnswerStore = merge EventEmitter.prototype,
  getAnswers: -> answers
  getAnswer: (question) -> pendingAnswers[question.id] or question.answer
  setAnswer: (question, answer) ->
    questions[question.id] = question
    pendingAnswers[question.id] = answer

    @emit('change', question)

  submitAnswers: ->
    for questionId, question of questions
      questions[questionId].answer = pendingAnswers[questionId]
      @emit('answered', question)

module.exports = AnswerStore
