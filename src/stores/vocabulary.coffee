_ = require 'underscore'
flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
TaggingMixin = require './tagging-mixin'


VocabularyConfig = {

  _asyncStatusPublish: {}

  _loaded: (obj, exerciseId) ->

    @emit('loaded', exerciseId)

  _created:(obj, id) ->
    obj.id = obj.number
    @emit('created', obj.id)
    obj

  createBlank: (id) ->
    template = @exports.getTemplate.call(@)
    @loaded(template, id)

  updateDistractor: (id, oldValue, newValue) ->
    distractor_literals = @_get(id).distractor_literals or []
    index = _.indexOf distractor_literals, oldValue
    if -1 is index
      distractor_literals.push(newValue)
    else if newValue is ''
      distractor_literals.splice(index, 1)
    else
      distractor_literals[index] = newValue
    @_change(id, {distractor_literals})

  change: (id, attrs) ->
    @_change(id, attrs)

  addBlankDistractor: (id) ->
    distractor_literals = _.clone(@_get(id).distractor_literals)
    distractor_literals.push('')
    @_change(id, {distractor_literals})

  publish: (id) ->
    @_asyncStatusPublish[id] = true
    @emitChange()

  published: (obj, id) ->
    @_asyncStatusPublish[id] = false
    @emit('published', id)
    @saved(obj, id)

  exports:
    getTemplate: (id) ->
      term: ''
      definition: ''
      distractor_literals: []
      tags: ['dok:1', 'blooms:1', 'time:short']

    hasExercise: (id) -> @_get(id)?.exercise_uids?.length

    getExerciseIds: (id) -> @_get(id)?.exercise_uids

    isSavable: (id) ->
      @exports.isChanged.call(@, id) and
        @exports.validate.call(@, id).valid and
        not @exports.isSaving.call(@, id) and
        not @exports.isPublishing.call(@, id)

    isPublished: (id) -> !!@_get(id)?.published_at

    isPublishing: (id) -> !!@_asyncStatusPublish[id]

    isPublishable: (id) ->
      @exports.validate.call(@, id).valid and
        not @exports.isChanged.call(@, id) and
        not @exports.isSaving.call(@, id) and
        not @exports.isPublishing.call(@, id) and
        not @_get(id)?.published_at

    validate: (id) ->
      return {valid: false, part: 'vocab'} unless @_get(id)
      valid: true
}

TaggingMixin.extend(VocabularyConfig)

extendConfig(VocabularyConfig, new CrudConfig())
{actions, store} = makeSimpleStore(VocabularyConfig)

module.exports = {VocabularyActions:actions, VocabularyStore:store}
