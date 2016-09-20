_ = require 'underscore'
deepMerge = require 'lodash/merge'

UiSettings = require '../model/ui-settings'
{_sectionFormat} = require '../components/chapter-section-mixin'
{
  PERSONALIZED_GROUP,
  SPACED_PRACTICE_GROUP,
  TWO_STEP_ALIAS,
  INTRO_ALIASES,
  makeAliases
} = require './step-helps'

ONE_TIME_CARD_DEFAULTS =
  placement:
    taskId: ''
    stepId: ''
  is_completed: true

# Settings keys are:
# 'two-step-info'
# 'personalized-info'
# 'spaced-practice-info'
SETTING_KEYS = makeAliases('info')

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
  settingKeyForTaskType = "#{settingKey}-#{task.type}"

  if hasBeenPlaced(settingKeyForTaskType)
    if isPlacedHere(settingKeyForTaskType, step)
      makeStep(task, {type}, stepIndex)
  else if isAvailable and condition(task, step, stepIndex)
    placement =
      stepId: step.id
      taskId: task.id

    is_completed = true

    settings = makeUiSettings({placement, is_completed})
    UiSettings.set(settingKeyForTaskType, settings)

    makeStep(task, {type}, stepIndex)

stepMapOneTimeCardForGroup = (condition, isAvailable, task, step, stepIndex) ->

  type = INTRO_ALIASES[step.group]
  settingKey = SETTING_KEYS[step.group]
  return if _.any([type, settingKey, step.group], _.isUndefined)

  stepMapOneTimeCard(condition, type, settingKey, isAvailable, task, step, stepIndex)


befores = {}

# TODO for future implementation of instructions card.
# befores['intro'] = (task, step, stepIndex) ->
#   makeStep(task, {type: 'task-intro'}, stepIndex)

befores[SPACED_PRACTICE_GROUP] = (task, step, stepIndex, isAvailable) ->
  isSpacedPractice = (task, step, stepIndex) ->
    # TODO check if should be first or last
    _.findWhere(task.steps, {group: SPACED_PRACTICE_GROUP})?.id is step.id

  if task.type is 'reading' and isSpacedPractice(task, step, stepIndex)
    makeStep(task, {type: INTRO_ALIASES[SPACED_PRACTICE_GROUP]}, stepIndex)
  else
    stepMapOneTimeCardForGroup(
      isSpacedPractice,
      isAvailable,
      arguments...
    )

befores[PERSONALIZED_GROUP] = (task, step, stepIndex, isAvailable) ->
  isPersonalized = (task, step, stepIndex) ->
    _.findWhere(task.steps, {group: PERSONALIZED_GROUP})?.id is step.id

  stepMapOneTimeCardForGroup(
    isPersonalized,
    isAvailable,
    arguments...
  )

befores[TWO_STEP_ALIAS] = (task, step, stepIndex, isAvailable) ->
  isTwoStep = (task, step, stepIndex) ->
    return unless step?.content?.questions?
    _.any(step.content.questions, (question) ->
      _.contains(question.formats, 'free-response') and
        _.contains(question.formats, 'multiple-choice')
    )

  stepMapOneTimeCard(
    isTwoStep,
    INTRO_ALIASES[TWO_STEP_ALIAS],
    SETTING_KEYS[TWO_STEP_ALIAS],
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
