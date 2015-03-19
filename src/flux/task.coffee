_ = require 'underscore'
flux = require 'flux-react'
{TaskStepActions} = require './task-step'
{CurrentUserActions, CurrentUserStore} = require './current-user'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskConfig =
  _getStep: (taskId, stepId) ->
    task = @_local[taskId]
    step = _.find(task.steps, (s) -> s.id is stepId)
    step

  _loaded: (obj, id) ->
    # Populate all the TaskSteps when a Task is loaded
    for step in obj.steps
      TaskStepActions.loaded(step, step.id)

  loadUserTasks: ->
    # Used by API
  loadedUserTasks: (tasks) ->
    # Used by API
    for task in tasks
      @loaded(task, task.id)

    @emitChange()

  exports:
    getAll: -> _.values(@_local)


extendConfig(TaskConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskConfig)
module.exports = {TaskActions:actions, TaskStore:store}
