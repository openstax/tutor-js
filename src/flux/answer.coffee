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
      @_answers[id] or question.answer
    getAllAnswers: -> @_answers

module.exports = {AnswerActions, AnswerStore}
