_ = require 'underscore'
flux = require 'flux-react'

AnswerActions = flux.createActions [
  'reset'     # () ->
  'setFreeResponseAnswer' # (question, freeResponse) ->
  'setAnswer' # (question, answer) ->
]


AnswerStore = flux.createStore
  actions: [AnswerActions.reset, AnswerActions.setAnswer, AnswerActions.setFreeResponseAnswer]

  _answers: {}
  _freeResponseAnswers: {}

  reset: ->
    @_answers = {}
    @_freeResponseAnswers = {}
    @emitChange()

  setFreeResponseAnswer: (question, freeResponse) ->
    @_freeResponseAnswers[question.id] = freeResponse
    @emitChange()

  setAnswer: (question, answer) ->
    @_answers[question.id] = answer
    @emitChange()

  exports:
    getAnswer: (question) ->
      id = question.id
      @_answers[id] or question.answer
    getFreeResponseAnswer: (question) ->
      id = question.id
      @_freeResponseAnswers[id] or question.free_response

    getAllAnswers: -> @_answers

module.exports = {AnswerActions, AnswerStore}
