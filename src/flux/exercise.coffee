# coffeelint: disable=no_empty_functions
flux = require 'flux-react'
_ = require 'underscore'
{TocStore} = require './toc'
{makeSimpleStore} = require './helpers'

EXERCISE_TAGS =
  TEKS: 'teks'
  LO: ['lo', 'aplo']
  GENERIC: ['blooms', 'dok', 'length']

getTagName = (tag) ->
  [tag.name, tag.description].join(' ')

getImportantTags = (tags) ->
  obj =
    lo: ""
    section: ""
    tagString: []

  _.reduce(_.sortBy(tags, 'name'), (memo, tag) ->
    if (_.include(EXERCISE_TAGS.GENERIC, tag.type))
      memo.tagString.push(tag.name)
    else if (_.include(EXERCISE_TAGS.LO, tag.type))
      memo.lo = getTagName(tag)
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
        tag = _.find(exercise.tags, (t) ->
          _.include(EXERCISE_TAGS.LO, t.type)
        )
        tag?.chapter_section
      exercises = _.sortBy(@_exercises[pageIds.toString()], byChapterSection)
      _.groupBy(exercises, byChapterSection)

    getExerciseById: (exercise_id) ->
      @_exerciseCache[exercise_id]

    getTeksString: (exercise_id) ->
      tags = @_exerciseCache[exercise_id].tags
      teksTags = _.where(tags, {type: EXERCISE_TAGS.TEKS})
      _.map(teksTags, (tag) ->
        tag.name.replace(/[()]/g, '')
      ).join(" / ")

    getContent: (exercise_id) ->
      @_exerciseCache[exercise_id].content.questions[0].stem_html

    getTagContent: (tag) ->
      content = getTagName(tag) or tag.id
      isLO = _.include(EXERCISE_TAGS.LO, tag.type)
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
