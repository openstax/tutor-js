_ = require 'underscore'
hash = require 'object-hash'
deepMerge = require 'lodash/merge'

{makeSimpleStore, STATES} = require './helpers'

{StepPanel, utils} = require '../helpers/policies'
{TaskStepStore} = require '../flux/task-step'
{TaskStore} = require '../flux/task'
{UiSettings} = require 'shared'

ONE_TIME_CARD_DEFAULTS =
  placement:
    taskId: ''
    stepId: ''
  is_completed: true

# old key, keep backwards compatibility
TWO_STEP_VIEWED_KEY = 'has-viewed-two-step-help'

TWO_STEP_KEY = 'two-step-info'
PERSONALIZED_KEY = 'personalized-info'

# to return an array like this:
# [{panels: [{name: 'view' ... }], id: stepId}, {panels: [{name: 'two-step'...}]}, {panels: []}]

makeStep = (task, step = {}, stepIndex) ->
  stepId = step.id or 'default'

  panels = StepPanel.getPanelsWithStatus(stepId)
  step = _.pick(step,
    'id', 'type', 'is_completed', 'related_content', 'group',
    'is_correct', 'answer_id', 'correct_answer_id'
  )
  task = _.pick(task, 'title', 'type', 'due_at', 'description')

  _.extend({panels, task}, step)

makeUiSettings = (initial) ->
  deepMerge({}, ONE_TIME_CARD_DEFAULTS, initial)

isPlacedHere = (settingKey, step) ->
  {placement} = UiSettings.get(settingKey)
  step.task_id is placement.taskId and step.id is placement.stepId

hasBeenPlaced = (settingKey) ->
  settings = UiSettings.get(settingKey)
  settings?.placement?

stepMapOneTimeCard = (condition, type, settingKey, task, step, stepIndex) ->
  if hasBeenPlaced(settingKey)
    if isPlacedHere(settingKey, step)
      makeStep(task, {type}, stepIndex)
  else if condition(task, step, stepIndex)
    placement =
      stepId: step.id
      taskId: task.id

    is_completed = true

    settings = makeUiSettings({placement, is_completed})
    UiSettings.set(settingKey, settings)

    makeStep(task, {type}, stepIndex)

befores =
  # TODO for future implementation of instructions card.
  'intro': -> null

  'spaced-practice': (task, step, stepIndex) ->
    firstSpacedPractice = _.findWhere(task.steps, {group: 'spaced practice'})
    if firstSpacedPractice? and firstSpacedPractice.id is step.id
      makeStep(task, {type: 'spaced-practice-intro'}, stepIndex)

  'personalized': (task, step, stepIndex) ->
    isPersonalized = (task, step, stepIndex) ->
      firstPersonalized = _.findWhere(task.steps, {group: 'personalized'}).id
      firstPersonalized? and firstPersonalized.id is step.id

    stepMapOneTimeCard(isPersonalized, 'personalized-intro', PERSONALIZED_KEY, arguments...)

  'two-step': (task, step, stepIndex) ->
    isTwoStep = (task, step, stepIndex) ->
      return false if UiSettings.get(TWO_STEP_VIEWED_KEY) or not step?.content?.questions?
      _.any(step.content.questions, (question) ->
        _.contains(question.formats, 'free-response') and
          _.contains(question.formats, 'multiple-choice')
      )

    stepMapOneTimeCard(isTwoStep, 'two-step-intro', TWO_STEP_KEY, arguments...)

afters =
  'end': (task, step, stepIndex) ->
    makeStep(task, {type: 'end'}, stepIndex) if stepIndex is task.steps.length - 1

stepMappers = _.flatten([
  _.values(befores)
  makeStep
  _.values(afters)
])

TaskPanel =
  _steps: {}

  loaded: (task, taskId) ->
    panels = _.map task.steps, (step, stepIndex) ->
      _.chain(stepMappers)
        .map (stepMapper) ->
          stepInfo = stepMapper(task, step, stepIndex)
          incompleteIndex = _.findIndex(task.steps, {is_completed: false})

          isAvailable = TaskStore.doesAllowSeeAhead(task.id) or
            incompleteIndex is -1 or
            stepIndex <= incompleteIndex

          _.extend(stepInfo, {isAvailable}) if stepInfo

          stepInfo

        .compact()
        .value()

    @_steps[taskId] = _.flatten(panels)


  _get: (taskId) ->
    _.where(@_steps[taskId], {isAvailable: true})

  exports:
    get: (id) -> @_get(id)

    getStep: (id, stepIndex) -> @_get(id)[stepIndex]

    getStepByKey: (id, stepKey) -> @exports.getStep.call(@, id, stepKey - 1)

    getStepKey: (id, stepInfo) ->
      steps = @_get(id)
      stepIndex = _.findIndex(steps, stepInfo)
      return null if stepIndex is -1
      stepIndex + 1

    getStepPanel: (id, stepIndex) ->
      step = @exports.getStep.call(@, id, stepIndex)
      panel = utils._getPanel step.panels
      panel.names

    getProgress: (id, stepIndex) ->
      steps = @_steps[id]

      if steps.length
        (stepIndex + 1) / (steps.length) * 100
      else
        0


{actions, store} = makeSimpleStore(TaskPanel)
module.exports = {TaskPanelActions:actions, TaskPanelStore:store}
