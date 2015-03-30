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

# TODO valid model currently has a partially answered question so this test fails.
# Do something about that for this test.

  # it 'should render multiple choice after free response', (done) ->

  #   courseId = 1
  #   taskId = 4

  #   tests = (result) ->
  #     steps = TaskStore.getSteps(taskId)

  #     # TODO
  #     # not ideal.  wanted to find the step id off of the component's children
  #     # but that is a pain in the butt right now.
  #     stepId = steps[0].id

  #     taskTests.renderMultipleChoiceAfterFreeResponse(result, stepId).then(done)

  #   tasksHelper(VALID_MODEL, taskId, courseId).then(tests).catch(done)
