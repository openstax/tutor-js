flux = require 'flux-react'
_ = require 'underscore'

{makeSimpleStore} = require './helpers'

ExerciseConfig =
  _exercises: []

  FAILED: -> console.error("BUG: could not load exercises")

  reset: ->
    @_exercises = []

  load: (courseId, pageIds) ->

  loaded: (obj, courseId, pageIds) ->
    @_exercises[pageIds.toString()] = obj.items
    @emitChange()

  exports:
    isLoaded: (pageIds) ->
      !!@_exercises[pageIds.toString()]
    get: (pageIds)->
      @_exercises[pageIds.toString()] or throw new Error('BUG: Invalid page ids')
    getQuestion: (exercise) ->
      JSON.parse(exercies.content)

{actions, store} = makeSimpleStore(ExerciseConfig)
module.exports = {ExerciseActions:actions, ExerciseStore:store}
