_ = require 'underscore'
flux = require 'flux-react'

{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskStepConfig =

  complete: (id) ->
    @_change(id, {is_completed: true})
    @emitChange()

  completed: (empty, step) ->
    # First arg is null and ignored because it was a PUT ./completed

  setAnswerId: (id, answer_id) ->
    @_change(id, {answer_id})
    @emitChange()

  setFreeResponseAnswer: (id, free_response) ->
    @_change(id, {free_response})
    @emitChange()

  getRecovery: (id) ->
    #clear changed when they try to recover for this id
    @emitChange()

  gotRecovery: (obj, id) ->
    obj.recovery = obj.id
    @loaded(obj, id)
    @loaded(obj, obj.id)
    @emitChange()

  exports:
    isAnswered: (id) ->
      step = @_get(id)
      isAnswered = true
      if step.type is 'exercise'
        unless step.answer_id
          isAnswered = false
      isAnswered

    getFreeResponse: (id) ->
      step = @_get(id)
      step.free_response
    getAnswerId: (id) ->
      step = @_get(id)
      step.answer_id


extendConfig(TaskStepConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskStepConfig)
module.exports = {TaskStepActions:actions, TaskStepStore:store}
