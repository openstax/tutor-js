_ = require 'underscore'
deepMerge = require 'lodash/merge'

UiSettings = require '../model/ui-settings'
{_sectionFormat} = require '../components/chapter-section-mixin'

ONE_TIME_CARD_DEFAULTS =
  placement:
    taskId: ''
    stepId: ''
  is_completed: true

# old key, keep backwards compatibility
TWO_STEP_VIEWED_KEY = 'has-viewed-two-step-help'

TWO_STEP_KEY = 'two-step-info'
PERSONALIZED_KEY = 'personalized-info'

SEE_AHEAD_ALLOWED = [
  'concept_coach'
  'homework'
  'practice'
  'chapter_practice',
  'page_practice'
]


makeStep = (task, step = {}, stepIndex) ->
  stepId = step.id or 'default'

  if step.chapter_section?
    sectionLabel = _sectionFormat(step.chapter_section)
    firstSectionStep = _.findIndex(task.steps, (compareStep) ->
      _sectionFormat(compareStep.chapter_section) is sectionLabel
    )
    step.sectionLabel = _sectionFormat(step.chapter_section) if stepIndex is firstSectionStep

  step = _.pick(step,
    'id', 'type', 'is_completed', 'related_content', 'group', 'chapter_section'
    'is_correct', 'answer_id', 'correct_answer_id', 'label', 'sectionLabel'
  )
  task = _.pick(task, 'title', 'type', 'due_at', 'description', 'id')

  _.extend({task}, step)

makeUiSettings = (initial) ->
  deepMerge({}, ONE_TIME_CARD_DEFAULTS, initial)

isPlacedHere = (settingKey, step) ->
  {placement} = UiSettings.get(settingKey)
  step.task_id is placement.taskId and step.id is placement.stepId

hasBeenPlaced = (settingKey) ->
  settings = UiSettings.get(settingKey)
  settings?.placement?

stepMapOneTimeCard = (condition, type, settingKey, isAvailable, task, step, stepIndex) ->
  if hasBeenPlaced(settingKey)
    if isPlacedHere(settingKey, step)
      makeStep(task, {type}, stepIndex)
  else if isAvailable and condition(task, step, stepIndex)
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

  'personalized': (task, step, stepIndex, isAvailable) ->
    isPersonalized = (task, step, stepIndex) ->
      firstPersonalized = _.findWhere(task.steps, {group: 'personalized'})
      firstPersonalized? and firstPersonalized.id is step.id

    stepMapOneTimeCard(
      isPersonalized,
      'personalized-intro',
      PERSONALIZED_KEY,
      isAvailable,
      arguments...
    )

  'two-step': (task, step, stepIndex, isAvailable) ->
    isTwoStep = (task, step, stepIndex) ->
      return false if UiSettings.get(TWO_STEP_VIEWED_KEY) or not step?.content?.questions?
      _.any(step.content.questions, (question) ->
        _.contains(question.formats, 'free-response') and
          _.contains(question.formats, 'multiple-choice')
      )

    stepMapOneTimeCard(
      isTwoStep,
      'two-step-intro',
      TWO_STEP_KEY,
      isAvailable,
      arguments...
    )

afters =
  'end': (task, step, stepIndex) ->
    makeStep(task, {type: 'end', label: 'summary'}, stepIndex) if stepIndex is task.steps.length - 1

stepMappers = _.flatten([
  _.values(befores)
  makeStep
  _.values(afters)
])

mapSteps = (task) ->
  _.chain(task.steps)
    .map (step, stepIndex) ->
      _.map stepMappers, (stepMapper) ->
        lastComplete = _.findLastIndex(task.steps, {is_completed: true})
        latestIncomplete = lastComplete + 1

        isAvailable = _.contains(SEE_AHEAD_ALLOWED, task.type) or stepIndex <= latestIncomplete

        stepInfo = stepMapper(task, step, stepIndex, isAvailable)
        _.extend(stepInfo, {isAvailable}) if stepInfo

        stepInfo
    .flatten()
    .compact()
    .value()

module.exports = {mapSteps}
