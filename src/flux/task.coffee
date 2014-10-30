_ = require 'underscore'
flux = require 'flux-react'
{CurrentUserActions, CurrentUserStore} = require './current-user'

TaskActions = flux.createActions [
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
    TaskActions.FAILED
    TaskActions.load
    TaskActions.loaded
    TaskActions.edit
    TaskActions.complete
  ]

  getInitialState: ->
    asyncStatus: {}
    local: {}
    errors: {}
    unsaved: {}

  logout: ->
    @state = @getInitialState()
    @emitChange()

  FAILED: (id, status, msg) ->
    @state.asyncStatus[id] = FAILED
    delete @state.local[id]
    @state.errors[id] = msg
    @emitChange()

  load: (id) ->
    @state.asyncStatus[id] = LOADING
    @emitChange()

  loaded: (id, obj) ->
    @state.asyncStatus[id] = LOADED
    @state.local[id] = obj
    @emitChange()

  edit: (id, obj) ->
    # TODO: Perform validation
    @state.unsaved[id] ?= {}
    _.extend(@state.unsaved[id], obj)
    @emitChange()

  complete: (id) ->
    @state.editHandler(id, {complete:true})
    @emitChange()

  saved: (id, result) ->
    @state.local[id] = result
    delete @state.unsaved[id]
    delete @state.errors[id]
    @emitChange()

  exports:
    isUnknown: (id) -> !@asyncStatus[id]
    isLoading: (id) -> @asyncStatus[id] is LOADING
    isLoaded: (id) -> @asyncStatus[id] is LOADED
    isFailed: (id) -> @asyncStatus[id] is FAILED
    getAsyncStatus: (id) -> @asyncStatus[id]

    getUnsaved: (id) -> @unsaved[id]
    get: (id) ->
      _.extend({}, @local[id], @unsaved[id])

module.exports = {TaskActions, TaskStore}
