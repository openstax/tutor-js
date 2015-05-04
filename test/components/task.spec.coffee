{expect} = require 'chai'
_ = require 'underscore'

{taskActions, taskTests, taskChecks} = require './helpers/task'

{CourseActions, CourseStore} = require '../../src/flux/course'
{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

{SinglePractice, Tasks} = require '../../src/components'

courseId = 1
taskId = 4

VALID_MODEL = require '../../api/tasks/4.json'

describe 'Task Widget', ->
  beforeEach (done) ->
    TaskActions.loaded(VALID_MODEL, taskId)

    taskTests
      .renderStep(taskId)
      .then((result) =>
        @result = result
        done()
      ).catch(done)

  afterEach ->
    taskTests.unmount()

    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

  # _.delay needed to prevent weird problems.
  it 'should render empty free response for unanswered exercise', (done) ->
    taskChecks
      .checkRenderFreeResponse(@result)
      .then((result) ->
        done()
      ).catch(done)

  it 'should update store when free response is submitted', (done) ->
    taskTests
      .answerFreeResponse(@result)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkAnswerFreeResponse)
      .then((result) ->
        done()
      ).catch(done)

  it 'should render multiple choice after free response', (done) ->
    taskTests
      .submitFreeResponse(@result)
      .then(taskChecks.checkSubmitFreeResponse)
      .then((result) ->
        done()
      ).catch(done)

  it 'should update store when multiple choice answer is chosen', (done) ->
    taskTests
      .answerMultipleChoice(@result)
      .then(taskChecks.checkAnswerMultipleChoice)
      .then((result) ->
        done()
      ).catch(done)

  it 'should render an answer and feedback html for an answered question', (done) ->
    taskTests
      .submitMultipleChoice(@result)
      .then(taskChecks.checkSubmitMultipleChoice)
      .then((result) ->
        done()
      ).catch(done)

  it 'should allow recovery when available and answer is incorrect', (done) ->
    taskTests
      .submitMultipleChoice(@result)
      .then(taskChecks.checkRecoveryRefreshChoice)
      .then((result) ->
        done()
      ).catch(done)


describe 'Task Widget, through routes', ->
  beforeEach (done) ->
    TaskActions.loaded(VALID_MODEL, taskId)
    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{taskId}", taskId)
      .then((result) =>
        @result = result
        done()
      ).catch(done)

  afterEach ->
    taskTests.unmount()

    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

  it 'should be able to work through a task and load next step from a route', (done) ->
    # run a full step through and check each step
    taskActions
      .clickContinue(@result)
      .then(taskTests.workExerciseAndCheck)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkIsNextStep)
      .then(taskActions.advanceStep)
      .then((result) ->
        done()
      ).catch(done)

  it 'should show appropriate done page on completion', (done) ->
    # run a full step through and check each step
    taskActions
      .clickContinue(@result)
      .then(taskActions.completeSteps)
      .then(taskChecks.checkIsCompletePage)
      .then((result) ->
        done()
      ).catch(done)
