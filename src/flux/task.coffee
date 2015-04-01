_ = require 'underscore'
flux = require 'flux-react'
{TaskStepActions, TaskStepStore} = require './task-step'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

getSteps = (steps) ->
  _.map steps, ({id}) ->
    TaskStepStore.get(id)

getCurrentStepIndex = (steps) ->
  currentStep = -1
  for step, i in steps
    unless step.is_completed
      currentStep = i
      break
  currentStep

getCurrentStep = (steps) ->
  _.findWhere(steps, {is_completed: false})


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
      #HACK: set the task_id so we have a link back to the task from the step
      step.task_id = id
      TaskStepActions.loaded(step, step.id)
    obj

    # explicit return obj to load onto @_local
    obj

  loadUserTasks: (courseId) ->
    # Used by API
  loadedUserTasks: (tasks) ->
    # Used by API
    for task in tasks
      @loaded(task, task.id)

    @emitChange()

  exports:
    getSteps: (id) ->
      throw new Error('BUG: Steps not loaded') unless @_steps[id]
      getSteps(@_steps[id])

    getAll: -> _.values(@_local)

    getCurrentStepIndex: (taskId) ->
      steps = getSteps(@_steps[taskId])
      # Determine the first uncompleted step
      getCurrentStepIndex(steps)

    getDefaultStepIndex: (taskId) ->
      steps = getSteps(@_steps[taskId])

      if steps.length is 1
        return 0
      stepIndex = getCurrentStepIndex(steps)

      if stepIndex is 0 then -1 else stepIndex

    getCurrentStep: (taskId) ->
      steps = getSteps(@_steps[taskId])
      step = getCurrentStep(steps)

    isTaskCompleted: (taskId) ->
      incompleteStep = getCurrentStep(getSteps(@_steps[taskId]))
      incompleteStep?

    isSingleStepped: (taskId) ->
      @_steps[taskId].length is 1

extendConfig(TaskConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskConfig)
module.exports = {TaskActions:actions, TaskStore:store}
