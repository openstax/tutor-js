flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

AnswerConfig = {
  updateContent: (id, content) ->
    @_local[id].content_html = content
    @emitChange()

  setCorrect: (id) ->
    @_local[id].correctness = "1.0"
    @emitChange()

  setIncorrect: (id) ->
    @_local[id].correctness = "0.0"
    @emitChange()

  exports:
    getContent: (id) -> @_local[id].content_html

    isCorrect: (id) -> @_local[id].correctness is "1.0"
}

extendConfig(AnswerConfig, new CrudConfig())
{actions, store} = makeSimpleStore(AnswerConfig)

module.exports = {AnswerActions:actions, AnswerStore:store}
