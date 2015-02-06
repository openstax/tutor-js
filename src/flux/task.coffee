_ = require 'underscore'
flux = require 'flux-react'
{CurrentUserActions, CurrentUserStore} = require './current-user'
{AnswerStore} = require './answer'

TaskActions = flux.createActions [
  'reset'       # () ->
  'edit'        # (id, {})  ->
  'complete'    # (id) ->
  'save'        # (id) ->
  'saved'       # (id) ->
  'load'        # (id) ->
  'loaded'      # (id, taskObj) ->
  'updateStep'  # (id, stepId, updateObj) ->
  'completeStep'# (id, stepId) ->
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
    TaskActions.completeStep
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

  updateStep: (id, stepId, updateObj) ->
    task = @_local[id]
    _.extend(task.steps[stepId], updateObj)

  completeStep: (id, stepId) ->
    task = @_local[id]
    task.steps[stepId].is_completed = true
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
    isStepAnswered: (id, stepId) ->
      step = @_local[id].steps[stepId]

      isAnswered = true
      if step.type is 'exercise'
        for question in step.content.questions
          unless AnswerStore.getAnswer(question)?
            isAnswered = false
            break
      isAnswered

module.exports = {TaskActions, TaskStore}
