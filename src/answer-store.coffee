# Stores answers for questions in an exercise

{EventEmitter}  = require 'events'
merge           = require 'react/lib/merge'

questions = {}

AnswerStore = merge EventEmitter.prototype,
  getAnswers: -> answers
  getAnswer: (questionId) -> questions[questionId]?.answer
  setAnswer: (question, answer) ->
    console.log("Answered #{question.id} with", answer)
    questions[question.id] = question
    question.answer = answer

    @emit('change', question)

  submitAnswers: ->
    for question, question of questions
      @emit('answered', question)

module.exports = AnswerStore
