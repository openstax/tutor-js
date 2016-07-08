{expect, utils, Assertion} = require 'chai'

_ = require 'underscore'
moment = require 'moment-timezone'

{TaskingActions, TaskingStore} = require '../../src/flux/tasking'

{TimeStore} = require '../../src/flux/time'
TimeHelper = require '../../src/helpers/time'

TIME_NOW = moment(TimeStore.getNow())
YESTERDAY = TIME_NOW.clone().subtract(1, 'day')
TODAY = TIME_NOW.clone()
TOMORROW = TIME_NOW.clone().add(1, 'day')

DATETIMES_SERVER =
  YESTERDAY: YESTERDAY.utc().format()
  TODAY: TODAY.utc().format()
  TOMORROW: TOMORROW.utc().format()

DATES =
  YESTERDAY: YESTERDAY.format(TimeHelper.ISO_DATE_FORMAT)
  TODAY: TODAY.format(TimeHelper.ISO_DATE_FORMAT)
  TOMORROW: TOMORROW.format(TimeHelper.ISO_DATE_FORMAT)

DATETIMES =
  YESTERDAY: YESTERDAY.format("#{TimeHelper.ISO_DATE_FORMAT} #{TimeHelper.ISO_TIME_FORMAT}")
  TODAY: TODAY.format("#{TimeHelper.ISO_DATE_FORMAT} #{TimeHelper.ISO_TIME_FORMAT}")
  TOMORROW: TOMORROW.format("#{TimeHelper.ISO_DATE_FORMAT} #{TimeHelper.ISO_TIME_FORMAT}")

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
PERIOD_DEFAULT_TIMES_DIFFERENT = _.map COURSE.periods, (period, index) ->
  openTime = moment(DEFAULT_TIMES.default_open_time, TimeHelper.ISO_TIME_FORMAT)
    .add(index, 'hour')
    .format(TimeHelper.ISO_TIME_FORMAT)

  default_open_time: openTime
  default_due_time: DEFAULT_TIMES.default_due_time


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
  taskingsRange = _.range(1, numberOfTaskings + 1)

  unless _.isArray(taskings)
    taskings = _.map(taskingsRange, -> taskings)

  _.map taskingsRange, (taskingId, index) ->
    makeTasking(taskingId, taskings[index])

TASKING_DEFAULT =
  due_at: DATETIMES_SERVER.TOMORROW
  opens_at: DATETIMES_SERVER.YESTERDAY

NEW_TASK_ID = 'hello'
EXISTING_TASK_ALL =
  id: 'bye'
  tasking_plans: makeTaskings(4, TASKING_DEFAULT)
# EXISTING_TASK_DIFFERENT
# EXISTING_TASK_DISABLE_ONE
# EXISTING_TASK_DISABLE_ALL_BUT_ONE

matchTasking = (taskingToMatch) ->
  tasking = @_obj
  _.every tasking, (value, key) ->
    value is taskingToMatch[key]

Assertion.addMethod('matchTasking', matchTasking)


describe 'Tasking Flux', ->
  afterEach ->
    TaskingActions.reset()

  it 'should load defaults and map to object', ->

    course = makeCourse()
    indexedDefaults = makeIndexedDefaults()

    TaskingActions.loadDefaults(course.id, course)

    _.each TaskingStore.getDefaults('1'), (tasking, taskingKey) ->
      expect(tasking).to.matchTasking(indexedDefaults[taskingKey])

    expect(TaskingStore.getDefaults('1')).to.have.all.keys(indexedDefaults)

  it 'should set all to true for creating when defaults are same', ->

    course = makeCourse()
    TaskingActions.loadDefaults(course.id, course)

    TaskingActions.loadTaskToCourse(NEW_TASK_ID, course.id)
    TaskingActions.create(NEW_TASK_ID)

    expect(TaskingStore.getTaskingsIsAll(NEW_TASK_ID)).to.be.true

  it 'should set all to false for creating when defaults are different', ->

    course = makeCourse(DEFAULT_TIMES, PERIOD_DEFAULT_TIMES_DIFFERENT)
    TaskingActions.loadDefaults(course.id, course)

    TaskingActions.loadTaskToCourse(NEW_TASK_ID, course.id)
    TaskingActions.create(NEW_TASK_ID)

    expect(TaskingStore.getTaskingsIsAll(NEW_TASK_ID)).to.be.false

  it 'should not have dates for creating regardless of defaults', ->

    course = makeCourse()
    courseDifferent = makeCourse(DEFAULT_TIMES, PERIOD_DEFAULT_TIMES_DIFFERENT)
    courseDifferent.id = '2'

    TaskingActions.loadDefaults(course.id, course)
    TaskingActions.loadTaskToCourse(NEW_TASK_ID, course.id)
    TaskingActions.create(NEW_TASK_ID)

    TaskingActions.loadDefaults(courseDifferent.id, courseDifferent)
    TaskingActions.loadTaskToCourse('different', courseDifferent.id)
    TaskingActions.create('different')

    newTaskings = TaskingStore.get(NEW_TASK_ID)
    newTaskingsDifferent = TaskingStore.get('different')

    _.each newTaskings, (tasking) ->
      expect(TimeHelper.isDateTimeString(tasking.opens_at)).to.be.false
      expect(TimeHelper.isDateTimeString(tasking.due_at)).to.be.false

    _.each newTaskingsDifferent, (tasking) ->
      expect(TimeHelper.isDateTimeString(tasking.opens_at)).to.be.false
      expect(TimeHelper.isDateTimeString(tasking.due_at)).to.be.false

  it 'should have dates for creating with dates set regardless of defaults', ->

    course = makeCourse()
    courseDifferent = makeCourse(DEFAULT_TIMES, PERIOD_DEFAULT_TIMES_DIFFERENT)
    courseDifferent.id = '2'

    TaskingActions.loadDefaults(course.id, course)
    TaskingActions.loadTaskToCourse(NEW_TASK_ID, course.id)
    TaskingActions.create(NEW_TASK_ID, {open_date: DATES.YESTERDAY, due_date: DATES.TOMORROW})

    TaskingActions.loadDefaults(courseDifferent.id, courseDifferent)
    TaskingActions.loadTaskToCourse('different', courseDifferent.id)
    TaskingActions.create('different', {open_date: DATES.YESTERDAY, due_date: DATES.TOMORROW})

    newTaskings = TaskingStore.get(NEW_TASK_ID)
    newTaskingsDifferent = TaskingStore.get('different')

    _.each newTaskings, (tasking) ->
      expect(TimeHelper.isDateTimeString(tasking.opens_at)).to.be.true
      expect(TimeHelper.isDateTimeString(tasking.due_at)).to.be.true

    _.each newTaskingsDifferent, (tasking) ->
      expect(TimeHelper.isDateTimeString(tasking.opens_at)).to.be.true
      expect(TimeHelper.isDateTimeString(tasking.due_at)).to.be.true


