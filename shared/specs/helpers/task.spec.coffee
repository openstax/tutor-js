{expect, _} = require 'shared/specs/helpers'
times = require 'lodash/times'
cloneDeep = require 'lodash/cloneDeep'

TaskHelper = require 'helpers/task'
UiSettings = require 'model/ui-settings'

TASK_PRACTICE_TYPES = ['practice', 'chapter_practice', 'page_practice', 'practice_worst_topics']
TASK_HOMEWORK_TYPE = 'homework'
TASK_READING_TYPE = 'reading'
TASK_EVENT_TYPE = 'event'
TASK_CONCEPT_COACH_TYPE = 'concept_coach'

EXERCISE_DEFAULT_GROUP = 'default'
EXERCISE_CORE_GROUP = 'core'
EXERCISE_SPACED_PRACTICE_GROUP = 'spaced practice'
EXERCISE_PERSONALIZED_GROUP = 'personalized'

QUESTION_MULTI_TYPES = ['multiple-choice', 'true-false', 'fill-in-the-blank']
QUESTION_FREE_RESPONSE_TYPE = 'free-response'

EXERCISE_STEP_BASE =
  id: ''
  task_id: '1'
  type: 'exercise'
  group: EXERCISE_CORE_GROUP
  is_completed: false
  content:
    questions: [{
      formats: ['multiple-choice']
    }]

TASK_BASE =
  id: '1'
  type: ''

pickRandom = (types) ->
  types[_.random(0, types.length - 1)]

makeTwoStep = ->
  question =
    formats:
      ['free-response']

  question.formats.push(pickRandom(QUESTION_MULTI_TYPES))
  content:
    questions:
      [question]

makeTask = (taskType = 'reading', stepLength = 1, stepModifications = {}) ->
  task = cloneDeep(TASK_BASE)
  task.type = taskType

  task.steps = times(stepLength, ->
    cloneDeep(EXERCISE_STEP_BASE)
  )

  _.each(stepModifications, (mod, stepIndex) ->
    _.extend(task.steps[stepIndex], {id: String(stepIndex)}, mod)
  )

  task

describe 'Task Helper', ->

  afterEach ->
    UiSettings._reset()

  describe 'will add intro step for first two-step', ->

    numberOfSteps = 10
    twoStepPositions = [1, 4, 6, 7, 8]
    stepModifications = {}

    testForTwoStep = (task, steps) ->
      expect(steps.length).to.equal(task.steps.length + 2)
      expect(steps[1].type).to.equal('two-step-intro')
      expect(UiSettings.get("two-step-info-#{task.type}").stepId).to.equal('1')

    beforeEach ->
      stepModifications = _.object(twoStepPositions, times(twoStepPositions.length, makeTwoStep))

    describe 'for reading task', ->
      it 'does not intro if two-step is not yet available', ->
        readingTask = makeTask(TASK_READING_TYPE, numberOfSteps, stepModifications)
        steps = TaskHelper.mapSteps(readingTask)

        expect(steps.length).to.equal(readingTask.steps.length + 1)
        expect(_.where(steps, isAvailable: true).length).to.equal(1)
        undefined

      it 'only if two-step is completed or next upcoming step', ->

        stepModifications[0] =
          is_completed: true

        readingTask = makeTask(TASK_READING_TYPE, numberOfSteps, stepModifications)
        steps = TaskHelper.mapSteps(readingTask)

        testForTwoStep(readingTask, steps)
        expect(_.where(steps, isAvailable: true).length).to.equal(3)
        undefined

    it 'for homework task', ->

      homeworkTask = makeTask(TASK_HOMEWORK_TYPE, numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(homeworkTask)

      testForTwoStep(homeworkTask, steps)
      expect(_.where(steps, isAvailable: true).length)
        .to.equal(homeworkTask.steps.length + 2)
      undefined

    it 'for coach task', ->

      coachTask = makeTask(TASK_CONCEPT_COACH_TYPE, numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(coachTask)

      testForTwoStep(coachTask, steps)
      expect(_.where(steps, isAvailable: true).length)
        .to.equal(coachTask.steps.length + 2)
      undefined

    it 'for practice task', ->

      practiceTask = makeTask(pickRandom(TASK_PRACTICE_TYPES), numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(practiceTask)

      testForTwoStep(practiceTask, steps)
      expect(_.where(steps, isAvailable: true).length)
        .to.equal(practiceTask.steps.length + 2)
      undefined

    it 'does not place intro card if placed elsewhere', ->
      UiSettings.initialize(
        'two-step-info-homework':
          stepId: 'test'
          taskId: 'test'
      )

      homeworkTask = makeTask(TASK_HOMEWORK_TYPE, numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(homeworkTask)
      expect(steps.length).to.equal(homeworkTask.steps.length + 1)
      undefined

  describe 'will add intro step for first spaced practice', ->

    numberOfSteps = 20
    stepModifications = {}
    stepModification =
      group: EXERCISE_SPACED_PRACTICE_GROUP

    testForSpacedPractice = (task, steps) ->
      expect(steps.length).to.equal(task.steps.length + 2)
      expect(steps[12].type).to.equal('spaced-practice-intro')
      expect(UiSettings.get("spaced-practice-info-#{task.type}").stepId).to.equal('12')

    beforeEach ->
      stepModifications =
        12: stepModification
        13: stepModification
        14: stepModification

    it 'for reading task, creates but does not save placement', ->

      readingTask = makeTask(TASK_READING_TYPE, numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(readingTask)

      expect(steps.length).to.equal(readingTask.steps.length + 2)
      expect(steps[12].type).to.equal('spaced-practice-intro')
      expect(UiSettings.get("spaced-practice-info-#{readingTask.type}")).to.be.not.ok
      expect(_.where(steps, isAvailable: true).length)
        .to.equal(1)
      undefined

    it 'for homework task', ->

      homeworkTask = makeTask(TASK_HOMEWORK_TYPE, numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(homeworkTask)

      testForSpacedPractice(homeworkTask, steps)
      expect(_.where(steps, isAvailable: true).length)
        .to.equal(homeworkTask.steps.length + 2)
      undefined

    it 'for coach task', ->

      coachTask = makeTask(TASK_CONCEPT_COACH_TYPE, numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(coachTask)

      testForSpacedPractice(coachTask, steps)
      expect(_.where(steps, isAvailable: true).length)
        .to.equal(coachTask.steps.length + 2)
      undefined

    it 'for practice task, does not introduce', ->

      practiceTask = makeTask(pickRandom(TASK_PRACTICE_TYPES), numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(practiceTask)

      expect(steps.length).to.equal(practiceTask.steps.length + 1)
      undefined

    it 'does not place intro card if placed elsewhere', ->
      UiSettings.initialize(
        'spaced-practice-info-homework':
          stepId: 'test'
          taskId: 'test'
      )

      homeworkTask = makeTask(TASK_HOMEWORK_TYPE, numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(homeworkTask)
      expect(steps.length).to.equal(homeworkTask.steps.length + 1)
      undefined


  describe 'will add intro step for first personalized', ->

    numberOfSteps = 20
    stepModifications = {}
    stepModification =
      group: EXERCISE_PERSONALIZED_GROUP

    testForPersonalized = (task, steps) ->
      expect(steps.length).to.equal(task.steps.length + 3)
      expect(steps[13].type).to.equal('personalized-intro')
      expect(UiSettings.get("personalized-info-#{task.type}").stepId).to.equal('12')

    beforeEach ->
      stepModifications =
        12: stepModification
        13: stepModification
        14: stepModification

    describe 'for reading task', ->
      it 'does not intro if personalized is not yet available', ->
        readingTask = makeTask(TASK_READING_TYPE, numberOfSteps, stepModifications)
        steps = TaskHelper.mapSteps(readingTask)

        expect(steps.length).to.equal(readingTask.steps.length + 1)
        expect(_.where(steps, isAvailable: true).length).to.equal(1)
        undefined

      it 'only if personalized is completed or next upcoming step', ->

        _.each(_.range(0, 12), (stepIndex) ->
          stepModifications[stepIndex] ?= {}
          stepModifications[stepIndex].is_completed = true
        )

        readingTask = makeTask(TASK_READING_TYPE, numberOfSteps, stepModifications)
        steps = TaskHelper.mapSteps(readingTask)

        testForPersonalized(readingTask, steps)
        expect(_.where(steps, isAvailable: true).length).to.equal(15)
        undefined

    it 'for homework task', ->

      homeworkTask = makeTask(TASK_HOMEWORK_TYPE, numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(homeworkTask)

      testForPersonalized(homeworkTask, steps)
      expect(_.where(steps, isAvailable: true).length)
        .to.equal(homeworkTask.steps.length + 3)
      undefined

    it 'for coach task', ->

      coachTask = makeTask(TASK_CONCEPT_COACH_TYPE, numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(coachTask)

      testForPersonalized(coachTask, steps)
      expect(_.where(steps, isAvailable: true).length)
        .to.equal(coachTask.steps.length + 3)
      undefined

    it 'for practice task, does not introduce', ->

      practiceTask = makeTask(pickRandom(TASK_PRACTICE_TYPES), numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(practiceTask)

      expect(steps.length).to.equal(practiceTask.steps.length + 1)
      undefined

    it 'does not place intro card if placed elsewhere', ->
      UiSettings.initialize(
        'personalized-info-homework':
          stepId: 'test'
          taskId: 'test'
      )

      homeworkTask = makeTask(TASK_HOMEWORK_TYPE, numberOfSteps, stepModifications)
      steps = TaskHelper.mapSteps(homeworkTask)
      expect(steps.length).to.equal(homeworkTask.steps.length + 2)
      undefined
