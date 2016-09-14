_ = require 'underscore'
hash = require 'object-hash'
deepMerge = require 'lodash/merge'

{makeSimpleStore, STATES} = require './helpers'

{StepPanel} = require '../helpers/policies'
{TaskStepStore} = require '../flux/task-step'
{UiSettings} = require 'shared'

ONE_TIME_CARD_DEFAULTS =
  placement:
    taskId: ''
    stepId: ''
  is_completed: false

# old key, keep backwards compatibility
TWO_STEP_VIEWED_KEY = 'has-viewed-two-step-help'

TWO_STEP_KEY = 'two-step-info'
PERSONALIZED_KEY = 'personalized-info'

# to return an array like this:
# [{panels: [{name: 'view' ... }], id: stepId}, {panels: [{name: 'two-step'...}]}, {panels: []}]

makeStep = (task, step = {}, stepIndex) ->
  stepId = step.id or 'default'

  panels = StepPanel.getPanelsWithStatus(stepId)

  _.extend({panels}, _.pick(step, 'id', 'type', 'is_completed'))

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
      console.info(settingKey)
      makeStep(task, {type}, stepIndex)
  else if condition(task, step, stepIndex)
    placement =
      stepId: step.id
      taskId: task.id

    settings = makeUiSettings({placement})
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
      return false unless step?.content?.questions?
      _.any(step.content.questions, (question) ->
        _.contains(question.formats, 'free-response') and
          _.contains(question.formats, 'multiple-choice')
      )

    stepMapOneTimeCard(isTwoStep, 'two-step-intro', TWO_STEP_KEY, arguments...)


afters = {}

stepMappers = _.flatten([
  _.values(befores)
  makeStep
  _.values(afters)
])


TaskPanel =
  _local: {}

  loaded: (task, taskId) ->
    panels = _.map(task.steps, (step, stepIndex) ->
      _.chain(stepMappers)
        .map (stepMapper) ->
          stepMapper(task, step, stepIndex)
        .compact()
        .value()
    )
    @_local[taskId] = _.flatten(panels)

  _get: (taskId) ->
    @_local[taskId]

  exports:
    get: (id) -> @_get(id)


{actions, store} = makeSimpleStore(TaskPanel)
module.exports = {TaskPanelActions:actions, TaskPanelStore:store}
