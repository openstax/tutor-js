# coffeelint: disable=no_empty_functions

ContentHelpers = require '../helpers/content'

flux = require 'flux-react'
_ = require 'underscore'
{TocStore} = require './toc'
{makeSimpleStore} = require './helpers'
LOADING = 'loading'
SAVING  = 'saving'

EXERCISE_TAGS =
  TEKS: 'teks'
  LO: ['lo', 'aplo']
  GENERIC: ['blooms', 'dok', 'length']

getExerciseCnxModUuids = (exercise) ->
  tag.data for tag in exercise.tags when tag.type is 'cnxmod'

getChapterSection = (ecosystemId, exercise) ->
  for uuid in getExerciseCnxModUuids(exercise)
    section = TocStore.getByUuid(ecosystemId, uuid)
    return section.chapter_section.join('.') if section?
  '' # return empty string if section wasn't found

getTagName = (tag) ->
  name = _.compact([tag.name, tag.description]).join(' ')
  name = tag.id unless name
  name

EXERCISE_TYPE_MAPPING =
  homework: 'homework_core'
  reading:  'reading_dynamic'

filterForPoolType = (exercises, pool_type) ->
  _.filter exercises, (exercise) -> -1 isnt exercise.pool_types.indexOf(pool_type)


groupBySortedSections = ( ecosystemId, exercises ) ->
  sections = {}
  grouped = _.groupBy(exercises, (exercise) ->
    getChapterSection(ecosystemId, exercise)
  )
  for section in _.sortBy( _.keys(grouped), ContentHelpers.chapterSectionToNumber)
    sections[section] = grouped[section]
  sections


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
  _asyncStatus: null
  _exerciseCache: {}
  _unsavedExclusions: {}

  FAILED: -> console.error('BUG: could not load exercises')

  reset: ->
    @_exercises = []
    @_exerciseCache = {}
    @_unsavedExclusions = {}

  loadForCourse: (courseId, pageIds, ecosystemId) -> # Used by API
    @_asyncStatus = LOADING
  loadedForCourse: (obj, courseId, pageIds) ->
    @processLoad(obj, pageIds)

  loadForEcosystem: (ecosystemId, pageIds) -> # Used by API
    @_asyncStatus = LOADING

  loadedForEcosystem: (obj, ecosystemId, pageIds) ->
    @processLoad(obj, pageIds)

  processLoad: (obj, pageIds) ->
    key = pageIds.toString()
    delete @_asyncStatus
    return if @_exercises[key] and @_HACK_DO_NOT_RELOAD
    @_exercises[key] = obj.items
    @cacheExercises(obj.items)

  cacheExercises: (exercises) ->
    for exercise in exercises
      if @_exerciseCache[exercise.id]
        _.extend(@_exerciseCache[exercise.id], exercise)
      else
        @_exerciseCache[exercise.id] = exercise
    @emitChange()

  updateExercises: (updatedExercises) ->
    for updatedExercise in updatedExercises
      for pageIds, storedExercises of @_exercises
        for storedExercise in storedExercises when storedExercise.id is updatedExercise.id
          _.extend(storedExercise, updatedExercise)
    @cacheExercises(updatedExercises) # will @emitChange() so we don't bother to ourselves

  exclusionsSaved: (exercises, courseId) ->
    @_unsavedExclusions = {}
    delete @_exclusionsAsyncStatus
    @updateExercises(exercises)

  saveExerciseExclusion: (courseId, exerciseId, isExcluded) ->
    @_exclusionsAsyncStatus = SAVING
    @_unsavedExclusions[exerciseId] = isExcluded
    @emit("change-exercise-#{exerciseId}")

  resetUnsavedExclusions: ->
    @_unsavedExclusions = {}
    @emitChange()

  HACK_DO_NOT_RELOAD: (bool) -> @_HACK_DO_NOT_RELOAD = bool

  exports:
    isLoading: -> @_asyncStatus is LOADING
    isSavingExclusions: -> @_exclusionsAsyncStatus is SAVING
    isLoaded: (pageIds) ->
      !!@_exercises[pageIds.toString()]

    get: (pageIds) ->
      @_exercises[pageIds.toString()] or throw new Error('BUG: Invalid page ids')

    # returns the available count if at minimum or `false` if not at minimum amount
    excludedAtMinimum: (exercise, validCnxUuids) ->
      isExcluded = _.bind(@.exports.isExerciseExcluded, @)
      for uuid in getExerciseCnxModUuids(exercise) when _.include(validCnxUuids, uuid)
        exercises = @exports.forCnxModuleUuid.call(@, uuid)
        excluded = _.filter(_.pluck(exercises, 'id'), isExcluded)
        availableCount = exercises.length - excluded.length
        if (availableCount is 5) or (excluded.length is 0 and exercises.length <= 5)
          return availableCount
      false

    hasUnsavedExclusions: ->
      not _.isEmpty @_unsavedExclusions
    getUnsavedExclusions: ->
      @_unsavedExclusions

    isExerciseExcluded: (exerciseId) ->
      if @_unsavedExclusions[exerciseId]?
        @_unsavedExclusions[exerciseId]
      else
        @_exerciseCache[exerciseId]?.is_excluded

    forCnxModuleUuid: (uuid) ->
      exercises = {}
      for id, exercise of @_exerciseCache when not exercises[id]
        if _.includes( getExerciseCnxModUuids(exercise), uuid )
          exercises[id] = exercise
      _.values exercises

    getChapterSectionOfExercise: (ecosystemId, exercise) ->
      getChapterSection(ecosystemId, exercise)

    groupBySectionsAndTypes: (ecosystemId, pageIds, options = {withExcluded: false}) ->
      all = @_exercises[pageIds.toString()] or []
      unless options.withExcluded is true
        all = _.filter( all, (ex) -> ex.is_excluded isnt true )
      results = {
        all:
          count: all.length
          grouped: groupBySortedSections(ecosystemId, all)
      }
      for name, pool_type of EXERCISE_TYPE_MAPPING
        exercises = filterForPoolType(all, pool_type)
        results[name] = {
          count: exercises.length
          grouped: groupBySortedSections(ecosystemId, exercises)
        }
      results

    getExerciseById: (exercise_id) ->
      @_exerciseCache[exercise_id]

    getTeksString: (exercise_id) ->
      tags = @_exerciseCache[exercise_id]?.tags or []
      teksTags = _.where(tags, {type: EXERCISE_TAGS.TEKS})
      _.map(teksTags, (tag) ->
        tag.name?.replace(/[()]/g, '')
      ).join(" / ")

    getContent: (exercise_id) ->
      @_exerciseCache[exercise_id]?.content.questions[0]?.stem_html

    getTagContent: (tag) ->
      content = getTagName(tag) or tag.id
      isLO = _.include(EXERCISE_TAGS.LO, tag.type)
      {content, isLO}

    getTagStrings: (exercise_id) ->
      tags = @_exerciseCache[exercise_id]?.tags or []
      getImportantTags(tags)

    removeTopicExercises: (exercise_ids, topic_id) ->
      cache = @_exerciseCache
      topic_chapter_section = TocStore.getChapterSection(topic_id)
      _.reject(exercise_ids, (exercise_id) ->
        exercise = cache[exercise_id]
        return true unless cache
        {section} = getImportantTags(exercise.tags)
        section.toString() is topic_chapter_section.toString()
      )

    # Searches for the given format in either an exercise or it's content
    hasQuestionWithFormat: (format, {exercise, content}) ->
      content = exercise.content unless content?
      !!_.detect content.questions, _.partial(@exports.doesQuestionHaveFormat, format)

    # Searches for the given format in either an exercise or it's content
    doQuestionsHaveFormat: (format, {exercise, content}) ->
      content = exercise.content unless content?
      _.map content.questions, _.partial(@exports.doesQuestionHaveFormat, format)

    doesQuestionHaveFormat: (format, question) ->
      _.include(question.formats, format)

    getExerciseTypes: (exercise) ->
      tags = _.filter exercise.tags, (tag) ->
        tag.id.indexOf('filter-type:') is 0 or tag.id.indexOf('type:') is 0
      _.map tags, (tag) -> _.last tag.id.split(':')

    getPageExerciseTypes: (pageId) ->
      _.unique _.flatten _.map @_exercises[pageId], @exports.getExerciseTypes

    allForPage: (pageId) ->
      @_exercises[pageId] or []

{actions, store} = makeSimpleStore(ExerciseConfig)
module.exports = {ExerciseActions:actions, ExerciseStore:store}
