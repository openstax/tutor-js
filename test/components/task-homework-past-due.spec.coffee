# Tests for homework specific tasks

{expect} = require 'chai'
_ = require 'underscore'

{taskActions, taskTests, taskChecks} = require './helpers/task'

{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

courseId = '1'
homeworkTaskId = '5'

homework_model = require '../../api/tasks/5.json'

describe 'Task Widget, homework specific things, past due date', ->
  beforeEach (done) ->
    TaskActions.HACK_DO_NOT_RELOAD(true)
    TaskStepActions.HACK_DO_NOT_RELOAD(true)

    TaskActions.loaded(homework_model, homeworkTaskId)

    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{homeworkTaskId}", homeworkTaskId)
      .then((result) =>
        @result = result
        done()
      , done)

  afterEach ->
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
    steps = TaskStore.getStepsIds(homeworkTaskId)
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
