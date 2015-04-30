{expect} = require 'chai'
_ = require 'underscore'
{routerStub, commonActions} = require '../helpers/utilities'

VALID_MODEL = require '../../../api/plans/2.json'
READINGS = require '../../../api/courses/1/readings.json'
EXERCISES = require '../../../api/courses/1/exercises.json'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{ExerciseActions, ExerciseStore} = require '../../../src/flux/exercise'
{TocActions, TocStore} = require '../../../src/flux/toc'
{HomeworkPlan} = require '../../../src/components/task-plan/homework'

courseId = 1

window.confirm = ->
  return true
window.alert = ->
  return {}

describe 'Homework Builder', ->
  beforeEach ->
    #load homeworks and load exercises
    TaskPlanActions.loaded(VALID_MODEL, VALID_MODEL.id)
    ExerciseActions.loaded(EXERCISES, courseId, VALID_MODEL.settings.page_ids)
    TocActions.loaded(READINGS)

  afterEach ->
    routerStub.unmount()
    TaskPlanActions.reset()
    ExerciseActions.reset()

  it 'should load expected homework at the homework url', (done) ->
    #loads homework title, and has correct number of exercises
    tests = ({div}) ->
      expect(div.querySelector('#homework-title').value).to.equal(VALID_MODEL.title)
      expect(div.querySelector('#homework-due-date')).to.be.not.null
      expect(div.querySelector('.-select-problems')).to.be.not.null
      expect(div.querySelectorAll('.card.exercise').length).to.equal(VALID_MODEL.settings.exercise_ids.length)
      done()

    routerStub.goTo("/courses/#{courseId}/t/homeworks/#{VALID_MODEL.id}")
      .then(tests)
      .catch(done)

  it 'should not allow editable due date or add problems button if homework is published', (done) ->
    PUBLISHED_MODEL = _.mapObject(VALID_MODEL)
    PUBLISHED_MODEL = _.extend(PUBLISHED_MODEL , {published_at: new Date()})

    TaskPlanActions.loaded(PUBLISHED_MODEL, PUBLISHED_MODEL.id)
    #set homework to not published
    #check if due date input exists
    tests = ({div}) ->
      expect(div.querySelector('#homework-due-date')).to.be.null
      expect(div.querySelector('.-select-problems')).to.be.null
      done()

    routerStub.goTo("/courses/#{courseId}/t/homeworks/#{PUBLISHED_MODEL.id}")
      .then(tests)
      .catch(done)


  it 'should allow for add exercises if homework is not published', (done) ->
    ExerciseActions.loaded(EXERCISES, courseId, READINGS[0].children[0].id)

    NO_EXERCISES_MODEL = _.mapObject(VALID_MODEL)
    NO_EXERCISES_MODEL = _.extend(NO_EXERCISES_MODEL, {settings: {}})

    TaskPlanActions.loaded(NO_EXERCISES_MODEL, NO_EXERCISES_MODEL.id)

    checkAddButtonExists = (obj) ->
      div = obj.div
      expect(div.querySelector('.-select-problems')).to.not.be.null
      done()

    routerStub.goTo("/courses/#{courseId}/t/homeworks/#{VALID_MODEL.id}")
      .then(checkAddButtonExists)
