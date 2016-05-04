_ = require 'underscore'
flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
TaggingMixin = require './tagging-mixin'


VocabularyConfig = {

  _loaded: (obj, exerciseId) -> @emit('loaded', exerciseId)

  createBlank: (id) ->
    template = @exports.getTemplate.call(@)
    @loaded(template, id)

  updateDistractor: (id, oldValue, newValue) ->
    distractor_literals = @_get(id).distractor_literals
    index = _.indexOf distractor_literals, oldValue
    if -1 is index
      distractor_literals.push(newValue)
    else
      distractor_literals[index] = newValue
    @_change(id, {distractor_literals})

  change: (id, attrs) ->
    @_change(id, attrs)

  addBlankDistractor: (id) ->
    distractor_literals = _.clone(@_get(id).distractor_literals)
    distractor_literals.push('')
    @_change(id, {distractor_literals})

  exports:
    getTemplate: (id) ->
      distractor_literals: []
      tags: []

    isSavable: (id) ->
      @exports.isChanged.call(@, id) and
        @exports.validate.call(@, id).valid and
        not @exports.isSaving.call(@, id)

    isPublishable: (id) ->
      @exports.validate.call(@, id).valid and
        not @exports.isChanged.call(@, id) and
        not @exports.isSaving.call(@, id) and
        not @_get(id)?.published_at

    validate: (id) ->
      return {valid: false, part: 'vocab'} unless @_get(id)
      valid: true
}

TaggingMixin.extend(VocabularyConfig)

extendConfig(VocabularyConfig, new CrudConfig())
{actions, store} = makeSimpleStore(VocabularyConfig)

module.exports = {VocabularyActions:actions, VocabularyStore:store}
