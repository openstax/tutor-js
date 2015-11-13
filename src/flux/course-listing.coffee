# coffeelint: disable=no_empty_functions
_ = require 'underscore'
flux = require 'flux-react'

{CourseActions, CourseStore} = require './course'

LOADING = 'loading'
LOADED  = 'loaded'
FAILED  = 'failed'
DELETING = 'deleting'
DELETED = 'deleted'

CourseListingActions = flux.createActions [
  'load'
  'loaded'
  'reset'
  'FAILED'
  'delete'
  'deleted'
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

  FAILED: ->
    @_asyncStatus = FAILED
    @emit('failed')

  loaded: (courses) ->
    @_course_ids = _.map courses, (course) ->
      CourseActions.loaded(course, course.id)
      course.id # Store only the ids
    @_asyncStatus = LOADED
    @emit('loaded')

  delete: (courseId) ->
    @_asyncStatus[courseId] = DELETING
    @_course_ids = _.without(@_course_ids, courseId)
    @emit(DELETING)

  deleted: (courseId) ->
    @_asyncStatus[courseId] = DELETED
    @emit(DELETED)

  exports:
    isLoading: -> @_asyncStatus is LOADING
    isLoaded:  -> @_asyncStatus is LOADED
    isFailed:  -> @_asyncStatus is FAILED

    # Loads the store if it's not already loaded or loading
    # Returns false if the store is already loaded, true otherwise
    ensureLoaded: ->
      if CourseListingStore.isLoaded()
        false
      else
        CourseListingActions.load() unless CourseListingStore.isLoading()
        true

    allCourses: ->
      return _.map @_course_ids, CourseStore.get

module.exports = {CourseListingActions, CourseListingStore}
