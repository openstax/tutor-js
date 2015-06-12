_ = require 'underscore'
camelCase = require 'camelcase'
flux = require 'flux-react'

{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskStepConfig =

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
    @emitChange()

  loadedRecovery: (obj, id) ->
    @clearChanged()
    @emitChange()
    @emit('step.recovered', obj)

  exports:
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

extendConfig(TaskStepConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskStepConfig)
module.exports = {TaskStepActions:actions, TaskStepStore:store}
