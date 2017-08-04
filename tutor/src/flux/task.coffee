# coffeelint: disable=no_empty_functions
_ = require 'underscore'
moment = require 'moment'
flux = require 'flux-react'

Durations = require '../helpers/durations'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{TaskStepActions, TaskStepStore} = require './task-step'

{MediaActions} = require './media'
{StepTitleActions} = require './step-title'

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

getChangedSteps = (steps) ->
  _.filter steps, (step) ->
    step? and TaskStepStore.isChanged(step.id)

# HACK When working locally a step completion triggers a reload but the is_completed field on the TaskStep
# is discarded. so, if is_completed is set on the local object but not on the returned JSON
# Tack on a dummy correct_answer_id
hackLocalStepCompletion = (step) ->
  if step.is_completed and step.content?.questions?[0]?.answers[0]? and not step.correct_answer_id
    step.correct_answer_id = step.content.questions[0].answers[0].id
    step.feedback_html = 'Some <em>FAKE</em> feedback'

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
    @emit('loaded', id)
    MediaActions.parse(@_grabHtml(obj))
    StepTitleActions.parseSteps(obj.steps)
    # Populate all the TaskSteps when a Task is loaded
    @_steps ?= {}
    # Remove the steps so Components are forced to use `.getSteps()` to get
    # the updated step objects
    steps = obj.steps
    delete obj.steps
    @_steps[id] = steps

    for step in steps
      hackLocalStepCompletion(step) if obj.HACK_LOCAL_STEP_COMPLETION
      #HACK: set the task_id so we have a link back to the task from the step
      step.task_id = id
      TaskStepActions.loaded(step, step.id)
    obj

    # explicit return obj to load onto @_local
    obj

  completeStep: (id, taskId) ->
    TaskStepActions.complete(id)
    @emit('step.completing', id)
    if @exports.hasPlaceholders.call(@, taskId) and
      not @exports.hasIncompleteCoreStepsIndexes.call(@, taskId)
        placeholderSteps = @exports.getPlaceholders.call(@, taskId)
        _.forEach(placeholderSteps, (step) ->
          TaskStepActions._loadPersonalized(step.id)
        )


  stepCompleted: (obj, taskStepId) ->
    TaskStepActions.completed(obj, taskStepId)
    this._loaded(obj, obj.id)
    @emit('step.completed', taskStepId, obj.id)

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
      getCurrentStepIndex(steps)

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

    hasAnyStepChanged: (taskId) ->
      allSteps = getSteps(@_steps[taskId])
      getChangedSteps(allSteps).length


    hasIncompleteCoreStepsIndexes: (taskId) ->
      allSteps = getSteps(@_steps[taskId])
      steps = _.find(allSteps, (step) ->
        step? and not step.is_completed and TaskStepStore.isCore(step.id)
      )
      steps?

    getPlaceholders: (taskId) ->
      allSteps = getSteps(@_steps[taskId])
      _.where(allSteps, type: 'placeholder')

    getFirstNonCoreIndex: (taskId) ->
      allSteps = getSteps(@_steps[taskId])
      stepIndex = _.findIndex(allSteps, (step) ->
        step? and not TaskStepStore.isCore(step.id)
      )

    hasPlaceholders: (taskId) ->
      not _.isEmpty(@exports.getPlaceholders.call(@, taskId))

    isTaskCompleted: (taskId) ->
      incompleteStep = getCurrentStep(getSteps(@_steps[taskId]))
      not incompleteStep

    hasCrumbs: (taskId) ->
      not (
        @_steps[taskId].length is 1 and
        @_get(taskId).type is 'external' or
        @_get(taskId).type is 'reading'
      )

    hasProgress: (taskId) ->
      @_steps[taskId].length >= 1 and @_get(taskId).type is 'reading'

    getRelatedSections: (taskId) ->
      _.chain(getSteps(@_steps[taskId]))
        .pluck('chapter_section')
        .compact()
        .uniq( (cs) -> cs.join('.') )
        .value()

    getStepsRelatedContent: (taskId) ->
      _.chain(getSteps(@_steps[taskId]))
        .filter( (step) -> TaskStepStore.isCore(step.id))
        .pluck('related_content')
        .compact()
        .flatten()
        .uniq( (cs) -> cs.chapter_section.join('.'))
        .sortBy( (cs) -> cs.chapter_section.join('.'))
        .value()

    getDetails: (taskId) ->
      title = ''
      sections = []

      {title, type} = @_get(taskId)
      sections = @exports.getRelatedSections.call(@, taskId)

      if _.isEmpty(sections) and type is 'concept_coach'
        details = @exports.getStepsRelatedContent.call(@, taskId)
        unless _.isEmpty(details)
          sections = _.pluck(details, 'chapter_section')
          title = details[0].title

      {title, sections}

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
        'chapter_practice'
        'page_practice'
        'practice_worst_topics'
      ]

      if practices.indexOf(@_get(taskId).type) > -1 then true else false

    getStepIndex: (taskId, stepId) ->
      _.findIndex(@_steps[taskId], id: stepId)

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

    getStepParts: (taskId, stepId) ->
      currentStep = @_getStep(taskId, stepId)
      {content_url} = currentStep
      parts = _.filter @_steps[taskId], (step) ->
        step.is_in_multipart and step.content_url is content_url

      parts = [currentStep] if _.isEmpty(parts)

      parts = getSteps(parts)

    getStepByIndex: (taskId, stepIndex) ->
      @_steps[taskId][stepIndex]

    isFeedbackImmediate: (taskId) ->
      {is_feedback_available} = @_get(taskId)
      is_feedback_available

    isDeleted: (taskId) ->
      {is_deleted} = @_get(taskId)
      is_deleted

    isSameStep: (taskId, stepIds...) ->
      contentUrls = _.chain(stepIds)
        .map (stepId) =>
          step = @_getStep(taskId, stepId)

          if step?.is_in_multipart
            step.content_url
          else
            null

        .uniq()
        .value()

      contentUrls.length is 1 and _.first(contentUrls)?

extendConfig(TaskConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TaskConfig)
module.exports = {TaskActions:actions, TaskStore:store}
