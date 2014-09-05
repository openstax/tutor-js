# Stores answers for questions in an exercise

{EventEmitter}  = require 'events'
merge           = require 'react/lib/merge'

pendingAnswers = {}
questions = {}

AnswerStore = merge EventEmitter.prototype,
  getAnswers: -> answers
  getAnswer: (question) ->
    answer = pendingAnswers[question.id]
    if answer? # Handle the case of the answer being `false` (instead of just truthy)
      answer
    else
      question.answer
  setAnswer: (question, answer) ->
    # console.log "Answering #{question.id} with", answer
    questions[question.id] = question
    pendingAnswers[question.id] = answer

    @emit('change', question)

  submitAnswers: ->
    for questionId, question of questions
      questions[questionId].answer = pendingAnswers[questionId]
      @emit('answered', question)

module.exports = AnswerStore
