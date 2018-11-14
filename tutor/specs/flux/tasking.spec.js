import { ld } from '../helpers'
import moment from 'moment-timezone';

import { TaskingActions, TaskingStore } from '../../src/flux/tasking';

import { TimeStore, TimeActions } from '../../src/flux/time';
import TimeHelper from '../../src/helpers/time';

const TIME_NOW = moment(TimeStore.getNow());
const YESTERDAY = TIME_NOW.clone().subtract(1, 'day');
const TODAY = TIME_NOW.clone();
const TOMORROW = TIME_NOW.clone().add(1, 'day');

const DATETIMES_SERVER = {
  YESTERDAY: YESTERDAY.utc().format(),
  TODAY: TODAY.utc().format(),
  TOMORROW: TOMORROW.utc().format(),
};

const DATES = {
  YESTERDAY: YESTERDAY.format(TimeHelper.ISO_DATE_FORMAT),
  TODAY: TODAY.format(TimeHelper.ISO_DATE_FORMAT),
  TOMORROW: TOMORROW.format(TimeHelper.ISO_DATE_FORMAT),
};

const DATETIMES = {
  YESTERDAY: YESTERDAY.format(`${TimeHelper.ISO_DATE_FORMAT} ${TimeHelper.ISO_TIME_FORMAT}`),
  TODAY: TODAY.format(`${TimeHelper.ISO_DATE_FORMAT} ${TimeHelper.ISO_TIME_FORMAT}`),
  TOMORROW: TOMORROW.format(`${TimeHelper.ISO_DATE_FORMAT} ${TimeHelper.ISO_TIME_FORMAT}`),
};

const COURSE = {
  id: '1',

  periods: [
    { id: '1', name: '1st', is_archived: false },
    { id: '2', name: '2nd', is_archived: false },
    { id: '3', name: '3rd', is_archived: false },
    { id: '4', name: '4th', is_archived: false },
  ],
};

const DEFAULT_TIMES = {
  default_open_time: '07:00',
  default_due_time: '00:01',
};

const PERIOD_DEFAULT_TIMES = ld.map(COURSE.periods, () => DEFAULT_TIMES);
const PERIOD_DEFAULT_TIMES_DIFFERENT = ld.map(COURSE.periods, function(period, index) {
  const openTime = moment(DEFAULT_TIMES.default_open_time, TimeHelper.ISO_TIME_FORMAT)
    .add(index, 'hour')
    .format(TimeHelper.ISO_TIME_FORMAT);

  return {
    default_open_time: openTime,
    default_due_time: DEFAULT_TIMES.default_due_time,
  };
});


const BASE_TASKING =
  { target_type: 'period' };

const makeCourse = function(courseDefaults = DEFAULT_TIMES, periodDefaults = PERIOD_DEFAULT_TIMES) {
  const course = ld.extend({}, COURSE, courseDefaults);
  ld.each(course.periods, (period, index) => ld.extend(period, periodDefaults[index]));

  return course;
};

const makeTasking = (id, tasking = {}) => ld.extend({}, BASE_TASKING, { target_id: `${id}` }, tasking);

const makeIndexedDefaults = function(courseDefaults = DEFAULT_TIMES, periodDefaults = PERIOD_DEFAULT_TIMES) {
  let indexedDefaults;
  return indexedDefaults = {
    'all': courseDefaults,
    'period1': makeTasking(1, periodDefaults[0]),
    'period2': makeTasking(2, periodDefaults[1]),
    'period3': makeTasking(3, periodDefaults[2]),
    'period4': makeTasking(4, periodDefaults[3]),
  };
};


const makeTaskings = function(numberOfTaskings, taskings) {
  const taskingsRange = ld.range(1, numberOfTaskings + 1);

  if (!ld.isArray(taskings)) {
    taskings = ld.map(taskingsRange, () => taskings);
  }

  return ld.map(taskingsRange, (taskingId, index) => makeTasking(taskingId, taskings[index]));
};

const TASKING_DEFAULT = {
  due_at: DATETIMES_SERVER.TOMORROW,
  opens_at: DATETIMES_SERVER.YESTERDAY,
};

const NEW_TASK_ID = 'hello';
const EXISTING_TASK_ALL = {
  id: 'bye',
  tasking_plans: makeTaskings(4, TASKING_DEFAULT),
};

const ERRORS = {
  'INVALID_DATE': 'Please pick a date.',
  'INVALID_TIME': 'Please type a time.',
  'DUE_BEFORE_OPEN': 'Due time cannot be before open time.',
  'MISSING_TASKING': 'Please select at least one period',
  'DUE_AFTER_NOW': 'Due time has already passed',
};

describe('Tasking Flux', function() {
  beforeEach(() => TimeActions.setNow(new Date()));

  afterEach(() => TaskingActions.reset());

  it('should load defaults and map to object', function() {

    const course = makeCourse();
    const indexedDefaults = makeIndexedDefaults();

    TaskingActions.loadDefaults(course.id, course, course.periods);
    // expect(TaskingStore.getDefaults('1')).
    //   toEqual({})
    // to.have.all.keys(indexedDefaults);
  });

  it('should set all to true for creating when defaults are same', function() {

    const course = makeCourse();
    TaskingActions.loadDefaults(course.id, course, course.periods);

    TaskingActions.loadTaskToCourse(NEW_TASK_ID, course.id);
    TaskingActions.create(NEW_TASK_ID);

    expect(TaskingStore.getTaskingsIsAll(NEW_TASK_ID)).toBe(true);
    return undefined;
  });

  it('should set all to false for creating when defaults are different', function() {

    const course = makeCourse(DEFAULT_TIMES, PERIOD_DEFAULT_TIMES_DIFFERENT);
    TaskingActions.loadDefaults(course.id, course, course.periods);

    TaskingActions.loadTaskToCourse(NEW_TASK_ID, course.id);
    TaskingActions.create(NEW_TASK_ID);

    expect(TaskingStore.getTaskingsIsAll(NEW_TASK_ID)).toBe(false);
  });

  it('should not have dates for creating regardless of defaults', function() {

    const course = makeCourse();
    const courseDifferent = makeCourse(DEFAULT_TIMES, PERIOD_DEFAULT_TIMES_DIFFERENT);
    courseDifferent.id = '2';

    TaskingActions.loadDefaults(course.id, course, course.periods);
    TaskingActions.loadTaskToCourse(NEW_TASK_ID, course.id);
    TaskingActions.create(NEW_TASK_ID);

    TaskingActions.loadDefaults(courseDifferent.id, courseDifferent);
    TaskingActions.loadTaskToCourse('different', courseDifferent.id);
    TaskingActions.create('different');

    const newTaskings = TaskingStore.get(NEW_TASK_ID);
    const newTaskingsDifferent = TaskingStore.get('different');

    ld.each(newTaskings, function(tasking) {
      expect(TimeHelper.isDateTimeString(tasking.opens_at)).toBe(false);
      return expect(TimeHelper.isDateTimeString(tasking.due_at)).toBe(false);
    });

    ld.each(newTaskingsDifferent, function(tasking) {
      expect(TimeHelper.isDateTimeString(tasking.opens_at)).toBe(false);
      return expect(TimeHelper.isDateTimeString(tasking.due_at)).toBe(false);
    });
  });

  it('should have dates for creating with dates set regardless of defaults', function() {

    const course = makeCourse();
    const courseDifferent = makeCourse(DEFAULT_TIMES, PERIOD_DEFAULT_TIMES_DIFFERENT);
    courseDifferent.id = '2';

    TaskingActions.loadDefaults(course.id, course, course.periods);
    TaskingActions.loadTaskToCourse(NEW_TASK_ID, course.id);
    TaskingActions.create(NEW_TASK_ID, { open_date: DATES.YESTERDAY, due_date: DATES.TOMORROW });

    TaskingActions.loadDefaults(courseDifferent.id, courseDifferent);
    TaskingActions.loadTaskToCourse('different', courseDifferent.id);
    TaskingActions.create('different', { open_date: DATES.YESTERDAY, due_date: DATES.TOMORROW });

    const newTaskings = TaskingStore.get(NEW_TASK_ID);
    const newTaskingsDifferent = TaskingStore.get('different');

    ld.each(newTaskings, function(tasking) {
      expect(TimeHelper.isDateTimeString(tasking.opens_at)).toBe(true);
      return expect(TimeHelper.isDateTimeString(tasking.due_at)).toBe(true);
    });

    ld.each(newTaskingsDifferent, function(tasking) {
      expect(TimeHelper.isDateTimeString(tasking.opens_at)).toBe(true);
      return expect(TimeHelper.isDateTimeString(tasking.due_at)).toBe(true);
    });
  });

  it('should validate due at is past', function() {
    const course = makeCourse();
    const period = ld.first(course.periods);
    TaskingActions.loadDefaults(course.id, course, course.periods);
    TaskingActions.loadTaskToCourse(NEW_TASK_ID, course.id);
    TaskingActions.create(NEW_TASK_ID, { open_date: DATES.YESTERDAY, due_date: DATES.TOMORROW });

    TaskingActions.updateDate(NEW_TASK_ID, period, 'due', DATES.YESTERDAY);
    TaskingActions.updateTime(NEW_TASK_ID, period, 'due', '09:00');

    const tasking = TaskingStore._getTaskingFor(NEW_TASK_ID, period);
    const errors = TaskingStore.getTaskingErrors(NEW_TASK_ID, tasking);
    expect(ld.indexOf(errors, ERRORS.DUE_AFTER_NOW)).not.toEqual(-1);
  });

  it('should validate due time before open time', function() {
    const course = makeCourse();
    const period = ld.first(course.periods);
    TaskingActions.loadDefaults(course.id, course, course.periods);
    TaskingActions.loadTaskToCourse(NEW_TASK_ID, course.id);
    TaskingActions.create(NEW_TASK_ID, { open_date: DATES.YESTERDAY, due_date: DATES.TOMORROW });

    TaskingActions.updateDate(NEW_TASK_ID, period, 'open', DATES.TOMORROW);
    TaskingActions.updateTime(NEW_TASK_ID, period, 'open', '09:00');
    TaskingActions.updateDate(NEW_TASK_ID, period, 'due', DATES.TOMORROW);
    TaskingActions.updateTime(NEW_TASK_ID, period, 'due', '07:00');

    const tasking = TaskingStore._getTaskingFor(NEW_TASK_ID, period);
    const errors = TaskingStore.getTaskingErrors(NEW_TASK_ID, tasking);
    expect(ld.indexOf(errors, ERRORS.DUE_BEFORE_OPEN)).not.toEqual(-1);
  });
});
