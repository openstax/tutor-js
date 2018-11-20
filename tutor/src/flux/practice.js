import _ from 'underscore';
import hash from 'object-hash';

import { TaskActions, TaskStore } from './task';
import { CrudConfig, makeSimpleStore, extendConfig, STATES } from './helpers';

const getTopicHash = _.partial(hash, _, { unorderedArrays: true });
const makePractice = (
  result,
  courseId,
  topicParams,
) => ({
  id: result.id,
  created_for: topicParams,
  exists: true,
})
;

const CoursePractice = {
  _topics: {},
  _cache: {},

  _reset() {
    this._topics = {};
    return this._cache = {};
  },

  _recordTopics(taskId, courseId, topicParams) {
    if (this._topics[courseId] == null) { this._topics[courseId] = {}; }
    return this._topics[courseId][taskId] = topicParams;
  },

  _addToCache(thingToCache, courseId, topicParams) {
    const topicHash = getTopicHash(topicParams);
    if (_.isEmpty(topicHash)) { return; }

    if (this._cache[courseId] == null) { this._cache[courseId] = {}; }
    if (this._cache[courseId][topicHash] == null) { this._cache[courseId][topicHash] = []; }
    return this._cache[courseId][topicHash].push(thingToCache);
  },

  _cacheError(result, courseId, topicParams) {
    return this._addToCache({ exists: false }, courseId, topicParams);
  },

  _cacheSuccess(result, courseId, topicParams) {
    const practice = makePractice(result, courseId, topicParams);
    this._addToCache(practice, courseId, topicParams);
    return practice;
  },

  _failed(result, { courseId, query }) {
    return this._cacheError(result, courseId, query);
  },

  create(courseId, topicParams) {
    if (!this.dontReload(courseId)) { this._local[courseId] = {}; }
    return this._asyncStatus[courseId] = STATES.LOADED;
  },

  created(result, courseId, topicParams) {
    // this will use the base config's loaded, which will
    // run _loaded within.
    return this.loaded(result, courseId, topicParams);
  },

  _loaded(result, { courseId, query }) {
    TaskActions.loaded(result, result.id);

    this._recordTopics(result.id, courseId, query);
    // cache and return practice for loading onto _local
    this._cacheSuccess(result, courseId, query);
    return this.emit(`${STATES.LOADED}.${courseId}`, result.id);
  },

  _getFromCache(courseId, topicParams) {
    const topicHash = getTopicHash(topicParams);
    if (_.isEmpty(topicHash)) { return; }

    return _.last(this._cache[courseId] != null ? this._cache[courseId][topicHash] : undefined);
  },

  _get(courseId, topicParams) {
    if (_.isEmpty(topicParams)) {
      return this._local[courseId];
    } else {
      return this._getFromCache(courseId, topicParams);
    }
  },

  exports: {
    getTaskId(courseId, topicParams) {
      return __guard__(this._get(courseId, topicParams), x => x.id);
    },

    getPageIds(courseId, topicParams) {
      return __guard__(__guard__(this._get(courseId, topicParams), x1 => x1.created_for), x => x.page_ids);
    },

    has(courseId, topicParams) {
      return __guard__(this._get(courseId, topicParams), x => x.exists);
    },

    get(courseId, topicParams) {
      if (!this.exports.has.call(this, courseId, topicParams)) { return {}; }

      const taskId = this.exports.getTaskId.call(this, courseId, topicParams);
      return TaskStore.get(taskId);
    },

    isDisabled(courseId, topicParams) {
      return (this._get(courseId, topicParams) != null) && (this._get(courseId, topicParams).exists === false);
    },

    getCurrentTopics(courseId, taskId) {
      return (this._topics[courseId] != null ? this._topics[courseId][taskId] : undefined) || {};
    },
  },
};

extendConfig(CoursePractice, new CrudConfig());
const { actions, store } = makeSimpleStore(CoursePractice);
export { actions as CoursePracticeActions, store as CoursePracticeStore };

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}