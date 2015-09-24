# coffeelint: disable=no_empty_functions
_ = require 'underscore'
moment = require 'moment'
flux = require 'flux-react'

Durations = require '../helpers/durations'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{TaskStepStore} = require './task-step'

{MediaActions, MediaStore} = require './media'

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
  _.find steps, (step) ->
    # return for first step where step.is_completed = false or
    # step.is_completed is undefined
    not step.is_completed or not step.is_completed?

getIncompleteSteps = (steps) ->
  _.filter steps, (step) ->
    step? and not step.is_completed

getCompleteSteps = (steps) ->
  _.filter steps, (step) ->
    step? and step.is_completed

TaskConfig =
  _steps: {}

  _getStep: (taskId, stepId) ->
    step = _.find(@_steps[taskId], (s) -> s.id is stepId)
    step

  _grabHtmlFromReading: (step) ->
    step.content_html

  _grabHtmlFromExercise: (step) ->
    return '' unless step.content?

    html = step.content.stimulus_html
    questionHtml = _.pluck(step.content.questions, 'stem_html').join('')
    html += questionHtml

  _grabHtml: (obj) ->
    htmlToParse = _.map(obj.steps, (step) =>
      if step.type is 'reading'
        html = @_grabHtmlFromReading(step)
      else if step.type is 'exercise'
        html = @_grabHtmlFromExercise(step)
      html
    ).join('')

  _loaded: (obj, id) ->
    MediaActions.parse(@_grabHtml(obj))
    # Populate all the TaskSteps when a Task is loaded
    @_steps ?= {}
    # Remove the steps so Components are forced to use `.getSteps()` to get
    # the updated step objects
    steps = obj.steps
    delete obj.steps
    @_steps[id] = steps
    {TaskStepActions, TaskStepStore} = require './task-step'
    for step in steps
      #HACK: set the task_id so we have a link back to the task from the step
      step.task_id = id
      TaskStepActions.loaded(step, step.id)
    obj

    # explicit return obj to load onto @_local
    obj

  loadUserTasks: (courseId) -> # Used by API
  loadedUserTasks: (obj) ->
    tasks = obj.items
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

    # Returns the reading and it's step index for a given task's ID
    getReadingForTaskId: (taskId, id) ->
      steps = getSteps(@_steps[taskId])
      {related_content} = TaskStepStore.get(id)

      # replace findIndex with findLastIndex if we should be going to the
      # most recent step of a related reading
      relatedStepIndex = _.findIndex steps, (step) ->
        (step.type is 'reading') and (_.isEqual(step.chapter_section, _.first(related_content).chapter_section))

      # should never happen if the taskId was valid
      throw new Error('BUG: Invalid taskId.  Unable to find index') unless relatedStepIndex > -1
      # Find the first step of the related reading that appears before the given task
      {reading: steps[relatedStepIndex], index: relatedStepIndex}

    getDefaultStepIndex: (taskId) ->
      steps = getSteps(@_steps[taskId])

      if steps.length is 1
        return 0
      stepIndex = getCurrentStepIndex(steps)

      completeStep = _.find steps, {is_completed: true}
      if stepIndex is 0 and not completeStep? then -1 else stepIndex

    getStepsIds: (id) ->
      _.map(@_steps[id], (step) ->
        _.pick(step, 'id')
      )

    getCurrentStep: (taskId) ->
      steps = getSteps(@_steps[taskId])
      step = getCurrentStep(steps)

    getIncompleteSteps: (taskId) ->
      allSteps = getSteps(@_steps[taskId])
      steps = getIncompleteSteps(allSteps)

    getCompletedSteps: (taskId) ->
      allSteps = getSteps(@_steps[taskId])
      steps = getCompleteSteps(allSteps)

    getIncompleteCoreStepsIndexes: (taskId) ->
      allSteps = getSteps(@_steps[taskId])
      firstIndex =   _.findIndex allSteps, (step) ->
        step? and not step.is_completed and TaskStepStore.isCore(step.id)

      lastIndex = _.findLastIndex allSteps, (step) ->
        step? and not step.is_completed and TaskStepStore.isCore(step.id)

      coreSteps = [
        firstIndex
      ]
      unless lastIndex is firstIndex
        coreSteps.push lastIndex

      coreSteps

    hasIncompleteCoreStepsIndexes: (taskId) ->
      allSteps = getSteps(@_steps[taskId])
      steps = _.find(allSteps, (step) ->
        step? and not step.is_completed and TaskStepStore.isCore(step.id)
      )
      steps?

    getFirstNonCoreIndex: (taskId) ->
      allSteps = getSteps(@_steps[taskId])
      stepIndex = _.findIndex(allSteps, (step) ->
        step? and not TaskStepStore.isCore(step.id)
      )

    getPlaceholder: (taskId) ->
      allSteps = getSteps(@_steps[taskId])
      _.findWhere(allSteps, type: 'placeholder')

    isTaskCompleted: (taskId) ->
      incompleteStep = getCurrentStep(getSteps(@_steps[taskId]))
      not incompleteStep

    isSingleStepped: (taskId) ->
      @_steps[taskId].length is 1

    doesAllowSeeAhead: (taskId) ->
      allowed = [
        'homework'
        'practice'
        'chapter_practice',
        'page_practice'
      ]

      if allowed.indexOf(@_get(taskId).type) > -1 then true else false

    getRelatedSections: (taskId) ->
      _.chain(getSteps(@_steps[taskId]))
        .pluck('chapter_section')
        .compact()
        .uniq( (cs) -> cs.join('.') )
        .value()


    getCompletedStepsCount: (taskId) ->
      allSteps = getSteps(@_steps[taskId])
      steps = getCompleteSteps(allSteps)

      steps.length

    getTotalStepsCount: (taskId) ->
      allSteps = getSteps(@_steps[taskId])

      allSteps.length

    isTaskPastDue: (taskId) ->
      Durations.isPastDue( @_get(taskId) )

    isPractice: (taskId) ->
      practices = [
        'practice'
        'chapter_practice',
        'page_practice'
      ]

      if practices.indexOf(@_get(taskId).type) > -1 then true else false

    getStepLateness: (taskId, stepId) ->
      result =
        late: false
        last_completed_at: null
        how_late: null

      step = @_getStep(taskId, stepId)
      {due_at, type} = @_get(taskId)

      return result unless step? and type is 'homework'

      {last_completed_at} = step

      result.late = moment(due_at).isBefore(last_completed_at)
      result.last_completed_at = last_completed_at
      result.how_late = moment(due_at).from(last_completed_at, true)

      result

extendConfig(TaskConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskConfig)
module.exports = {TaskActions:actions, TaskStore:store}
