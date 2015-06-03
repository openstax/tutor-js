# coffeelint: disable=no_empty_functions
_ = require 'underscore'
flux = require 'flux-react'

{CourseActions, CourseStore} = require './course'

LOADING = 'loading'
LOADED  = 'loaded'
FAILED  = 'failed'

CourseListingActions = flux.createActions [
  'load'
  'loaded'
  'reset'
  'FAILED'
]

CourseListingStore = flux.createStore
  actions: _.values(CourseListingActions)
  _asyncStatus: null

  load: -> # Used by API
    @_asyncStatus = LOADING
    @emit('load')

  reset: ->
    @_course_ids = []
    CourseActions.reset()
    @_asyncStatus = null
    @emitChange()

  FAILED: (status, msg) ->
    @_asyncStatus = FAILED
    @emitChange()

  loaded: (courses) ->
    @_course_ids = _.map courses, (course) ->
      CourseActions.loaded(course, course.id)
      course.id # Store only the ids
    @_asyncStatus = LOADED
    @emit('loaded')

  exports:
    isLoading: -> @_asyncStatus is LOADING
    isLoaded:  -> @_asyncStatus is LOADED
    isFailed:  -> @_asyncStatus is FAILED

    # Loads the store if it's not already loaded or loading
    # Returns false if the store is already loaded, true otherwise
    ensureLoaded: ->
      if @_asyncStatus is LOADED
        false
      else
        CourseListingActions.load() unless @_asyncStatus is LOADING
        true

    allCourses: ->
      return _.map @_course_ids, CourseStore.get

module.exports = {CourseListingActions, CourseListingStore}
