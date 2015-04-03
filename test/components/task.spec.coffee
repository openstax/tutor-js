{expect} = require 'chai'
_ = require 'underscore'

{routerStub, taskTestActions, taskTests} = require './helpers/task'

{CourseActions, CourseStore} = require '../../src/flux/course'
{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

{SinglePractice, Tasks} = require '../../src/components'

courseId = 1
taskId = 4

VALID_MODEL = require '../../api/tasks/4.json'
homework_model = require '../../api/tasks/5.json'
 
describe 'Task Widget', ->
  beforeEach ->
    TaskActions.loaded(VALID_MODEL, taskId)

  afterEach ->
    routerStub.unmount()
    taskTests.unmount()

    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

  it 'should allow students to continue tasks', (done) ->
    tests = (result) ->
      taskTests.allowContinueFromIntro(result)
      done()

    routerStub.goTo("/courses/#{courseId}/tasks/#{taskId}").then(tests).catch(done)


  it 'should render next screen when Continue is clicked', (done) ->
    tests = (result) ->
      taskTests.rendersNextStepOnContinue(result)
      done()

    routerStub.goTo("/courses/#{courseId}/tasks/#{taskId}").then(tests).catch(done)

  # _.delay needed to prevent weird problems.
  it 'should render empty free response for unanswered exercise', (done)->
    taskTests
      .renderFreeResponse(taskId)
      .then(taskTests.checkRenderFreeResponse)
      .then(_.delay(done, 100)).catch(done)


  it 'should update store when free response is submitted', (done) ->
    taskTests
      .answerFreeResponse(taskId)
      .then(taskTests.checkAnswerFreeResponse)
      .then(_.delay(done, 100)).catch(done)


  it 'should render multiple choice after free response', (done) ->
    taskTests
      .submitFreeResponse(taskId)
      .then(taskTests.checkSubmitFreeResponse)
      .then(_.delay(done, 100)).catch(done)


  it 'should update store when multiple choice answer is chosen', (done) ->
    taskTests
      .answerMultipleChoice(taskId)
      .then(taskTests.checkAnswerMultipleChoice)
      .then(_.delay(done, 100)).catch(done)


  it 'should render an answer and feedback html for an answered question', (done) ->
    taskTests
      .submitMultipleChoice(taskId)
      .then(taskTests.checkSubmitMultipleChoice)
      .then(_.delay(done, 100)).catch(done)


  it 'should be able to work through a step in homework', (done) ->
    homeworkTaskId = 5
    TaskActions.loaded(homework_model, homeworkTaskId)

    # run a full step through and check each step
    taskTests
      .renderStep(homeworkTaskId)
      .then(taskTestActions.fillFreeResponse)
      .then(taskTests.checkAnswerFreeResponse)
      .then(taskTestActions.saveFreeResponse)
      .then(taskTests.checkSubmitFreeResponse)
      .then(taskTestActions.pickMultipleChoice)
      .then(taskTests.checkAnswerMultipleChoice)
      .then(taskTestActions.saveMultipleChoice)
      .then(taskTests.checkSubmitMultipleChoice)
      .then(_.delay(done, 100)).catch(done)


  it 'should be able to work through a task and load next step from a route', (done) ->
    # run a full step through and check each step
    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{taskId}", taskId)
      .then(taskTestActions.clickContinue)
      # TODO test for if the first incomplete step is rendered
      .then(taskTestActions.fillFreeResponse)
      .then(taskTests.checkAnswerFreeResponse)
      .then(taskTestActions.saveFreeResponse)
      .then(taskTests.checkSubmitFreeResponse)
      .then(taskTestActions.pickMultipleChoice)
      .then(taskTests.checkAnswerMultipleChoice)
      .then(taskTestActions.saveMultipleChoice)
      .then(taskTests.checkSubmitMultipleChoice)
      .then(taskTestActions.clickContinue)
      .then(taskTests.checkIsNextStep)
      .then(_.delay(done, 100)).catch(done)


  it 'should show appropriate done page on completion', (done) ->
    # run a full step through and check each step
    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{taskId}", taskId)
      .then(taskTestActions.clickContinue)
      .then(taskTestActions.completeSteps)
      .then(taskTests.checkIsCompletePage)
      .then(_.delay(done, 100)).catch(done)


  it 'should show homework done page on homework completion', (done) ->
    homeworkTaskId = 5
    TaskActions.loaded(homework_model, homeworkTaskId)

    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{homeworkTaskId}", homeworkTaskId)
      .then(taskTestActions.clickContinue)
      .then(taskTestActions.completeSteps)
      .then(taskTests.checkIsCompletePage)
      .then(_.delay(done, 100)).catch(done)

