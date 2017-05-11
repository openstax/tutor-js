# coffeelint: disable=no_empty_functions
_ = require 'underscore'
flux = require 'flux-react'
Durations = require '../helpers/durations'
{StepTitleActions} = require './step-title'

RECOVERY = 'recovery'

{CrudConfig, makeSimpleStore, extendConfig, STATES} = require './helpers'

isMissingExercises = (response) ->
  response.errors? and _.findWhere(response.errors, {code: 'no_exercises'})

TaskStepConfig =
  _asyncStatus: {}
  _recoveryTarget: {}
  _loadingPersonalizedStatus: {}

  _loaded: (obj, id) ->
    if not obj.task_id
      obj.task_id = @_local[id]?.task_id
    @emit('step.loaded', id)
    _.each(@_recoveryTarget, _.partial(@_updateRecoveredFor, id), @)
    StepTitleActions.parseStep(obj)

    @_loadingPersonalizedStatus[id] = false if @_loadingPersonalizedStatus[id]

    obj

  _saved: (obj, id) ->
    obj.task_id = @_local[id]?.task_id
    obj

  loadPersonalized: (id) ->
    @_load(id)
    @_loadingPersonalizedStatus[id] = true

  loadedNoPersonalized: (obj, id) ->
    {data, status, statusMessage} = obj
    @_asyncStatus[id] = STATES.LOADED

    if isMissingExercises(data) and @exports.isPlaceholder.call(@, id)
      @setNoPersonalized(id)
      @emitChange()
      @emit('step.loaded', id)
    else
      @FAILED(status, statusMessage, id)

  setNoPersonalized: (id) ->
    fakeEmptyPersonalized =
      type: 'placeholder'
      group: 'personalized'
      placeholder_for: 'exercise'
      exists: false
      id: id
      is_completed: true

    @_local[id] = _.extend({}, @_get(id), fakeEmptyPersonalized)

  forceReload: (id) ->
    @_reload[id] = true

  complete: (id) ->
    @_change(id, {is_completed: true})
    @_save(id)

  completed: (obj, id) ->
    @_asyncStatus[id] = STATES.LOADED

  setAnswerId: (id, answer_id) ->
    @_change(id, {answer_id})
    @_save(id)

  setFreeResponseAnswer: (id, free_response) ->
    @_change(id, {free_response})
    @_save(id)

  updateTempFreeResponse: (id, cachedFreeResponse) ->
    @_change(id, {cachedFreeResponse})

  loadRecovery: (id) ->
    @_asyncStatus[id] = RECOVERY
    @emit('change', id)

  loadedRecovery: (obj, id) ->
    @_recoveryTarget[id] = obj.id
    @emit('step.recovered', obj)

  _updateRecoveredFor: (loadedId, recoverTarget, recoveredFor) ->
    if recoverTarget is loadedId
      @emit('change', recoveredFor)
      @clearChanged(recoveredFor)
      delete @_asyncStatus[recoveredFor]
      delete @_recoveryTarget[recoveredFor]

  exports:
    isRecovering: (id) -> @_asyncStatus[id] is RECOVERY

    isAnswered: (id) ->
      step = @_get(id)
      isAnswered = true
      if step.type is 'exercise'
        unless step.answer_id
          isAnswered = false
      isAnswered

    isCore: (id) ->
      step = @_get(id)
      coreGroups = [
        'core'
        'recovery'
        'default'
      ]
      coreGroups.indexOf(step.group) > -1

    isPlaceholder: (id) ->
      step = @_get(id)
      step?.type is 'placeholder'

    isLoadingPersonalized: (id) ->
      @_loadingPersonalizedStatus[id]

    shouldExist: (id) ->
      @_get(id)?.exists isnt false

    getTaskId: (id) ->
      step = @_get(id)
      step.task_id

    getCnxId: (id) ->
      step = @_get(id)
      parts = step?.content_url?.split('contents/')
      if parts.length > 1 then _.last(parts) else undefined

    getFreeResponse: (id) ->
      step = @_get(id)
      step.free_response

    getAnswerId: (id) ->
      step = @_get(id)
      step.answer_id

    hasContent: (id) ->
      step = @_get(id)
      step.content? or step.content_html? or step.content_url?

    hasFreeResponse: (id) ->
      step = @_get(id)
      return false unless step.type is 'exercise'

      step.content.questions?[0].formats?.indexOf('free-response') > -1

    getTempFreeResponse: (id) ->
      step = @_get(id)
      return '' unless step.cachedFreeResponse
      step.cachedFreeResponse

    canTryAnother: (id, task, hasIncorrect = false) ->
      step = @_get(id)
      step? and
        (step.has_recovery and (hasIncorrect or step.correct_answer_id isnt step.answer_id)) and
        not Durations.isPastDue(task) and
        not @exports.isLoading.call(@, id) and
        not @exports.isSaving.call(@, id)

extendConfig(TaskStepConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskStepConfig)
module.exports = {TaskStepActions:actions, TaskStepStore:store}
