_ = require 'underscore'
flux = require 'flux-react'
{TaskStepActions, TaskStepStore} = require './task-step'
{CurrentUserActions, CurrentUserStore} = require './current-user'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskConfig =
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
      #HACK: set the task_id so we have a link back to the task from the step
      step.task_id = id
      TaskStepActions.loaded(step, step.id)
    obj

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
