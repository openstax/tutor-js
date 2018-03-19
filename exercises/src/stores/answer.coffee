flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

AnswerConfig = {
  updateContent: (id, content) ->
    @_change(id, {content_html: content})

  setCorrect: (id) ->
    @_change(id, {correctness: "1.0"})

  setIncorrect: (id) ->
    @_change(id, {correctness: "0.0"})
  updateFeedback: (id, feedback) ->
    @_change(id, {feedback_html: feedback})

  exports:
    getContent: (id) -> @_get(id).content_html
    getFeedback: (id) -> @_get(id).feedback_html
    isCorrect: (id) -> @_get(id).correctness is "1.0"

    validate: (id) ->
      if (not @_get(id).content_html)
        return valid: false, part: 'Answer Distractor'

      return valid: true

    getTemplate: ->
      content_html:"",
      feedback_html:"",
      correctness:"1.0"
}

extendConfig(AnswerConfig, new CrudConfig())
{actions, store} = makeSimpleStore(AnswerConfig)

module.exports = {AnswerActions:actions, AnswerStore:store}
