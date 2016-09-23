# Tests for homework specific tasks

{expect} = require 'chai'
_ = require 'underscore'
{UiSettings} = require 'shared'

{taskActions, taskTests, taskChecks} = require './helpers/task'

{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

COURSE_ID = '1'
HOMEWORK_TASK_ID = '5'

HOMEWORK_MODEL = require '../../api/tasks/5.json'

FAKE_PLACEMENT =
  taskId: 'test'
  stepId: 'test'

describe 'Task Widget, homework specific things, past due date', ->
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

  it 'should be able view feedback after completing a step', (done) ->
    # run a full step through and check for feedback
    taskActions
      .clickContinue(@result)
      .then(taskActions.fillFreeResponse)
      .then(taskActions.saveFreeResponse)
      .then(taskActions.pickMultipleChoice)
      .then(taskActions.saveMultipleChoice)
      .then(taskChecks.checkForFeedback)
      .then( ->
        done()
      , done)

  it 'should be able to go to review page after completing a step', (done) ->
    steps = TaskStore.getStepsIds(HOMEWORK_TASK_ID)
    completeStepIndex = steps.length

    taskActions
      .clickContinue(@result)
      .then(taskActions.fillFreeResponse)
      .then(taskActions.saveFreeResponse)
      .then(taskActions.pickMultipleChoice)
      .then(taskActions.saveMultipleChoice)
      .then(taskActions.clickContinue)
      .then(taskActions.clickBreadcrumb(completeStepIndex))
      .then(taskChecks.checkIsCompletePage)
      .then(taskChecks.checkEndReview)
      .then( ->
        done()
      , done)
