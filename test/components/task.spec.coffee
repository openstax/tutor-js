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
  beforeEach ->
    TaskActions.loaded(VALID_MODEL, taskId)

  afterEach ->
    taskTests.unmount()

    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

  # _.delay needed to prevent weird problems.
  it 'should render empty free response for unanswered exercise', (done)->
    taskTests
      .renderFreeResponse(taskId)
      .then(taskChecks.checkRenderFreeResponse)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should update store when free response is submitted', (done) ->
    taskTests
      .answerFreeResponse(taskId)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkAnswerFreeResponse)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should render multiple choice after free response', (done) ->
    taskTests
      .submitFreeResponse(taskId)
      .then(taskChecks.checkSubmitFreeResponse)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should update store when multiple choice answer is chosen', (done) ->
    taskTests
      .answerMultipleChoice(taskId)
      .then(taskChecks.checkAnswerMultipleChoice)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should render an answer and feedback html for an answered question', (done) ->
    taskTests
      .submitMultipleChoice(taskId)
      .then(taskChecks.checkSubmitMultipleChoice)
      .then(_.delay(done, taskTests.delay)).catch(done)

  it 'should be able to work through a task and load next step from a route', (done) ->
    # run a full step through and check each step
    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{taskId}", taskId)
      .then(taskActions.clickContinue)
      .then(taskTests.workExerciseAndCheck)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkIsNextStep)
      .then(taskActions.advanceStep)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should show appropriate done page on completion', (done) ->
    # run a full step through and check each step
    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{taskId}", taskId)
      .then(taskActions.clickContinue)
      .then(taskActions.completeSteps)
      .then(taskChecks.checkIsCompletePage)
      .then(_.delay(done, taskTests.delay)).catch(done)

  it 'should allow recovery when available and answer is incorrect', (done) ->
    taskTests
      .submitMultipleChoice(taskId)
      .then(taskChecks.checkRecoveryRefreshChoice)
      .then(_.delay(done, taskTests.delay)).catch(done)
