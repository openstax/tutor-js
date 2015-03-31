{expect} = require 'chai'
_ = require 'underscore'

{routerStub, taskTestActions, taskTests} = require './helpers/task'

{CourseActions, CourseStore} = require '../../src/flux/course'
{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

{SinglePractice, Tasks} = require '../../src/components'

VALID_MODEL = require '../../api/courses/1/practice.json'


tasksHelper = (courseId) ->
  routerStub.goTo("/courses/#{courseId}/tasks")

courseHelper = (model, courseId) ->
  # Load practice in CourseStore
  CourseActions.loaded(model, courseId)
  routerStub.goTo("/courses/#{courseId}/practice")

 
describe 'Practice Widget', ->
  beforeEach ->
    CourseActions.reset()
    TaskActions.reset()
    TaskStepActions.reset()

  afterEach ->
    routerStub.unmount()

  it 'should load the practice button on the course tasks page', (done) ->
    tests = ({div}) ->
      expect(div.querySelector('.-practice')).to.not.be.null
      done()

    tasksHelper(1).then(tests).catch(done)


  it 'should load expected practice at the practice url', (done) ->
    tests = ({div}) ->
      expect(div.querySelector('h1')).to.not.be.null
      expect(div.querySelector('h1').innerText).to.equal(VALID_MODEL.title)
      done()

    courseHelper(VALID_MODEL, 1).then(tests).catch(done)


  it 'should allow students to continue exercises', (done) ->
    tests = (result) ->
      taskTests.allowContinueFromIntro(result)
      done()

    courseHelper(VALID_MODEL, 1).then(tests).catch(done)


  it 'should render next screen when Continue is clicked', (done) ->
    tests = (result) ->
      taskTests.rendersNextStepOnContinue(result)
      done()

    courseHelper(VALID_MODEL, 1).then(tests).catch(done)


  it 'should render multiple choice after free response', (done) ->

    courseId = 1

    tests = (result) ->
      steps = TaskStore.getSteps(CourseStore.getPracticeId(courseId))
      taskTests.renderMultipleChoiceAfterFreeResponse(result, steps).then(done)

    courseHelper(VALID_MODEL, courseId).then(tests).catch(done)

