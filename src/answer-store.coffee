# Stores answers for questions in an exercise

{EventEmitter}  = require 'events'
merge           = require 'react/lib/merge'

answers = {}

AnswerStore = merge EventEmitter.prototype,
  getAnswers: -> answers
  getAnswer: (questionId) -> answers[questionId]
  setAnswer: (questionId, answer) ->
    console.log("Answered #{questionId} with", answer)
    answers[questionId] = answer

    @emit('change', questionId, answer)

  submitAnswers: ->
    for questionId, answer of answers
      @emit('answered', questionId, answer)

module.exports = AnswerStore
