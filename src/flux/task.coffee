_ = require 'underscore'
flux = require 'flux-react'
{CurrentUserActions, CurrentUserStore} = require './current-user'

TaskActions = flux.createActions [
  'reset'       # () ->
  'edit'        # (id, {})  ->
  'complete'    # (id) ->
  'save'        # (id) ->
  'saved'       # (id) ->
  'load'        # (id) ->
  'loaded'      # (id, taskObj) ->
  'FAILED'      # (id, statusCode, msgObj) ->
]

LOADING = 'loading'
LOADED  = 'loaded'
FAILED  = 'failed'


TaskStore = flux.createStore
  actions: [
    # First 2 are common to all Stores
    CurrentUserActions.logout
    TaskActions.reset
    TaskActions.FAILED
    TaskActions.load
    TaskActions.loaded
    TaskActions.edit
    TaskActions.complete
    TaskActions.saved
  ]

  _asyncStatus: {}
  _local: {}
  _errors: {}
  _unsaved: {}

  reset: ->
    @_asyncStatus = {}
    @_local = {}
    @_errors = {}
    @_unsaved = {}
    @emitChange()

  logout: -> @reset()

  FAILED: (id, status, msg) ->
    @_asyncStatus[id] = FAILED
    delete @_local[id]
    @_errors[id] = msg
    @emitChange()

  load: (id) ->
    @_asyncStatus[id] = LOADING
    @emitChange()

  loaded: (id, obj) ->
    @_asyncStatus[id] = LOADED
    @_local[id] = obj
    @emitChange()

  edit: (id, obj) ->
    # TODO: Perform validation
    @_unsaved[id] ?= {}
    _.extend(@_unsaved[id], obj)
    @emitChange()

  complete: (id) ->
    @edit(id, {complete:true})

  saved: (id, result) ->
    @_local[id] = result
    delete @_unsaved[id]
    delete @_errors[id]
    @emitChange()

  exports:
    isUnknown: (id) -> !@_asyncStatus[id]
    isLoading: (id) -> @_asyncStatus[id] is LOADING
    isLoaded: (id) -> @_asyncStatus[id] is LOADED
    isFailed: (id) -> @_asyncStatus[id] is FAILED
    getAsyncStatus: (id) -> @_asyncStatus[id]

    getUnsaved: (id) -> @_unsaved[id]
    get: (id) ->
      _.extend({}, @_local[id], @_unsaved[id])

module.exports = {TaskActions, TaskStore}
