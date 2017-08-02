_ = require 'underscore'
deepMerge = require 'lodash/merge'
includes = require 'lodash/includes'
UiSettings = require '../model/ui-settings'
{formatSection} = require './step-content'
{
  INDIVIDUAL_REVIEW,
  PERSONALIZED_GROUP,
  SPACED_PRACTICE_GROUP,
  TWO_STEP_ALIAS,
  INTRO_ALIASES,
  makeAliases
} = require './step-helps'

ONE_TIME_CARD_DEFAULTS =
  taskId: ''
  stepId: ''

# Settings keys are:
# 'two-step-info'
# 'personalized-info'
# 'spaced-practice-info'
SETTING_KEYS = makeAliases('info')

PRACTICES = [
  'practice'
  'chapter_practice'
  'page_practice'
  'practice_worst_topics'
]

SEE_AHEAD_ALLOWED = [
  'concept_coach'
  'homework'
].concat(PRACTICES)

ALL_TYPES = ['reading'].concat(SEE_AHEAD_ALLOWED)

TYPE_SEPARATOR = '-'

makeStep = (task, step = {}, stepIndex) ->

  if step.chapter_section?
    sectionLabel = formatSection(step.chapter_section)
    firstSectionStep = _.findIndex(task.steps, (compareStep) ->
      formatSection(compareStep.chapter_section) is sectionLabel
    )
    step.sectionLabel = formatSection(step.chapter_section) if stepIndex is firstSectionStep

  step = _.pick(step,
    'id', 'type', 'is_completed', 'related_content', 'group', 'chapter_section'
    'is_correct', 'answer_id', 'correct_answer_id', 'label', 'sectionLabel'
  )
  task = _.pick(task, 'title', 'type', 'due_at', 'description', 'id')

  _.extend({task}, step)

makeUiSettings = (initial) ->
  deepMerge({}, ONE_TIME_CARD_DEFAULTS, initial)

makeKeyForType = (settingKey, taskType) ->
  "#{settingKey}#{TYPE_SEPARATOR}#{taskType}"

isPlacedHere = (settingKey, step) ->
  settings = UiSettings.get(settingKey) or {}
  settings = settings.placement or settings
  step.task_id is settings.taskId and step.id is settings.stepId

hasBeenPlaced = (settingKey) ->
  settings = UiSettings.get(settingKey)
  # has been found for setting in current task type, return early
  return true if not _.isEmpty(settings)

  # otherwise, need to check for setting in all task types

  # make a setting key with no type
  settingKeyParts = settingKey.split(TYPE_SEPARATOR)
  settingKeyParts.pop()
  settingKeyNoType = settingKeyParts.join(TYPE_SEPARATOR)

  # find type for which setting exists
  placedForType = _.find(ALL_TYPES, (taskType) ->
    typedSettingKey = makeKeyForType(settingKeyNoType, taskType)
    not _.isEmpty( UiSettings.get(typedSettingKey))
  )

  return placedForType?

isPractice = (task) ->
  _.contains(PRACTICES, task.type)

stepMapOneTimeCard = (condition, type, settingKey, isAvailable, task, step, stepIndex) ->
  settingKeyForTaskType = makeKeyForType(settingKey, task.type)

  if hasBeenPlaced(settingKeyForTaskType)
    if isPlacedHere(settingKeyForTaskType, step)
      makeStep(task, {type}, stepIndex)
  else if isAvailable and condition(task, step, stepIndex)
    settings =
      stepId: step.id
      taskId: task.id

    settings = makeUiSettings(settings)
    UiSettings.set(settingKeyForTaskType, settings)

    makeStep(task, {type}, stepIndex)

stepMapOneTimeCardForGroup = (group, condition, isAvailable, task, step, stepIndex) ->
  type = INTRO_ALIASES[group]
  settingKey = SETTING_KEYS[group]
  return if _.any([type, settingKey, group], _.isUndefined)

  stepMapOneTimeCard(condition, type, settingKey, isAvailable, task, step, stepIndex)


befores = {}

# TODO for future implementation of instructions card.
# befores['intro'] = (task, step, stepIndex) ->
#   makeStep(task, {type: 'task-intro'}, stepIndex)

befores[SPACED_PRACTICE_GROUP] = (task, step, stepIndex, isAvailable) ->
  isSpacedPractice = (task, step, stepIndex) ->
    # TODO check if should be first or last
    _.findWhere(task.steps, {group: SPACED_PRACTICE_GROUP})?.id is step.id

  return if isPractice(task)

  if task.type is 'reading'
    if isSpacedPractice(task, step, stepIndex)
      makeStep(task, {type: INTRO_ALIASES[SPACED_PRACTICE_GROUP]}, stepIndex)
  else
    stepMapOneTimeCardForGroup(
      SPACED_PRACTICE_GROUP,
      isSpacedPractice,
      isAvailable,
      arguments...
    )

isPersonalized = (task, step, stepIndex) ->
  _.findWhere(task.steps, {group: PERSONALIZED_GROUP})?.id is step.id

befores[INDIVIDUAL_REVIEW] = (task, step, stepIndex, isAvailable) ->
  return unless includes(['reading', 'homework'], task.type)
  stepMapOneTimeCardForGroup(
    INDIVIDUAL_REVIEW,
    isPersonalized,
    isAvailable,
    arguments...
  )

befores[PERSONALIZED_GROUP] = (task, step, stepIndex, isAvailable) ->

  return if isPractice(task)

  stepMapOneTimeCardForGroup(
    PERSONALIZED_GROUP,
    isPersonalized,
    isAvailable,
    arguments...
  )

# to gather for multiparts to have one intro two-step card before the full
# multipart.
gatherFollowingParts = (task, step, stepIndex) ->
  {content_url} = step
  parts = [step.content.questions]
  return _.flatten(parts) unless step.is_in_multipart

  _.each(task.steps, (stepCheck, checkIndex) ->
    if checkIndex > stepIndex and
      stepCheck.is_in_multipart and
      stepCheck.content_url is content_url
        parts.push(stepCheck.content.questions)
  )

  _.flatten(parts)

befores[TWO_STEP_ALIAS] = (task, step, stepIndex, isAvailable) ->
  isTwoStep = (task, step, stepIndex) ->
    return unless step?.content?.questions?

    stepQuestions = gatherFollowingParts(task, step, stepIndex)

    _.any(stepQuestions, (question) ->
      _.contains(question.formats, 'free-response') and
        not _.isEmpty(
          _.intersection(question.formats, ['multiple-choice', 'true-false', 'fill-in-the-blank'])
        )
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
