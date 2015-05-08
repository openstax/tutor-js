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
    TaskActions.HACK_DO_NOT_RELOAD(true)
    TaskStepActions.HACK_DO_NOT_RELOAD(true)
    CourseActions.HACK_DO_NOT_RELOAD(true)

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

    TaskActions.HACK_DO_NOT_RELOAD(false)
    TaskStepActions.HACK_DO_NOT_RELOAD(false)
    CourseActions.HACK_DO_NOT_RELOAD(false)

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
    TaskActions.HACK_DO_NOT_RELOAD(true)
    TaskStepActions.HACK_DO_NOT_RELOAD(true)
    CourseActions.HACK_DO_NOT_RELOAD(true)

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

    TaskActions.HACK_DO_NOT_RELOAD(false)
    TaskStepActions.HACK_DO_NOT_RELOAD(false)
    CourseActions.HACK_DO_NOT_RELOAD(false)

  it 'should load expected practice at the practice url', ->
    tests = ({div}) ->
      expect(div.querySelector('.task-practice')).to.not.be.null
      expect(div.querySelector('.task-practice .stimulus').innerText).to.equal(VALID_MODEL.steps[0].content.stimulus_html)

    tests(@result)

  it 'should not render intro screen', (done) ->
    taskChecks.checkIsNotIntroScreen(@result)
      .then( ->
        done()
      , done)


  it 'should show practice done page on practice completion', (done) ->
    taskActions
      .completeSteps(@result)
      .then(taskChecks.checkIsCompletePage)
      .then( ->
        done()
      , done)

  it 'should show all breadcrumbs for practice', (done) ->
    taskChecks
      .checkHasAllBreadcrumbs(@result)
      .then( ->
        done()
      , done)
