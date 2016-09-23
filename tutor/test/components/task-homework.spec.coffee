# Tests for homework specific tasks

{expect} = require 'chai'
_ = require 'underscore'
moment = require 'moment'

{taskActions, taskTests, taskChecks} = require './helpers/task'
{UiSettings} = require 'shared'

{TimeActions, TimeStore} = require '../../src/flux/time'
{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

COURSE_ID = '1'
HOMEWORK_TASK_ID = '6'
TARGET_STEP_INDEX = 1
HOMEWORK_MODEL = require '../../api/tasks/6.json'
HOMEWORK_MODEL.due_at = moment(TimeStore.getNow()).add(1, 'year').toDate()

HOMEWORK_PERSONALIZED_MODEL = require '../../api/steps/step-id-6-4-full.json'

FAKE_PLACEMENT =
  taskId: 'test'
  stepId: 'test'

describe 'Task Widget, homework specific things, due in the future', ->

  beforeEach (done) ->
    UiSettings.initialize(
      "two-step-info-#{HOMEWORK_MODEL.type}": FAKE_PLACEMENT
      "spaced-practice-info-#{HOMEWORK_MODEL.type}": FAKE_PLACEMENT
      "personalized-info-#{HOMEWORK_MODEL.type}": FAKE_PLACEMENT
    )
    TaskActions.HACK_DO_NOT_RELOAD(true)
    TaskStepActions.HACK_DO_NOT_RELOAD(true)

    TaskActions.loaded(HOMEWORK_MODEL, HOMEWORK_TASK_ID)

    taskTests
      .goToTask("/courses/#{COURSE_ID}/tasks/#{HOMEWORK_TASK_ID}", HOMEWORK_TASK_ID)
      .then((result) =>
        @result = result
        done()
      , done)

  afterEach ->
    UiSettings._reset()
    taskTests.unmount()

    TaskActions.reset()
    TaskStepActions.reset()

    TaskActions.HACK_DO_NOT_RELOAD(false)
    TaskStepActions.HACK_DO_NOT_RELOAD(false)

  it 'should be able to work through a step in homework', (done) ->
    # run a full step through and check each step
    taskTests
      .renderStep(HOMEWORK_TASK_ID)
      .then(taskTests.workExerciseAndCheck)
      .then( ->
        done()
      , done)

  it 'should not be able view feedback after completing a step', (done) ->
    # run a full step through and check for feedback
    taskActions
      .fillFreeResponse(@result)
      .then(taskActions.saveFreeResponse)
      .then(taskActions.pickMultipleChoice)
      .then(taskActions.saveMultipleChoice)
      .then(taskChecks.checkNotFeedback)
      .then( ->
        done()
      , done)

  it 'should be able to work through a true-false question', (done) ->
    taskActions
      .clickBreadcrumb(2)(@result)
      .then(taskChecks.workTrueFalseAndCheck)
      .then( ->
        done()
      , done)

  it 'should show homework done page on homework completion', (done) ->
    taskActions
      .completeSteps(@result)
      .then(taskChecks.checkIsCompletePage)
      .then( ->
        done()
      , done)

  it 'should allow viewing any step with breadcrumbs', (done) ->
    taskActions
      .clickBreadcrumb(TARGET_STEP_INDEX)(@result)
      .then(taskChecks.checkIsMatchStep(TARGET_STEP_INDEX))
      .then(taskChecks.checkIsNotCompletePage)
      .then( ->
        done()
      , done)

  it 'should format the details page using markdown (for now)', (done) ->
    taskActions
      .triggerDetails(@result)
      .then(taskChecks.checkIsPopoverOpen)
      .then( ->
        done()
      , done)

  it 'should show breadcrumbs for all steps', (done) ->
    taskChecks
      .checkAreAllStepsShowing(@result)
      .then( ->
        done()
      , done)

  it 'should show last core step when last core problem is clicked', (done) ->
    incompleteCore = TaskStore.getIncompleteCoreStepsIndexes(HOMEWORK_TASK_ID)
    lastStepIndex = _.last(incompleteCore)

    taskActions
      .clickBreadcrumb(lastStepIndex)(@result)
      .then(taskChecks.checkIsMatchStep(lastStepIndex))
      .then( ->
        done()
      , done)

  it 'should show pending personalized step when pending clicked', (done) ->
    incompleteCore = TaskStore.getIncompleteCoreStepsIndexes(HOMEWORK_TASK_ID)
    lastStepIndex = _.last(incompleteCore) + 1

    taskActions
      .clickBreadcrumb(lastStepIndex)(@result)
      .then(taskChecks.checkIsMatchStep(lastStepIndex))
      .then(taskChecks.checkIsPendingStep(lastStepIndex))
      .then( ->
        done()
      , done)

  # TODO figure how to test this better.
  # it 'should update pending personalized step when core completed', (done) ->
  #   incompleteCore = TaskStore.getIncompleteCoreStepsIndexes(HOMEWORK_TASK_ID)
  #   lastStepIndex = _.last(incompleteCore) + 1

  #   placeholder = TaskStore.getPlaceholder(HOMEWORK_TASK_ID)

  #   taskActions
  #     .completeThisStep(@result)
  #     .then(taskActions.advanceStep)
  #     .then(taskActions.completeThisStep)
  #     .then(taskActions.advanceStep)
  #     .then(taskActions.completeThisStep)
  #     .then(taskActions.loadStep(placeholder.id, HOMEWORK_PERSONALIZED_MODEL))
  #     .then(taskActions.advanceStep)
  #     .then(taskActions.forceUpdate)
  #     .then(taskChecks.checkIsNotPendingStep(lastStepIndex))
  #     .then( ->
  #       done()
  #     , done)

  it 'should show complete page when complete page is clicked', (done) ->
    steps = TaskStore.getStepsIds(HOMEWORK_TASK_ID)
    completeStepIndex = steps.length

    taskActions
      .clickBreadcrumb(completeStepIndex)(@result)
      .then(taskChecks.checkIsCompletePage)
      .then( ->
        done()
      , done)

  it 'should show all breadcrumbs for homework', (done) ->
    taskChecks
      .checkHasAllBreadcrumbs(@result)
      .then( ->
        done()
      , done)
