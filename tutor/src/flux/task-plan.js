import {
  sortBy, extend, keys, pick, isObject, isString, clone,
  omit, isEqual, negate, cloneDeep, isEmpty,
} from 'lodash';
import { CrudConfig, makeSimpleStore, extendConfig } from './helpers';
import Publishing from '../models/jobs/task-plan-publish';
import Courses from '../models/courses-map';
import { chapterSectionToNumber } from '../helpers/content';

const planCrudConfig = new CrudConfig();

const hasValue = negate(isEmpty);

const TUTOR_SELECTIONS = {
  default: 3,
  max: 4,
  min: 0,
};

const PLAN_TYPES = {
  HOMEWORK: 'homework',
  READING: 'reading',
  EXTERNAL: 'external',
  EVENT: 'event',
};

const DEFAULT_TYPE = PLAN_TYPES.READING;

const sortTopics = (topics, pages) =>
  sortBy(topics, function(topicId) {
    const topic = pages[topicId];
    return topic ? chapterSectionToNumber(topic.chapter_section) : '';
  })
;

const BASE_PLANS = {
  homework: {
    is_feedback_immediate: false,

    settings: {
      page_ids: [],
      exercise_ids: [],
      exercises_count_dynamic: TUTOR_SELECTIONS.default,
    },
  },

  reading: {
    settings: {
      page_ids: [],
    },
  },

  external: {
    settings: {
      external_url: '',
    },
  },

  event: {
    settings: {},
  },
};

const newTaskPlan = function(attributes = {}) {
  if (attributes.type == null) { attributes.type = DEFAULT_TYPE; }

  if (BASE_PLANS[attributes.type] != null) {
    return extend({}, attributes, cloneDeep(BASE_PLANS[attributes.type]));
  } else {
    return {};
  }
};

const validateSettings = function(taskPlan = {}) {
  if (taskPlan.type == null) { taskPlan.type = DEFAULT_TYPE; }

  const expectedSettings = keys(BASE_PLANS[taskPlan.type].settings);
  taskPlan.settings = pick(taskPlan.settings, expectedSettings);

  return taskPlan;
};

const TaskPlanConfig = {
  _stats: {},
  _asyncStatusStats: {},
  _server_copy: {},
  _silentError: {},

  _loaded(obj, planId) {
    if (isObject(obj)) { this._server_copy[planId] = JSON.stringify(obj); }
    this.emit(`loaded.${planId}`);
    return obj;
  },

  // Somewhere, the local copy gets taken apart and rebuilt.
  // Keep a copy of what was served.
  _getOriginal(planId) {
    if (isString(this._server_copy[planId])) {
      return JSON.parse(this._server_copy[planId]);
    } else {
      return {};
    }
  },

  create(localId, attributes = {}) {
    attributes = newTaskPlan(attributes);
    return planCrudConfig.create.call(this, localId, attributes);
  },

  _getPlan(planId) {
    let obj = this._get(planId);
    obj = validateSettings(obj);
    return obj;
  },

  // used by API
  FAILED() {},

  _delete(id) {
    return this.emit('deleting', id);
  },

  _deleted(result, id) {
    return this.emit('deleted', id, result);
  },

  // Returns copies of the given property names from settings
  // Copies are returned so that the store can be reset
  _getClonedSettings(id, ...names) {
    const plan = this._getPlan(id);
    const settings = {};
    for (let name of names) {
      settings[name] = clone(plan.settings[name]);
    }
    return settings;
  },

  _changeSettings(id, attributes) {
    const plan = this._getPlan(id);
    return this._change(id, { settings: extend({}, plan.settings, attributes) });
  },

  replaceTaskings(id, taskings) {
    if (taskings != null) {
      this._change(id, { tasking_plans: taskings });
    } else if ((this._changed[id] != null ? this._changed[id].tasking_plans : undefined) != null) {
      delete this._changed[id].tasking_plans;
      this.emitChange();
    }
  },

  updateTutorSelection(id, direction) {
    let { exercises_count_dynamic } = this._getClonedSettings(id, 'exercises_count_dynamic');

    exercises_count_dynamic += direction;

    exercises_count_dynamic = Math.min(TUTOR_SELECTIONS.max, exercises_count_dynamic);
    exercises_count_dynamic = Math.max(TUTOR_SELECTIONS.min, exercises_count_dynamic);
    return this._changeSettings(id, { exercises_count_dynamic });
  },

  updateTitle(id, title) {
    return this._change(id, { title });
  },

  updateDescription(id, description) {
    return this._change(id, { description });
  },

  updateUrl(id, external_url) {
    return this._change(id, { settings: { external_url } });
  },

  setEvent(id) {
    return this._change(id, { settings: {} });
  },

  sortTopics(id, pages) {
    const { page_ids } = this._getClonedSettings(id, 'page_ids');
    return this._changeSettings(id, { page_ids: sortTopics(page_ids, pages) });
  },

  addTopic(id, topicId) {
    const { page_ids } = this._getClonedSettings(id, 'page_ids');
    if (page_ids.indexOf(topicId) < 0) { page_ids.push(topicId); }
    return this._changeSettings(id, { page_ids });
  },

  setImmediateFeedback(id, is_feedback_immediate) {
    return this._change(id, { is_feedback_immediate });
  },

  removeTopic(id, topicId) {
    const { page_ids, exercise_ids } = this._getClonedSettings(id, 'page_ids', 'exercise_ids');
    const index = page_ids != null ? page_ids.indexOf(topicId) : undefined;
    if (page_ids != null) {
      page_ids.splice(index, 1);
    }
    return this._changeSettings(id, { page_ids, exercise_ids });
  },

  updateTopics(id, page_ids) {
    return this._changeSettings(id, { page_ids });
  },

  addExercise(id, exerciseId) {
    const { exercise_ids } = this._getClonedSettings(id, 'exercise_ids');
    if (exercise_ids.indexOf(exerciseId) < 0) {
      exercise_ids.push(exerciseId);
    }
    return this._changeSettings(id, { exercise_ids });
  },

  removeExercise(id, exerciseId) {
    const { exercise_ids } = this._getClonedSettings(id, 'exercise_ids');
    const index = exercise_ids != null ? exercise_ids.indexOf(exerciseId) : undefined;
    if (exercise_ids != null) {
      exercise_ids.splice(index, 1);
    }
    return this._changeSettings(id, { exercise_ids });
  },

  updateExercises(id, exercise_ids) {
    return this._changeSettings(id, { exercise_ids });
  },

  moveReading(id, topicId, step) {
    const { page_ids } = this._getClonedSettings(id, 'page_ids');
    const curIndex = page_ids != null ? page_ids.indexOf(topicId) : undefined;
    let newIndex = curIndex + step;

    if (newIndex < 0) {
      newIndex = 0;
    }
    if (!(newIndex < page_ids.length)) {
      newIndex = page_ids.length - 1;
    }

    page_ids[curIndex] = page_ids[newIndex];
    page_ids[newIndex] = topicId;

    return this._changeSettings(id, { page_ids });
  },

  moveExercise(id, exerciseId, step) {
    const { exercise_ids } = this._getClonedSettings(id, 'exercise_ids');
    const curIndex = exercise_ids != null ? exercise_ids.indexOf(exerciseId) : undefined;
    let newIndex = curIndex + step;

    if (newIndex < 0) {
      newIndex = 0;
    }
    if (!(newIndex < exercise_ids.length)) {
      newIndex = exercise_ids.length - 1;
    }

    exercise_ids[curIndex] = exercise_ids[newIndex];
    exercise_ids[newIndex] = exerciseId;

    return this._changeSettings(id, { exercise_ids });
  },

  _getStats(id) {
    return this._stats[id];
  },

  loadStats(id) {
    delete this._stats[id];
    this._asyncStatusStats[id] = 'loading';
    return this.emitChange();
  },

  loadedStats(obj, id) {
    this._stats[id] = obj;
    this._asyncStatusStats[id] = 'loaded';
    return this.emitChange();
  },

  publish(id) {
    this.emit('publishing', id);
    return this._change(id, { is_publish_requested: true });
  },

  saveSilent(id) {
    this._save(id);
    return this.emitChange();
  },

  _saved(obj, id) {
    return this.emit(`saved.${id}`, obj);
  },

  erroredSilent(obj) {
    return this.emit('errored', obj);
  },

  resetPlan(id) {
    this._local[id] = clone(this._getOriginal(id));
    return this.clearChanged(id);
  },

  removeUnsavedDraftPlan(id) {
    if (!this.exports.isNew.call(this, id)) { return; }
    delete this._local[id];
    this.clearChanged(id);
    this.emitChange();
  },

  _isDeleteRequested(id) {
    const deleteStates = [
      'deleting',
      'deleted',
    ];
    return deleteStates.indexOf(this._asyncStatus[id]) > -1;
  },

  createClonedPlan(newPlanId, { planId, courseId, due_at }) {
    const original = this._local[planId];
    const originalPlan = {};

    ['title', 'description', 'is_feedback_immediate',
      'settings', 'ecosystem_id'].forEach((key) => {
      originalPlan[key] = cloneDeep(original[key]);
    });

    const course = Courses.get(courseId);
    const tasking_plans = course.periods.map(period => ({
      opens_at: course.starts_at,
      target_id: period.id,
      target_type: 'period',
      due_at,
    }));

    const plan = extend(
      newTaskPlan({ type: original.type }),
      originalPlan,
      {
        id: newPlanId,
        cloned_from_id: planId,
        tasking_plans,
      },
    );

    this._local[newPlanId] = {};
    this._changed[newPlanId] = plan;
    return this.emitChange();
  },

  exports: {
    hasTopic(id, topicId) {
      const plan = this._getPlan(id);
      return __guard__(plan != null ? plan.settings.page_ids : undefined, x => x.indexOf(topicId)) >= 0;
    },

    getTopics(id) {
      const plan = this._getPlan(id);
      return (plan != null ? plan.settings.page_ids : undefined);
    },

    isChangingToDueAt(id) {
      const plan = this._changed[id];
      return (plan != null) && !plan.is_feedback_immediate;
    },

    isFeedbackImmediate(id) {
      const plan = this._getPlan(id);
      return (plan != null ? plan.is_feedback_immediate : undefined);
    },

    getEcosystemId(id, courseId) {
      const plan = this._getPlan(id);
      return plan.ecosystem_id || __guard__(Courses.get(courseId), x => x.ecosystem_id);
    },

    hasExercise(id, exerciseId) {
      const plan = this._getPlan(id);
      return __guard__(plan != null ? plan.settings.exercise_ids : undefined, x => x.indexOf(exerciseId)) >= 0;
    },

    getExercises(id) {
      const plan = this._getPlan(id);
      return (plan != null ? plan.settings.exercise_ids : undefined);
    },

    exerciseCount(id) {
      const plan = this._getPlan(id);
      return (plan != null ? plan.settings.exercise_ids.length : undefined);
    },

    getDescription(id) {
      const plan = this._getPlan(id);
      return (plan != null ? plan.description : undefined);
    },

    isHomework(id) {
      const plan = this._getPlan(id);
      return plan.type === PLAN_TYPES.HOMEWORK;
    },

    getType(id) {
      return (this._getPlan(id) || {}).type;
    },

    isValid(id) {
      const plan = this._getPlan(id);
      if (plan.type === 'reading') {
        return hasValue(plan.title) && hasValue(plan.settings) && hasValue(plan.settings.page_ids);
      } else if (plan.type === 'homework') {
        return hasValue(plan.title) && hasValue(plan.settings) && hasValue(plan.settings.exercise_ids);
      } else if (plan.type === 'external') {
        return hasValue(plan.title) && hasValue(plan.settings) && hasValue(plan.settings.external_url);
      } else if (plan.type === 'event') {
        return hasValue(plan.title);
      } else {
        return false;
      }
    },

    isPublished(id) {
      const plan = this._getPlan(id);
      return !!(plan != null ? plan.is_published : undefined);
    },

    isDeleteRequested(id) { return this._isDeleteRequested(id); },

    isEditable(id) {
      // cannot be/being deleted
      return !this._isDeleteRequested(id);
    },

    isPublishing(id) {
      if (this.exports.isNew.call(this, id)) { return false; }
      return (this._changed[id] != null ? this._changed[id].is_publishing : undefined) || Publishing.isPublishing(this._getPlan(id));
    },

    canDecreaseTutorExercises(id) {
      const plan = this._getPlan(id);
      return plan.settings.exercises_count_dynamic > TUTOR_SELECTIONS.min;
    },

    canIncreaseTutorExercises(id) {
      const plan = this._getPlan(id);
      return plan.settings.exercises_count_dynamic < TUTOR_SELECTIONS.max;
    },

    getTutorSelections(id) {
      const plan = this._getPlan(id);
      return plan.settings.exercises_count_dynamic;
    },

    getStats(id) {
      return this._getStats(id);
    },

    isStatsLoading(id) { return this._asyncStatusStats[id] === 'loading'; },
    isStatsLoaded(id) { return !!this._stats[id]; },
    isStatsFailed(id) { return !!this._stats[id]; },

    hasChanged(id) {
      let changed = this.exports.getChanged.call(this, id);

      if (this.exports.isNew.call(this, id)) {
        // omit tasking plan changes if new plan, only check for changes in other fields
        changed = omit(changed, 'tasking_plans');
        const defaultTaskPlan = newTaskPlan({ type: changed.type });
        return !isEqual(changed, defaultTaskPlan);
      }

      return !isEmpty(changed);
    },
  },
};

extendConfig(TaskPlanConfig, planCrudConfig);
const { actions, store } = makeSimpleStore(TaskPlanConfig);

export { actions as TaskPlanActions, store as TaskPlanStore };

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
