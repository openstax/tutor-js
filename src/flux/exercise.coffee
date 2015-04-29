# coffeelint: disable=no_empty_functions
flux = require 'flux-react'
_ = require 'underscore'

{makeSimpleStore} = require './helpers'

EXERCISE_TAGS =
  TEK: 'teks'
  LO: 'lo'
  GENERIC: 'generic'

ExerciseConfig =
  _exercises: []

  FAILED: -> console.error("BUG: could not load exercises")

  reset: ->
    @_exercises = []
    @_exerciseCache = []

  load: (courseId, pageIds) -> # Used by API

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

    get: (pageIds) ->
      @_exercises[pageIds.toString()] or throw new Error('BUG: Invalid page ids')

    getGroupedExercises: (pageIds) ->
      _.groupBy(@_exercises[pageIds.toString()], (exercise) ->
        _.findWhere(exercise.tags, {type: EXERCISE_TAGS.LO}).chapter_section
      )

    getExerciseById: (exercise_id) ->
      @_exerciseCache[exercise_id]
    
    getTekString: (exercise_id) ->
      tags = @_exerciseCache[exercise_id].tags
      tekTags = _.where(tags, {type: EXERCISE_TAGS.TEK})

      _.reduce(tekTags, (memo, tag) ->
        memo + " / " + tag.name
      , '')

    getContent: (exercise_id) ->
      @_exerciseCache[exercise_id].content.questions[0].stem_html
      
    getTagStrings: (exercise_id) ->
      tags = @_exerciseCache[exercise_id].tags
      
      obj =
        lo: ""
        section: ""
        tagString: ""

      _.reduce(tags, (memo, tag) ->
        if (tag.type is EXERCISE_TAGS.GENERIC)
          tagArr = memo.tagString.split("/")
          tagArr.push(tag.id)
          memo.tagString = tagArr.join(" / ")
        else if (tag.type is EXERCISE_TAGS.LO)
          memo.lo = tag.name
          memo.section = tag.chapter_section
        memo
      , obj)
      
{actions, store} = makeSimpleStore(ExerciseConfig)
module.exports = {ExerciseActions:actions, ExerciseStore:store}
