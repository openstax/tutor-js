{expect} = require 'chai'
_ = require 'underscore'

{taskActions, taskTests, taskChecks} = require './helpers/task'
{routerStub} = require './helpers/utilities'

{CourseActions, CourseStore} = require '../../src/flux/course'
{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

{SinglePractice, Tasks} = require '../../src/components'

VALID_MODEL = require '../../api/courses/1/practice.json'

courseId = '1'

describe 'Practice Widget', ->
  beforeEach (done) ->
    CourseActions.loadedPractice(VALID_MODEL, courseId)
    taskId = CourseStore.getPracticeId(courseId)

    taskTests
      .renderStep(taskId)
      .then((result) =>
        @result = result
        done()
      , done)

  afterEach ->
    taskTests.unmount()

    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

  it 'should render empty free response for unanswered exercise', (done) ->
    taskChecks
      .checkRenderFreeResponse(@result)
      .then( ->
        done()
      , done)

  it 'should update store when free response is submitted', (done) ->
    taskTests
      .answerFreeResponse(@result)
      .then(taskActions.clickContinue)
      .then(taskChecks.checkAnswerFreeResponse)
      .then( ->
        done()
      , done)

  it 'should render multiple choice after free response', (done) ->
    taskTests
      .submitFreeResponse(@result)
      .then(taskChecks.checkSubmitFreeResponse)
      .then( ->
        done()
      , done)

  it 'should update store when multiple choice answer is chosen', (done) ->
    taskTests
      .answerMultipleChoice(@result)
      .then(taskChecks.checkAnswerMultipleChoice)
      .then( ->
        done()
      , done)

  it 'should render an answer and feedback html for an answered question', (done) ->
    taskTests
      .submitMultipleChoice(@result)
      .then(taskChecks.checkSubmitMultipleChoice)
      .then( ->
        done()
      , done)

describe 'Practice Widget, through route', ->

  beforeEach (done) ->
    CourseActions.loadedPractice(VALID_MODEL, courseId)
    taskId = CourseStore.getPracticeId(courseId)

    taskTests
      .goToTask("/courses/#{courseId}/practice", taskId)
      .then((result) =>
        @result = result
        done()
      , done)

  afterEach ->
    taskTests.unmount()

    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()


  it 'should load expected practice at the practice url', ->
    tests = ({div}) ->
      expect(div.querySelector('h1')).to.not.be.null
      expect(div.querySelector('h1').innerText).to.equal(VALID_MODEL.title)

    tests(@result)


  it 'should allow students to continue exercises', (done) ->
    taskChecks
      .checkIsIntroScreen(@result)
      .then(taskChecks.checkAllowContinue)
      .then( ->
        done()
      , done)


  it 'should render next screen when Continue is clicked', (done) ->
    taskActions
      .clickContinue(@result)
      .then(taskChecks.checkIsNotIntroScreen)
      .then( ->
        done()
      , done)


  it 'should show practice done page on practice completion', (done) ->
    taskActions
      .clickContinue(@result)
      .then(taskActions.completeSteps)
      .then(taskChecks.checkIsCompletePage)
      .then( ->
        done()
      , done)
