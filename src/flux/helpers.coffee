_ = require 'underscore'
flux = require 'flux-react'

LOADING = 'loading'
LOADED  = 'loaded'
FAILED  = 'failed'
SAVING  = 'saving'

CrudConfig =
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

  FAILED: (status, msg, id) ->
    @_asyncStatus[id] = FAILED
    delete @_local[id]
    @_errors[id] = msg
    @emitChange()

  load: (id) ->
    @_asyncStatus[id] = LOADING
    @emitChange()

  loaded: (obj, id) ->
    # id = obj.id
    @_asyncStatus[id] = LOADED
    @_local[id] = obj
    @emitChange()

  save: (id, obj) ->
    @_asyncStatus[id] = SAVING
    @emitChange()

  saved: (result, id) ->
    # id = result.id
    @_asyncStatus[id] = LOADED # TODO: Maybe make this SAVED
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
    get: (id) -> @_local[id]


# Helper for creating a simple store for actions
makeSimpleStore = (storeConfig) ->

  actionsConfig = _.omit storeConfig, (value, key) ->
    typeof value isnt 'function' or key is 'exports'

  actionsConfig = _.keys(actionsConfig)
  actions = flux.createActions(actionsConfig)
  storeConfig.actions = _.values(actions)
  store = flux.createStore(storeConfig)
  {actions, store}


extendConfig = (newConfig, origConfig) ->
  newConfig.exports ?= {}
  _.defaults(newConfig, origConfig)
  _.defaults(newConfig.exports, origConfig.exports)
  newConfig


module.exports = {CrudConfig, makeSimpleStore, extendConfig}
