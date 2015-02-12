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

  # If the specific type needs to do something else to the object:
  # _loaded : (obj, id) ->
  # _saved : (obj, id) ->

  reset: ->
    @_asyncStatus = {}
    @_local = {}
    @_errors = {}
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
    # If the specific type needs to do something else to the object:
    @_loaded?(obj, id)
    @emitChange()

  save: (id, obj) ->
    @_asyncStatus[id] = SAVING
    @emitChange()

  saved: (result, id) ->
    # id = result.id
    @_asyncStatus[id] = LOADED # TODO: Maybe make this SAVED
    @_local[id] = result
    delete @_errors[id]
    # If the specific type needs to do something else to the object:
    @_saved?(result, id)
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
