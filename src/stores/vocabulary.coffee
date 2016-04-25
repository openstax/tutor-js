_ = require 'underscore'
flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
TaggingMixin = require './tagging-mixin'


VocabularyConfig = {

  createBlank: (id) ->
    template = @exports.getTemplate.call(@)
    @loaded(template, id)

  updateDistractor: (id, oldValue, newValue) ->
    distractors = @_get(id).distractors
    index = _.indexOf distractors, oldValue
    if -1 is index
      distractors.push(newValue)
    else
      distractors[index] = newValue
    @_change(id, {distractors})

  change: (id, attrs) ->
    @_change(id, attrs)

  addBlankDistractor: (id) ->
    distractors = _.clone(@_get(id).distractors)
    distractors.push('')
    @_change(id, {distractors})

  exports:
    getTemplate: (id) ->
      distractors: []


}

TaggingMixin.extend(VocabularyConfig)

extendConfig(VocabularyConfig, new CrudConfig())
{actions, store} = makeSimpleStore(VocabularyConfig)

module.exports = {VocabularyActions:actions, VocabularyStore:store}
