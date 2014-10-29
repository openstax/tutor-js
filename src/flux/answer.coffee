flux = require 'flux-react'

AnswerActions = flux.createActions [
  'setAnswer' # (question, answer) ->
]


AnswerStore = flux.createStore
  actions: [AnswerActions.setAnswer]
  getInitialState: ->
    answers: {}

  setAnswer: (question, answer) ->
    @state.answers[question.id] = answer

  exports:
    getAnswer: (question) -> @answers[question.id] or question.answer
    getAllAnswers: -> @answers

module.exports = {AnswerActions, AnswerStore}
