{expect} = require 'chai'
_ = require 'underscore'

{routerStub, taskTestActions, taskTests} = require './helpers/task'

{CourseActions, CourseStore} = require '../../src/flux/course'
{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

{SinglePractice, Tasks} = require '../../src/components'

VALID_MODEL = require '../../api/tasks/4.json'


tasksHelper = (model, taskId, courseId) ->

  TaskActions.loaded(model, taskId)
  routerStub.goTo("/courses/#{courseId}/tasks/#{taskId}")

 
describe 'Task Widget', ->
  beforeEach ->
    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

  afterEach ->
    routerStub.unmount()

  it 'should allow students to continue tasks', (done) ->
    tests = (result) ->
      taskTests.allowContinueFromIntro(result)
      done()

    tasksHelper(VALID_MODEL, 4, 1).then(tests).catch(done)


  it 'should render next screen when Continue is clicked', (done) ->
    tests = (result) ->
      taskTests.rendersNextStepOnContinue(result)
      done()

    tasksHelper(VALID_MODEL, 4, 1).then(tests).catch(done)

  it 'should render multiple choice after free response', (done) ->

    courseId = 1
    taskId = 4

    tests = (result) ->
      steps = TaskStore.getSteps(taskId)
      taskTests.renderMultipleChoiceAfterFreeResponse(result, steps).then(done)

    tasksHelper(VALID_MODEL, taskId, courseId).then(tests).catch(done)
