_ = require 'underscore'
flux = require 'flux-react'

AnswerActions = flux.createActions [
  'reset'     # () ->
  'setAnswer' # (question, answer) ->
]


AnswerStore = flux.createStore
  actions: [AnswerActions.reset, AnswerActions.setAnswer]
  getInitialState: ->
    answers: {}

  reset: ->
    _.extend(@state, @getInitialState())
    @emitChange()

  setAnswer: (question, answer) ->
    @state.answers[question.id] = answer
    @emitChange()

  exports:
    getAnswer: (question) ->
      id = question.id
      @answers[id] or question.answer
    getAllAnswers: -> @answers

module.exports = {AnswerActions, AnswerStore}
