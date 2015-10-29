_ = require 'underscore'
flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{AnswerActions, AnswerStore} = require './answer'

QuestionConfig = {
  _loaded: (obj, id) ->
    for answer in obj.answers
      AnswerActions.loaded(answer, answer.id)

    obj

  sync: (id) ->
    answers = _.map @_local[id].answers, (answer) ->
      AnswerStore.get(answer.id)
    @_change(id, {answers})
    
  updateStem: (id, stem_html) -> @_change(id, {stem_html})

  updateStimulus: (id, stimulus_html) -> @_change(id, {stimulus_html})

  exports:

    getAnswers: (id) -> @_local[id]?.answers

    getStem: (id) -> @_local[id]?.stem_html

    getStimulus: (id) -> @_local[id]?.stimulus_html
}

extendConfig(QuestionConfig, new CrudConfig())
{actions, store} = makeSimpleStore(QuestionConfig)

module.exports = {QuestionActions:actions, QuestionStore:store}
