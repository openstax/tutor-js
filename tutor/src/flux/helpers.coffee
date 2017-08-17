_ = require 'underscore'
flux = require 'flux-react'

LOADING = 'loading'
LOADED  = 'loaded'
FAILED  = 'failed'
SAVING  = 'saving'
DELETING = 'deleting'
DELETED = 'deleted'

STATES =
  LOADING : LOADING
  LOADED  : LOADED
  FAILED  : FAILED
  SAVING  : SAVING
  DELETING: DELETING
  DELETED : DELETED

idCounter = 0
CREATE_KEY = -> "_CREATING_#{idCounter++}"

isNew = (id) -> /_CREATING_/.test(id)

CrudConfig = ->
  {
    _asyncStatus: {}
    _local: {}
    _changed: {}
    _errors: {}
    _reload: {}

    # If the specific type needs to do something else to the object:
    # _loaded : (obj, id) ->
    # _saved : (obj, id) ->
    # _reset : ->

    reset: ->
      @_asyncStatus = {}
      @_local = {}
      @_changed = {}
      @_errors = {}
      @_reload = {}

      @_reset?()
      @emitChange()

    dontReload: (id) ->
      @_asyncStatus[id] is LOADED and @_HACK_DO_NOT_RELOAD

    FAILED: (status, msg, id, args...) ->
      @_asyncStatus[id] = FAILED
      @_errors[id] = msg
      @_failed?({status, msg}, id, args...)

      unless status is 0 # indicates network failure
        delete @_local[id]
        @emitChange()

    load: (id) ->
      @_load(id)

    # allow aliasing load without triggering api call.
    _load: (id) ->
      # Add a shortcut for unit testing
      return if @dontReload(id)
      @_reload[id] = false
      @_asyncStatus[id] = LOADING
      @emitChange()

    loaded: (obj, id, args...) ->
      # id = obj.id
      @_asyncStatus[id] = LOADED

      if obj
        # If the specific type needs to do something else to the object:
        @_local[id] = @_loaded?(obj, id, args...) or obj

      @emitChange()

    save: (id, obj) ->
      # Note: id could be isNew()
      @_asyncStatus[id] = SAVING
      @emitChange()

    saved: (result, id, args...) ->
      # id = result.id
      @_asyncStatus[id] = LOADED # TODO: Maybe make this SAVED

      # If the specific type needs to do something else to the object:
      obj = @_saved?(result, id, args...)
      result = obj if obj

      if result
        @_local[id] = result
        @_local[result.id] = result
        delete @_changed[result.id]
      else
        console.warn('API WARN: Server did not return JSON after saving. Patching locally')
        # Merge all the local changes into the new local object
        @_local[id] = _.extend(@_local[id], @_changed[id])
      delete @_changed[id]
      delete @_errors[id]
      # If the specific type needs to do something else to the object:
      @emitChange()

    create: (localId, attributes = {}) ->
      throw new Error('BUG: MUST provide a local id') unless isNew(localId)
      @_local[localId] = {}
      @_changed[localId] = attributes
      @_asyncStatus[localId] = LOADED

    created: (result, localId, args...) ->
      @_local[localId] = result # HACK: So react component can still manipulate the same object
      @_local[result.id] = result
      @_asyncStatus[localId] = LOADED
      @_asyncStatus[result.id] = LOADED
      @emitChange()
      @_created?(result, localId, args...)

    _change: (id, obj) ->
      @_changed[id] ?= {}
      _.extend(@_changed[id], obj)
      @emitChange()

    _save: (id) ->
      @_asyncStatus[id] = SAVING

    delete: (id) ->
      @_asyncStatus[id] = DELETING
      @_delete?(id)

    deleted: (result, id, args...) ->
      @_asyncStatus[id] = DELETED
      delete @_local[id]
      @emitChange()
      @_deleted?(result, id, args...)

    clearChanged: (id) ->
      delete @_changed[id]

    HACK_DO_NOT_RELOAD: (bool) -> @_HACK_DO_NOT_RELOAD = bool

    # Keep this here so other exports method have access to it
    _get: (id) ->
      val = @_local[id]
      return null unless val or @_asyncStatus[id] is SAVING
      # Scores stores an Array unlike most other stores
      if _.isArray(val)
        val
      else
        _.extend({}, val, @_changed[id])

    exports:
      isUnknown: (id) -> not @_asyncStatus[id]
      isLoading: (id) -> @_asyncStatus[id] is LOADING
      isLoaded: (id) -> @_asyncStatus[id] is LOADED
      isDeleting: (id) -> @_asyncStatus[id] is DELETING
      isSaving: (id) -> @_asyncStatus[id] is SAVING
      isFailed: (id) -> @_asyncStatus[id] is FAILED
      getAsyncStatus: (id) -> @_asyncStatus[id]
      get: (id) -> @_get(id)
      isChanged: (id) -> not _.isEmpty(@_changed[id])
      getChanged: (id) -> @_changed[id] or {}
      freshLocalId: -> CREATE_KEY()
      isNew: (id) -> isNew(id)
      reload: (id) -> @_reload[id]
      getError: (id) -> @_errors[id]

  }

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


makeStandardStore = (name, storeConfig) ->
  extendConfig(storeConfig, new CrudConfig())
  {actions, store} = makeSimpleStore(storeConfig)
  {"#{name}Actions":actions, "#{name}Store":store}


module.exports = {CrudConfig, makeSimpleStore, extendConfig, makeStandardStore, isNew, STATES}
