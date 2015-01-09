_ = require 'underscore'
flux = require 'flux-react'

AnswerActions = flux.createActions [
  'reset'     # () ->
  'setAnswer' # (question, answer) ->
]


AnswerStore = flux.createStore
  actions: [AnswerActions.reset, AnswerActions.setAnswer]

  _answers: {}

  reset: ->
    @_answers = {}
    @emitChange()

  setAnswer: (question, answer) ->
    @_answers[question.id] = answer
    @emitChange()

  exports:
    getAnswer: (question) ->
      id = question.id
      if @_answers[id]? # For true/false questions falsy is not sufficient
        @_answers[id]
      else
        question.answer
    getAllAnswers: -> @_answers

module.exports = {AnswerActions, AnswerStore}
