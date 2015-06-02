# coffeelint: disable=no_empty_functions
_ = require 'underscore'
flux = require 'flux-react'

{CourseActions, CourseStore} = require './course'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

LOADING = 'loading'
LOADED  = 'loaded'
FAILED  = 'failed'

CourseListingActions = flux.createActions [
  'load'
  'loaded'
]

CourseListingStore = flux.createStore
  actions: _.values(CourseListingActions)
  _asyncStatus: null

  load: -> # Used by API
    @_asyncStatus = LOADING
    @emit('load')

  loaded: (list) ->
    @_courses = list
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
      return @_courses

    get: (id) ->
      _.findWhere(@_courses, {id: id})

module.exports = {CourseListingActions, CourseListingStore}
