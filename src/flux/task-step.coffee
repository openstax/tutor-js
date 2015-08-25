# coffeelint: disable=no_empty_functions
_ = require 'underscore'
camelCase = require 'camelcase'
flux = require 'flux-react'
Task = require './task'
Durations = require '../helpers/durations'

RECOVERY = 'recovery'

{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskStepConfig =
  _asyncStatus: {}

  _loaded: (obj, id) ->
    if not obj.task_id
      obj.task_id = @_local[id]?.task_id
    @emit("step.loaded", id)
    obj

  _saved: (obj, id) ->
    obj.task_id = @_local[id]?.task_id
    obj

  forceReload: (id) ->
    @_reload[id] = true

  complete: (id) ->
    @_change(id, {is_completed: true})
    @_save(id)

  completed: (obj, id) ->
    @loaded(obj, id)
    @emit('step.completed', id)

  setAnswerId: (id, answer_id) ->
    @_change(id, {answer_id})
    @_save(id)

  setFreeResponseAnswer: (id, free_response) ->
    @_change(id, {free_response})
    @_save(id)

  loadRecovery: (id) ->
    @_asyncStatus[id] = RECOVERY

  loadedRecovery: (obj, id) ->
    delete @_asyncStatus[id]
    @clearChanged()
    @emit('step.recovered', obj)

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
        'default'
      ]
      coreGroups.indexOf(step.group) > -1

    isPlaceholder: (id) ->
      step = @_get(id)
      step.type is 'placeholder'

    getTaskId: (id) ->
      step = @_get(id)
      step.task_id

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

    canTryAnother: (id, task) ->
      step = @_get(id)
      step? and
        (step.has_recovery and step.correct_answer_id isnt step.answer_id) and
        not Durations.isPastDue(task) and
        not @exports.isRecovering.call(@, id) and
        not @exports.isLoading.call(@, id) and
        not @exports.isSaving.call(@, id)

extendConfig(TaskStepConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskStepConfig)
module.exports = {TaskStepActions:actions, TaskStepStore:store}
