{expect} = require 'chai'
_ = require 'underscore'

{taskActions, taskTests, taskChecks} = require './helpers/task'
{routerStub} = require './helpers/utilities'

{CourseActions, CourseStore} = require '../../src/flux/course'
{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

{SinglePractice, Tasks} = require '../../src/components'

VALID_MODEL = require '../../api/courses/1/practice.json'

courseId = 1

describe 'Practice Widget', ->
  afterEach ->
    routerStub.unmount()
    taskTests.unmount()

    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

  beforeEach ->
    CourseActions.loadedPractice(VALID_MODEL, courseId)

  # it 'should load the practice button on the course tasks page', (done) ->
  #   tests = ({div}) ->
  #     expect(div.querySelector('.-practice')).to.not.be.null
  #     done()

  #   routerStub.goTo("/courses/#{courseId}/tasks").then(tests).catch(done)


  it 'should load expected practice at the practice url', (done) ->
    tests = ({div}) ->
      expect(div.querySelector('h1')).to.not.be.null
      expect(div.querySelector('h1').innerText).to.equal(VALID_MODEL.title)
      done()

    routerStub.goTo("/courses/#{courseId}/practice").then(tests).catch(done)


  it 'should allow students to continue exercises', (done) ->
    taskId = CourseStore.getPracticeId(courseId)
    taskTests
      .goToTask("/courses/#{courseId}/practice", taskId)
      .then(taskChecks.checkIsIntroScreen)
      .then(taskChecks.checkAllowContinue)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should render next screen when Continue is clicked', (done) ->
    taskId = CourseStore.getPracticeId(courseId)
    taskTests
      .goToTask("/courses/#{courseId}/practice", taskId)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkIsNotIntroScreen)
      .then(taskChecks.heckIsDefaultStep)
      .then(_.delay(done, taskTests.delay)).catch(done)

  it 'should render empty free response for unanswered exercise', (done) ->
    taskId = CourseStore.getPracticeId(courseId)
    taskTests
      .renderFreeResponse(taskId)
      .then(taskChecks.checkRenderFreeResponse)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should update store when free response is submitted', (done) ->
    taskId = CourseStore.getPracticeId(courseId)
    taskTests
      .answerFreeResponse(taskId)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkAnswerFreeResponse)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should render multiple choice after free response', (done) ->
    taskId = CourseStore.getPracticeId(courseId)
    taskTests
      .submitFreeResponse(taskId)
      .then(taskChecks.checkSubmitFreeResponse)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should update store when multiple choice answer is chosen', (done) ->
    taskId = CourseStore.getPracticeId(courseId)
    taskTests
      .answerMultipleChoice(taskId)
      .then(taskChecks.checkAnswerMultipleChoice)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should render an answer and feedback html for an answered question', (done) ->
    taskId = CourseStore.getPracticeId(courseId)
    taskTests
      .submitMultipleChoice(taskId)
      .then(taskChecks.checkSubmitMultipleChoice)
      .then(_.delay(done, taskTests.delay)).catch(done)


  it 'should show practice done page on practice completion', (done) ->
    taskId = CourseStore.getPracticeId(courseId)

    taskTests
      .goToTask("/courses/#{courseId}/tasks/#{taskId}", taskId)
      .then(taskActions.clickContinue)
      .then(taskActions.completeSteps)
      .then(taskChecks.checkIsCompletePage)
      .then(_.delay(done, taskTests.delay)).catch(done)
