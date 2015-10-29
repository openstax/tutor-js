_ = require 'underscore'
flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{QuestionActions, QuestionStore} = require './question'

ExerciseConfig = {
  _loaded: (obj, exerciseId) ->
    for question in obj.questions
      QuestionActions.loaded(question, question.id)
    obj

  updateNumber: (id, number) -> @_change(id, {number})

  updateStimulus: (id, stimulus_html) -> @_change(id, {stimulus_html})

  updateTags: (id, tags) -> @_change(id, {tags})

  save: (id) ->
    questions = _.map @_local[id].questions, (question) ->
      QuestionActions.sync(question.id)
      QuestionStore.get(question.id)
  
    @_change(id, {questions})

  exports:
    getQuestions: (id) -> @_local[id].questions

    getId: (id) -> @_local[id].uid
    
    getNumber: (id) -> @_local[id].number
    
    getStimulus: (id) -> @_local[id].stimulus_html
    
    getTags: (id) -> @_local[id].tags
}

extendConfig(ExerciseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ExerciseConfig)

module.exports = {ExerciseActions:actions, ExerciseStore:store}

