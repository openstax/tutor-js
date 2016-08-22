_ = require 'underscore'

{makeSimpleStore} = require './helpers'

TaskProgressConfig =
  _local: {}

  update: (taskId, currentStep) ->
    previousStep = @_local[taskId]
    @_local[taskId] = currentStep

    @emit("update.#{taskId}", previous: previousStep, current: currentStep)

  reset: (taskId) ->
    return unless taskId?
    previousStep = @_local[taskId]
    @_local[taskId] = null

    @emit("reset.#{taskId}", previous: previousStep)

  resetAll: ->
    _.each @_local, (progress, taskId) =>
      @reset(taskId)

  exports:

    get: (taskId) ->
      @_local[taskId]


{actions, store} = makeSimpleStore(TaskProgressConfig)
module.exports = {TaskProgressActions:actions, TaskProgressStore:store}
