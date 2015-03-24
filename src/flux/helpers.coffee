_ = require 'underscore'
flux = require 'flux-react'

LOADING = 'loading'
LOADED  = 'loaded'
FAILED  = 'failed'
SAVING  = 'saving'
DELETING = 'deleting'
DELETED = 'deleted'

idCounter = 0
CREATE_KEY = -> "_CREATING_#{idCounter++}"

isNew = (id) -> /_CREATING_/.test(id)

CrudConfig = ->
  {
    _asyncStatus: {}
    _local: {}
    _changed: {}
    _errors: {}

    # If the specific type needs to do something else to the object:
    # _loaded : (obj, id) ->
    # _saved : (obj, id) ->

    reset: ->
      @_asyncStatus = {}
      @_local = {}
      @_changed = {}
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
      # HACK When working locally a step completion triggers a reload but the is_completed field on the TaskStep
      # is discarded. so, if is_completed is set on the local object but not on the returned JSON
      # Tack on a dummy correct_answer_id
      if @_local[id] and obj.HACK_LOCAL_STEP_COMPLETION
        for step in @_local[id].steps
          # HACK: Tack on a fake correct_answer and feedback to all completed steps that have an exercise but no correct_answer_id
          if step.is_completed and step.content?.questions?[0]?.answers[0]? and not step.correct_answer_id
            step.correct_answer_id = step.content.questions[0].answers[0].id
            step.feedback_html = 'Some <em>FAKE</em> feedback'

      if obj
        @_local[id] = @_loaded?(obj, id) or obj

      @emitChange()

    save: (id, obj) ->
      # Note: id could be isNew()
      @_asyncStatus[id] = SAVING
      @emitChange()

    saved: (result, id) ->
      # id = result.id
      @_asyncStatus[id] = LOADED # TODO: Maybe make this SAVED

      obj = @_saved?(result, id)
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

    created: (result, localId) ->
      @_local[localId] = result # HACK: So react component can still manipulate the same object
      @_local[result.id] = result
      @_asyncStatus[localId] = LOADED
      @_asyncStatus[result.id] = LOADED
      @emitChange()

    _change: (id, obj) ->
      @_changed[id] ?= {}
      _.extend(@_changed[id], obj)
      @emitChange()

    delete: (id) ->
      @_asyncStatus[id] = DELETING

    deleted: (result, id) ->
      @_asyncStatus[id] = DELETED
      delete @_local[id]
      @emitChange()

    clearChanged: (id) ->
      delete @_changed[id]

    # Keep this here so other exports method have access to it
    _get: (id) ->
      return null unless @_asyncStatus[id] is LOADED or @_asyncStatus[id] is SAVING
      _.extend({}, @_local[id], @_changed[id])

    exports:
      isUnknown: (id) -> !@_asyncStatus[id]
      isLoading: (id) -> @_asyncStatus[id] is LOADING
      isLoaded: (id) -> @_asyncStatus[id] is LOADED
      isFailed: (id) -> @_asyncStatus[id] is FAILED
      getAsyncStatus: (id) -> @_asyncStatus[id]
      get: (id) -> @_get(id)
      isChanged: (id) -> !_.isEmpty(@_changed[id])
      getChanged: (id) -> @_changed[id] or {}
      freshLocalId: -> CREATE_KEY()
      isNew: (id) -> isNew(id)
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


module.exports = {CrudConfig, makeSimpleStore, extendConfig}
