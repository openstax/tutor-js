{expect, utils, Assertion} = require 'chai'

_ = require 'underscore'

{TaskingActions, TaskingStore} = require '../../src/flux/tasking'

COURSE =
  id: '1'
  periods: [
    {id: '1', name: '1st'},
    {id: '2', name: '2nd'},
    {id: '3', name: '3rd'},
    {id: '4', name: '4th'}
  ]

DEFAULT_TIMES =
  default_open_time: '07:00'
  default_due_time: '00:01'

PERIOD_DEFAULT_TIMES = _.map(COURSE.periods, -> DEFAULT_TIMES)

BASE_TASKING =
  target_type: 'period'

makeCourse = (courseDefaults = DEFAULT_TIMES, periodDefaults = PERIOD_DEFAULT_TIMES) ->
  course = _.extend({}, COURSE, courseDefaults)
  _.each course.periods, (period, index) ->
    _.extend(period, periodDefaults[index])

  course

makeTasking = (id, tasking = {}) ->
  _.extend({}, BASE_TASKING, {target_id: "#{id}"}, tasking)

makeIndexedDefaults = (courseDefaults = DEFAULT_TIMES, periodDefaults = PERIOD_DEFAULT_TIMES) ->
  indexedDefaults =
    'all': courseDefaults
    'period1': makeTasking(1, periodDefaults[0])
    'period2': makeTasking(2, periodDefaults[1])
    'period3': makeTasking(3, periodDefaults[2])
    'period4': makeTasking(4, periodDefaults[3])


makeTaskings = (numberOfTaskings, taskings) ->
  (makeTasking(id) for id in [1..numberOfTaskings])


# NEW_TASK_ID = 'hello'
# EXISTING_TASK =
#   id: 'bye'
#   tasking_plans: 



describe 'Tasking Flux', ->
  afterEach ->
    TaskingActions.reset()

  it 'should load defaults and map to object', ->

    course = makeCourse()
    indexedDefaults = makeIndexedDefaults()

    TaskingActions.loadDefaults(course.id, course)
    expect(TaskingStore.getDefaults('1')).to.deep.equal(indexedDefaults)

  it 'should set all to true for creating when defaults are same', ->

    course = makeCourse()
    TaskingActions.loadDefaults(course.id, course)

    TaskingActions.loadTaskToCourse(NEW_TASK_ID, course.id)
    TaskingActions.create(NEW_TASK_ID)


  # it 'should set all to false for creating when defaults are different', ->

