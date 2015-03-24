_ = require 'underscore'
flux = require 'flux-react'
{TaskStepActions, TaskStepStore} = require './task-step'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskConfig =
  _steps: {}

  _getStep: (taskId, stepId) ->
    task = @_local[taskId]
    step = _.find(task.steps, (s) -> s.id is stepId)
    step

  _loaded: (obj, id) ->
    # Populate all the TaskSteps when a Task is loaded
    @_steps ?= {}
    # Remove the steps so Components are forced to use `.getSteps()` to get
    # the updated step objects
    steps = obj.steps
    delete obj.steps
    @_steps[id] = steps
    for step in steps
      TaskStepActions.loaded(step, step.id)

    # explicit return obj to load onto @_local
    obj

  loadUserTasks: ->
    # Used by API
  loadedUserTasks: (tasks) ->
    # Used by API
    for task in tasks
      @loaded(task, task.id)

    @emitChange()

  exports:
    getSteps: (id) ->
      throw new Error('BUG: Steps not loaded') unless @_steps[id]
      _.map @_steps[id], ({id}) ->
        TaskStepStore.get(id)
    getAll: -> _.values(@_local)


extendConfig(TaskConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskConfig)
module.exports = {TaskActions:actions, TaskStore:store}
