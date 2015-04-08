flux = require 'flux-react'
_ = require 'underscore'

{makeSimpleStore} = require './helpers'

ExerciseConfig =
  _exercises: []

  FAILED: -> console.error("BUG: could not load exercises")

  reset: ->
    @_exercises = []
    @_exerciseCache = []

  load: (courseId, pageIds) ->
    
  loaded: (obj, courseId, pageIds) ->
    @_exercises[pageIds.toString()] = obj.items
    _exerciseCache = []
    _.each obj.items, (exercise) ->
      _exerciseCache[exercise.id] = exercise
    
    @_exerciseCache = _exerciseCache
    @emitChange()

  exports:
    isLoaded: (pageIds) ->
      !!@_exercises[pageIds.toString()]

    get: (pageIds)->
      @_exercises[pageIds.toString()] or throw new Error('BUG: Invalid page ids')

    getExerciseById: (exercise_id) ->
      @_exerciseCache[exercise_id]

{actions, store} = makeSimpleStore(ExerciseConfig)
module.exports = {ExerciseActions:actions, ExerciseStore:store}
