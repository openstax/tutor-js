# coffeelint: disable=no_empty_functions
flux = require 'flux-react'
_ = require 'underscore'
{TocStore} = require './toc'
{makeSimpleStore} = require './helpers'

EXERCISE_TAGS =
  TEKS: 'teks'
  LO: 'lo'
  GENERIC: 'generic'

getImportantTags = (tags) ->
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

ExerciseConfig =
  _exercises: []

  FAILED: -> console.error('BUG: could not load exercises')

  reset: ->
    @_exercises = []
    @_exerciseCache = []

  load: (courseId, pageIds) -> # Used by API

  loaded: (obj, courseId, pageIds) ->
    key = pageIds.toString()
    return if @_exercises[key] and @_HACK_DO_NOT_RELOAD
    
    @_exercises[key] = obj.items
    _exerciseCache = []
    _.each obj.items, (exercise) ->
      _exerciseCache[exercise.id] = exercise

    @_exerciseCache = _exerciseCache
    @emitChange()

  HACK_DO_NOT_RELOAD: (bool) -> @_HACK_DO_NOT_RELOAD = bool

  exports:
    isLoaded: (pageIds) ->
      !!@_exercises[pageIds.toString()]

    get: (pageIds) ->
      @_exercises[pageIds.toString()] or throw new Error('BUG: Invalid page ids')

    getGroupedExercises: (pageIds) ->
      byChapterSection = (exercise) ->
        _.findWhere(exercise.tags, {type: EXERCISE_TAGS.LO}).chapter_section

      exercises = _.sortBy(@_exercises[pageIds.toString()], byChapterSection)
      _.groupBy(exercises, byChapterSection)

    getExerciseById: (exercise_id) ->
      @_exerciseCache[exercise_id]

    getTeksString: (exercise_id) ->
      tags = @_exerciseCache[exercise_id].tags
      teksTags = _.where(tags, {type: EXERCISE_TAGS.TEKS})
      _.pluck(teksTags, 'name').join(" / ")

    getContent: (exercise_id) ->
      @_exerciseCache[exercise_id].content.questions[0].stem_html

    getTagContent: (tag) ->
      content = if tag.name then tag.name else tag.id
      isLO = tag.type is EXERCISE_TAGS.LO
      {content, isLO}

    getTagStrings: (exercise_id) ->
      tags = @_exerciseCache[exercise_id].tags
      getImportantTags(tags)

    removeTopicExercises: (exercise_ids, topic_id) ->
      cache = @_exerciseCache
      topic_chapter_section = TocStore.getChapterSection(topic_id)
      _.reject(exercise_ids, (exercise_id) ->
        exercise = cache[exercise_id]
        {section} = getImportantTags(exercise.tags)
        section.toString() is topic_chapter_section.toString()
      )

{actions, store} = makeSimpleStore(ExerciseConfig)
module.exports = {ExerciseActions:actions, ExerciseStore:store}
