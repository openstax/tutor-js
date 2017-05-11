_ = require 'underscore'
{makeSimpleStore} = require './helpers'

{TaskStore} = require '../flux/task'

{TaskHelper} = require 'shared'

TaskPanel =
  _steps: {}

  loaded: (task, taskId) ->
    @_steps[taskId] = TaskHelper.mapSteps(task)
    @emit('loaded')

  sync: (taskId) ->
    task = TaskStore.get(taskId)
    task.steps = TaskStore.getSteps(taskId)
    @loaded(task, taskId)

  _get: (taskId) ->
    _.where(@_steps[taskId], {isAvailable: true})

  exports:
    get: (id) -> @_get(id)

    getStep: (id, stepIndex) -> @_get(id)[stepIndex]

    getStepByKey: (id, stepKey) -> @exports.getStep.call(@, id, stepKey - 1)

    getStepIndex: (id, stepInfo) ->
      steps = @_get(id)
      stepIndex = _.findIndex(steps, stepInfo)
      return null if stepIndex is -1
      stepIndex

    getStepKey: (id, stepInfo) ->
      @exports.getStepIndex.call(@, id, stepInfo) + 1

    getProgress: (id, stepIndex) ->
      steps = @_steps[id]

      if steps.length
        (stepIndex + 1) / (steps.length) * 100
      else
        0

{actions, store} = makeSimpleStore(TaskPanel)

TaskStore.on('step.completed', (stepId, taskId) ->
  actions.sync(taskId)
)

module.exports = {TaskPanelActions:actions, TaskPanelStore:store}
