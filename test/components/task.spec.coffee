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

tasksHelper = (model, taskId, courseId) ->
  TaskActions.loaded(_.clone(model), taskId)
  routerStub.goTo("/courses/#{courseId}/tasks/#{taskId}")

 
describe 'Task Widget', ->
  beforeEach ->
    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

  afterEach ->
    routerStub.unmount()
    taskTests.unmount()

  it 'should allow students to continue tasks', (done) ->
    tests = (result) ->
      taskTests.allowContinueFromIntro(result)
      done()

    tasksHelper(VALID_MODEL, taskId, courseId).then(tests).catch(done)


  it 'should render next screen when Continue is clicked', (done) ->
    tests = (result) ->
      taskTests.rendersNextStepOnContinue(result)
      done()

    tasksHelper(VALID_MODEL, taskId, courseId).then(tests).catch(done)

  # _.delay needed to prevent weird problems.
  it 'should render empty free response for unanswered exercise', (done)->
    TaskActions.loaded(_.clone(VALID_MODEL), taskId)
    taskTests
      .renderFreeResponse(taskId)
      .then(taskTests.checkRenderFreeResponse)
      .then(_.delay(done, 100)).catch(done)


  it 'should update store when free response is submitted', (done) ->
    TaskActions.loaded(_.clone(VALID_MODEL), taskId)
    taskTests
      .answerFreeResponse(taskId)
      .then(taskTests.checkAnswerFreeResponse)
      .then(_.delay(done, 100)).catch(done)


  it 'should render multiple choice after free response', (done) ->
    TaskActions.loaded(_.clone(VALID_MODEL), taskId)
    taskTests
      .submitFreeResponse(taskId)
      .then(taskTests.checkSubmitFreeResponse)
      .then(_.delay(done, 100)).catch(done)


  it 'should update store when multiple choice answer is chosen', (done) ->
    TaskActions.loaded(_.clone(VALID_MODEL), taskId)
    taskTests
      .answerMultipleChoice(taskId)
      .then(taskTests.checkAnswerMultipleChoice)
      .then(_.delay(done, 100)).catch(done)


  it 'should render an answer and feedback html for an answered question', (done) ->
    TaskActions.loaded(_.clone(VALID_MODEL), taskId)
    taskTests
      .submitMultipleChoice(taskId)
      .then(taskTests.checkSubmitMultipleChoice)
      .then(_.delay(done, 100)).catch(done)

  # # TODO write these
  # it 'should render next question on continue after answered', ->
  # it 'should render the correct end panel based on task type', ->


