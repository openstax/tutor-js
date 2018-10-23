import _ from 'underscore';
import moment from 'moment-timezone';

import { makeSimpleStore, extendConfig } from './helpers';
import TimeHelper from '../helpers/time';
import { TimeStore } from './time';

const TASKING_IDENTIFIERS = ['target_type', 'target_id'];
const TASKING_TIMES = ['open_time', 'due_time'];
const TASKING_DATES = ['open_date', 'due_date'];
const TASKING_DATETIMES = TASKING_TIMES.concat(TASKING_DATES);
const TASKING_UPDATABLES = TASKING_DATETIMES.concat(['disabled']);
const TASKING_WORKING_PROPERTIES = TASKING_IDENTIFIERS.concat(TASKING_DATETIMES).concat(['disabled']);

const TASKING_MASKS = {
  open: 'opens_at',
  due: 'due_at',
};

const TASKING_MASKED = _.values(TASKING_MASKS);

const getFromForTasking = (fromCollection, tasking) => fromCollection[toTaskingIndex(tasking)];

const transformDefaultPeriod = period => ({
  target_id: period.id,
  target_type: 'period',
  open_time: period.default_open_time,
  due_time: period.default_due_time,
})
;

const transformCourseToDefaults = function(course, periods) {
  const courseDefaults = _.chain(periods)
    .indexBy(period => `period${period.id}`)
    .mapObject(transformDefaultPeriod)
    .value();

  courseDefaults.all = {
    open_time: course.default_open_time,
    due_time: course.default_due_time,
  };

  return courseDefaults;
};

const transformTasking = function(tasking) {
  const transformed = _.pick(tasking, TASKING_IDENTIFIERS);

  const due_at = TimeHelper.makeMoment(tasking.due_at).format(`${TimeHelper.ISO_DATE_FORMAT} ${TimeHelper.ISO_TIME_FORMAT}`);
  const opens_at = TimeHelper.makeMoment(tasking.opens_at).format(`${TimeHelper.ISO_DATE_FORMAT} ${TimeHelper.ISO_TIME_FORMAT}`);

  transformed.open_time = TimeHelper.getTimeOnly(opens_at);
  transformed.due_time = TimeHelper.getTimeOnly(due_at);

  transformed.open_date = TimeHelper.getDateOnly(opens_at);
  transformed.due_date = TimeHelper.getDateOnly(due_at);

  return transformed;
};

const transformTaskings = taskings =>
  _.chain(taskings)
    .indexBy(toTaskingIndex)
    .mapObject(transformTasking)
    .value()
;

const maskToTasking = function(tasking) {
  const masked = _.pick(tasking, TASKING_IDENTIFIERS);

  if (TimeHelper.isDateTimeString(`${tasking.open_date} ${tasking.open_time}`)) {
    masked.opens_at = `${tasking.open_date} ${tasking.open_time}`;
  }

  if (TimeHelper.isDateTimeString(`${tasking.due_date} ${tasking.due_time}`)) {
    masked.due_at = `${tasking.due_date} ${tasking.due_time}`;
  }

  return masked;
};

var toTaskingIndex = function(tasking) {
  if ((tasking != null) && !_.isEmpty(tasking)) {
    if ((tasking.id != null) && (tasking.name != null)) {
      return `period${tasking.id}`;
    } else {
      return `${tasking.target_type}${tasking.target_id}`;
    }
  } else {
    return 'all';
  }
};

const isTaskingValidTime = tasking => TimeHelper.hasTimeString(tasking.opens_at) && TimeHelper.hasTimeString(tasking.due_at);

const isTaskingValidDate = tasking => TimeHelper.hasDateString(tasking.opens_at) && TimeHelper.hasDateString(tasking.due_at);

const isProperRange = tasking => moment(tasking.due_at).isAfter(tasking.opens_at);

const isDueAfterNow = tasking => moment(tasking.due_at).isAfter(TimeStore.getNow());

const hasAtLeastOneTasking = taskings =>
  !_.chain(taskings)
    .compact()
    .isEmpty()
    .value()
;

const ERRORS = {
  'INVALID_DATE': 'Please pick a date.',
  'INVALID_TIME': 'Please type a time.',
  'DUE_BEFORE_OPEN': 'Due time cannot be before open time.',
  'MISSING_TASKING': 'Please select at least one period',
  'DUE_AFTER_NOW': 'Due time has already passed',
};

const TASKING_VALIDITY_CHECKS = [{
  check: isTaskingValidTime,
  errorType: 'INVALID_TIME',
}, {
  check: isTaskingValidDate,
  errorType: 'INVALID_DATE',
}, {
  check: isProperRange,
  errorType: 'DUE_BEFORE_OPEN',
}, {
  check: isDueAfterNow,
  errorType: 'DUE_AFTER_NOW',
}];

const TASK_VALIDITY_CHECKS = [{
  check: hasAtLeastOneTasking,
  errorType: 'MISSING_TASKING',
}];

const getErrorsFor = function(thingToCheck, { check, errorType }) {
  if (!check(thingToCheck)) { return ERRORS[errorType]; }
};

const getTaskingErrors = function(tasking) {
  let errors;
  return errors = _.chain(TASKING_VALIDITY_CHECKS)
    .map(_.partial(getErrorsFor, tasking))
    .compact()
    .value();
};

const getTaskErrors = function(taskings) {
  let errors;
  return errors = _.chain(TASK_VALIDITY_CHECKS)
    .map(_.partial(getErrorsFor, taskings))
    .compact()
    .value();
};

const isTaskingValid = tasking => _.isEmpty(getTaskingErrors(tasking));

const isTaskValid = taskings => _.isEmpty(getTaskErrors(taskings));

const isTaskingOpened = tasking => moment(tasking.opens_at).isBefore(TimeStore.getNow());

const getCommonTasking = function(taskings, commonBy = TASKING_MASKED) {
  const firstTasking = _.chain(taskings)
    .values()
    .first()
    .pick(commonBy)
    .value();

  const hasCommon = _.every(taskings, tasking => _.isEqual(firstTasking, _.pick(tasking, commonBy)));

  if (hasCommon) { return firstTasking; }
};

const getCommonDates = function(taskings) {
  const commonOpenDate = getCommonTasking(taskings, 'open_date');
  const commonDueDate = getCommonTasking(taskings, 'due_date');

  return _.extend(commonOpenDate, commonDueDate);
};

const hasTaskings = (taskings, compareTaskings) =>
  _.every(taskings, function(tasking) {
    const taskingIndex = toTaskingIndex(tasking);
    return (compareTaskings[taskingIndex] != null);
  })
;

// sample _defaults
// "#{courseId}": {
//   "all": {
//     "open_time": "00:01"
//     "due_time": "22:00"
//   },
//   "#{target_type}#{target_id}": {
//     "open_time": "00:01"
//     "due_time": "11:00"
//   },
//   "#{target_type}#{target_id}": {
//     "open_time": "00:01"
//     "due_time": "11:00"
//   }
// }

// sample _taskings
// "#{courseId}": {
//   "all": {
//     "open_time": "00:01"
//     "due_time": "22:00"
//     "open_date": "2016-06-25"
//     "due_date": "2016-08-25"
//   },
//   "#{target_type}#{target_id}": {
//     "open_time": "00:01"
//     "due_time": "11:00"
//     "open_date": "2016-06-25"
//     "due_date": "2016-08-25"
//     "target_type": "#{target_type}"
//     "target_id": "#{target_id}"
//     disabled: true
//   },
//   "#{target_type}#{target_id}": {
//     "open_time": "00:01"
//     "due_time": "11:00"
//     "open_date": "2016-06-25"
//     "due_date": "2016-08-25"
//     "target_type": "#{target_type}"
//     "target_id": "#{target_id}"
//     "disabled": false
//   }
// }

const TaskingConfig = {
  _defaults: {},
  _taskings: {},
  _tasksToCourse: {},
  _taskingsIsAll: {},
  _originalTaskings: {},

  reset() {
    this._defaults = {};
    this._taskings = {};
    this._tasksToCourse = {};
    this._taskingsIsAll = {};
    return this._originalTaskings = {};
  },

  resetFor(taskId) {
    if (!_.isEmpty(this._originalTaskings[taskId])) { return this.loadTaskings(taskId, this._originalTaskings[taskId]); }
  },

  loadDefaults(courseId, course, periods) {
    this._defaults[courseId] = transformCourseToDefaults(course, periods);
    this.emit(`defaults.${courseId}.loaded`);
    return true;
  },

  loadTaskToCourse(taskId, courseId) {
    return this._tasksToCourse[taskId] = courseId;
  },

  updateTime(taskId, tasking, type, timeString) {
    const taskingIndex = toTaskingIndex(tasking);
    timeString = TimeHelper.getTimeOnly(timeString);
    if (timeString == null) { return false; }

    if (this._taskings[taskId][taskingIndex] == null) { this._taskings[taskId][taskingIndex] = {}; }
    this._taskings[taskId][taskingIndex][`${type}_time`] = timeString;
    this.emit(`taskings.${taskId}.${taskingIndex}.changed`);
    return true;
  },

  updateDate(taskId, tasking, type, dateString) {
    const taskingIndex = toTaskingIndex(tasking);
    dateString = TimeHelper.getDateOnly(dateString);
    if (dateString == null) { return false; }

    if (this._taskings[taskId][taskingIndex] == null) { this._taskings[taskId][taskingIndex] = {}; }
    this._taskings[taskId][taskingIndex][`${type}_date`] = dateString;
    this.emit(`taskings.${taskId}.${taskingIndex}.changed`);
    return true;
  },

  updateAllTaskings(taskId, taskingUpdate) {
    taskingUpdate = _.pick(taskingUpdate, TASKING_UPDATABLES);
    return _.each(this._taskings[taskId], _.partial(_.extend(_, taskingUpdate)));
  },

  resetTasking(taskId, tasking, setTasking) {
    const courseId = this.exports.getCourseIdForTask.call(this, taskId);
    const defaults = this.exports.getDefaultsFor.call(this, courseId, tasking);
    const taskingIndex = toTaskingIndex(tasking);

    const currentTasking = _.pick(tasking, TASKING_IDENTIFIERS);
    const updatedTasking = _.extend({ disabled: false }, currentTasking, defaults, setTasking);

    this._taskings[taskId][taskingIndex] = _.pick(updatedTasking, TASKING_WORKING_PROPERTIES);
    this.emit(`taskings.${taskId}.${taskingIndex}.reset`);
    return true;
  },

  updateTaskingsIsAll(taskId, isAll) {
    this._taskingsIsAll[taskId] = isAll;
    this.emit(`taskings.${taskId}.isAll.changed`);
    return true;
  },

  setOriginalTaskings(taskId, taskings) {
    return this._originalTaskings[taskId] = taskings;
  },

  loadTaskings(taskId, taskings) {

    let commonTasking;
    const blankTaskings = this.exports._getBlankTaskings.call(this, taskId);
    let isAll = false;

    const taskingsToLoad = transformTaskings(taskings);
    const hasAllTaskings = hasTaskings(blankTaskings, taskingsToLoad);

    if (hasAllTaskings) {
      commonTasking = getCommonTasking(taskings);
      isAll = (commonTasking != null);
    }

    this.updateTaskingsIsAll(taskId, isAll);

    const baseTaskingToLoad = getCommonDates(taskingsToLoad);
    const disabledBaseTasking = _.extend({ disabled: true }, baseTaskingToLoad);

    this._taskings[taskId] = {};
    let taskingToLoad = isAll ? transformTasking(commonTasking) : baseTaskingToLoad;
    this.resetTasking(taskId, {}, taskingToLoad);

    _.each(blankTaskings, tasking => {
      taskingToLoad = getFromForTasking(taskingsToLoad, tasking);

      if (taskingToLoad && isAll) {
        // explicitly default to period times
        taskingToLoad = _.omit(taskingToLoad, TASKING_TIMES);
      }

      return this.resetTasking(taskId, tasking, taskingToLoad || disabledBaseTasking);
    });

    this.setOriginalTaskings(taskId, this.exports.get.call(this, taskId));
    this.emit(`taskings.${taskId}.all.loaded`);
    return true;
  },

  create(taskId, dates = { open_date: '', due_date: '' }) {

    const courseId = this.exports.getCourseIdForTask.call(this, taskId);
    const blankTaskings = this.exports._getBlankTaskings.call(this, taskId);

    const isAll = this.exports.areDefaultTaskingTimesSame.call(this, courseId);
    this.updateTaskingsIsAll(taskId, isAll);

    this._taskings[taskId] = {};
    this.resetTasking(taskId, {}, dates);

    _.each(blankTaskings, tasking => {
      return this.resetTasking(taskId, tasking, dates);
    });

    this.setOriginalTaskings(taskId, []);
    this.emit(`taskings.${taskId}.all.changed`);
    return true;
  },

  enableTasking(taskId, tasking) {
    const taskingIndex = toTaskingIndex(tasking);
    this._taskings[taskId][taskingIndex].disabled = false;
    this.emit(`taskings.${taskId}.${taskingIndex}.changed`);
    return true;
  },

  disableTasking(taskId, tasking) {
    const taskingIndex = toTaskingIndex(tasking);
    this._taskings[taskId][taskingIndex].disabled = true;
    this.emit(`taskings.${taskId}.${taskingIndex}.changed`);
    return true;
  },

  exports: {
    getTaskingIndex(tasking) {
      return toTaskingIndex(tasking);
    },

    getDefaults(courseId) {
      return this._defaults[courseId];
    },

    _getTaskings(taskId) {
      return this._taskings[taskId];
    },

    _getBlankTaskings(taskId) {
      let blankTaskings;
      const courseId = this.exports.getCourseIdForTask.call(this, taskId);
      const defaults = this.exports.getDefaults.call(this, courseId);
      return blankTaskings = _.chain(defaults)
        .omit(toTaskingIndex())
        .map(tasking => _.pick(tasking, TASKING_IDENTIFIERS)).value();
    },

    getCourseIdForTask(taskId) {
      return this._tasksToCourse[taskId];
    },

    getTaskingsIsAll(taskId) {
      return this._taskingsIsAll[taskId];
    },

    getTaskingDefaults(courseId) {
      const defaults = this.exports.getDefaults.call(this, courseId);
      return _.omit(defaults, toTaskingIndex());
    },

    getDefaultsFor(courseId, tasking) {
      const defaults = this.exports.getDefaults.call(this, courseId);
      const taskingDefault = getFromForTasking(defaults, tasking);
      return _.pick(taskingDefault, TASKING_TIMES);
    },

    getDefaultsForTasking(taskId, tasking) {
      let defaults;
      const courseId = this.exports.getCourseIdForTask.call(this, taskId);
      return defaults = this.exports.getDefaultsFor.call(this, courseId, tasking);
    },

    areDefaultTaskingTimesSame(courseId) {
      const defaults = this.exports.getTaskingDefaults.call(this, courseId);
      const taskingDefaults = _.omit(defaults, toTaskingIndex());

      return (getCommonTasking(taskingDefaults, TASKING_TIMES) != null);
    },

    getTaskings(taskId) {
      let taskings;
      const storedTaskings = this.exports._getTaskings.call(this, taskId);

      return taskings = _.map(storedTaskings, maskToTasking);
    },

    getOriginalTaskings(taskId) {
      return this._originalTaskings[taskId];
    },

    _getTaskingFor(taskId, tasking) {
      const storedTaskings = this.exports._getTaskings.call(this, taskId);
      return tasking = getFromForTasking(storedTaskings, tasking);
    },

    isTaskingEnabled(taskId, tasking) {
      tasking = this.exports._getTaskingFor.call(this, taskId, tasking);
      return !tasking.disabled === true;
    },

    getTaskingFor(taskId, tasking) {
      tasking = this.exports._getTaskingFor.call(this, taskId, tasking);
      return maskToTasking(tasking);
    },

    isTaskValid(taskId) {
      const taskings = this.exports.get.call(this, taskId);
      const isThisTaskValid = isTaskValid(taskings);
      if (!isThisTaskValid) { return false; }

      // dont check tasking validity if taskings are same as default/loaded
      if (this.exports.isTaskSame.call(this, taskId)) { return true; }

      return _.every(taskings, isTaskingValid);
    },

    isTaskingValid(taskId, tasking) {

      // dont check tasking validity if taskings are same as default/loaded
      if (this.exports.isTaskSame.call(this, taskId)) { return true; }

      tasking = this.exports.getTaskingFor.call(this, taskId, tasking);
      return isTaskingValid(tasking);
    },

    getTaskingErrors(taskId, tasking) {
      tasking = this.exports.getTaskingFor.call(this, taskId, tasking);
      return getTaskingErrors(tasking);
    },

    isTaskingDefaultTime(taskId, tasking, type = 'open') {
      const courseId = this.exports.getCourseIdForTask.call(this, taskId);

      tasking = this.exports.getTaskingFor.call(this, taskId, tasking);
      const defaults = this.exports.getDefaultsFor.call(this, courseId, tasking);

      return tasking[`${type}_time`] === defaults[`${type}_time`];
    },

    hasTasking(taskId, tasking) {
      const storedTaskings = this.exports._getTaskings.call(this, taskId);
      if (storedTaskings == null) { return false; }

      tasking = this.exports._getTaskingFor.call(this, taskId, tasking);
      return (tasking != null);
    },

    get(taskId) {
      let taskings;
      const isTaskingsAll = this.exports.getTaskingsIsAll.call(this, taskId);

      if (isTaskingsAll) {
        const courseTasking = this.exports.getTaskingFor.call(this, taskId);
        taskings = this.exports._getBlankTaskings.call(this, taskId);
        _.each(taskings, tasking => _.extend(tasking, courseTasking));
      } else {
        const storedTaskings = this.exports._getTaskings.call(this, taskId);
        taskings = _.chain(storedTaskings)
          .omit(toTaskingIndex())
          .reject(tasking => tasking.disabled).map(maskToTasking)
          .value();
      }

      return taskings;
    },

    hasAllTaskings(taskId) {
      let hasAllTaskings;
      const isTaskingsAll = this.exports.getTaskingsIsAll.call(this, taskId);
      if (isTaskingsAll) { return true; }

      const storedTaskings = this.exports._getTaskings.call(this, taskId);
      return hasAllTaskings = _.chain(storedTaskings)
        .omit(toTaskingIndex())
        .every(tasking => !tasking.disabled).value();
    },

    isTaskingOpened(taskId, tasking) {
      tasking = this.exports.getTaskingFor.call(this, taskId, tasking);
      return isTaskingOpened(tasking);
    },

    _getTaskingsSortedByDate(taskId, type) {
      let sortedTaskings;
      const taskings = this.exports.get.call(this, taskId);
      const attribute = TASKING_MASKS[type];

      return sortedTaskings = _.sortBy(taskings, tasking => moment(tasking[attribute]).valueOf());
    },

    _getTaskingsSortedByOpenDate(taskId) {
      return this.exports._getTaskingsSortedByDate.call(this, taskId, 'open');
    },

    _getTaskingsSortedByDueDate(taskId) {
      return this.exports._getTaskingsSortedByDate.call(this, taskId, 'due');
    },

    isTaskOpened(taskId) {
      const firstTasking = _.first(this.exports._getTaskingsSortedByOpenDate.call(this, taskId));
      return (firstTasking && isTaskingOpened(firstTasking)) || false;
    },

    getFirstDueDate(taskId) {
      const firstTasking = _.first(this.exports._getTaskingsSortedByDueDate.call(this, taskId));
      return transformTasking(firstTasking).due_date;
    },

    getTaskingDate(taskId, tasking, type = 'open') {
      tasking = this.exports._getTaskingFor.call(this, taskId, tasking);
      return tasking[`${type}_date`];
    },

    getTaskingTime(taskId, tasking, type = 'open') {
      tasking = this.exports._getTaskingFor.call(this, taskId, tasking);
      return tasking[`${type}_time`];
    },

    isTaskSame(taskId) {
      const original = this.exports.getOriginalTaskings.call(this, taskId);
      const currentTaskings = this.exports.get.call(this, taskId);

      return _.isEqual(
        _.sortBy(original, toTaskingIndex),
        _.sortBy(currentTaskings, toTaskingIndex)
      );
    },

    getChanged(taskId) {
      if (!this.exports.isTaskSame.call(this, taskId)) { return this.exports.get.call(this, taskId); }
    },
  },
};


const { actions, store } = makeSimpleStore(TaskingConfig);

export { actions as TaskingActions, store as TaskingStore };
