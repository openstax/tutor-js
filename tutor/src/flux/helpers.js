/* eslint-disable */
import _ from 'underscore';
import flux from 'flux-react';

const LOADING = 'loading';
const LOADED  = 'loaded';
const FAILED  = 'failed';
const SAVING  = 'saving';
const DELETING = 'deleting';
const DELETED = 'deleted';

const STATES = {
  LOADING,
  LOADED,
  FAILED,
  SAVING,
  DELETING,
  DELETED,
};

let idCounter = 0;
const CREATE_KEY = () => `_CREATING_${idCounter++}`;

const isNew = id => /_CREATING_/.test(id);

const CrudConfig = function() {
  return {
    _asyncStatus: {},
    _local: {},
    _changed: {},
    _errors: {},
    _reload: {},

    // If the specific type needs to do something else to the object:
    // _loaded : (obj, id) ->
    // _saved : (obj, id) ->
    // _reset : ->

    reset() {
      this._asyncStatus = {};
      this._local = {};
      this._changed = {};
      this._errors = {};
      this._reload = {};

      if (typeof this._reset === 'function') {
        this._reset();
      }
      return this.emitChange();
    },

    dontReload(id) {
      return (this._asyncStatus[id] === LOADED) && this._HACK_DO_NOT_RELOAD;
    },

    FAILED(status, msg, id, ...args) {
      this._asyncStatus[id] = FAILED;
      this._errors[id] = msg;
      if (typeof this._failed === 'function') {
        this._failed({ status, msg }, id, ...Array.from(args));
      }

      if (status !== 0) { // indicates network failure
        delete this._local[id];
        return this.emitChange();
      }
    },

    load(id) {
      return this._load(id);
    },

    // allow aliasing load without triggering api call.
    _load(id) {
      // Add a shortcut for unit testing
      if (this.dontReload(id)) { return; }
      this._reload[id] = false;
      this._asyncStatus[id] = LOADING;
      return this.emitChange();
    },

    loaded(obj, id, ...args) {
      // id = obj.id
      this._asyncStatus[id] = LOADED;

      if (obj) {
        // If the specific type needs to do something else to the object:
        this._local[id] = (typeof this._loaded === 'function' ? this._loaded(obj, id, ...Array.from(args)) : undefined) || obj;
      }

      return this.emitChange();
    },

    save(id, obj) {
      // Note: id could be isNew()
      this._asyncStatus[id] = SAVING;
      return this.emitChange();
    },

    saved(result, id, ...args) {
      // id = result.id
      this._asyncStatus[id] = LOADED; // TODO: Maybe make this SAVED

      // If the specific type needs to do something else to the object:
      const obj = typeof this._saved === 'function' ? this._saved(result, id, ...Array.from(args)) : undefined;
      if (obj) { result = obj; }

      if (result) {
        this._local[id] = result;
        this._local[result.id] = result;
        delete this._changed[result.id];
      } else {
        console.warn('API WARN: Server did not return JSON after saving. Patching locally');
        // Merge all the local changes into the new local object
        this._local[id] = _.extend(this._local[id], this._changed[id]);
      }
      delete this._changed[id];
      delete this._errors[id];
      // If the specific type needs to do something else to the object:
      return this.emitChange();
    },

    create(localId, attributes = {}) {
      if (!isNew(localId)) { throw new Error('BUG: MUST provide a local id'); }
      this._local[localId] = {};
      this._changed[localId] = attributes;
      return this._asyncStatus[localId] = LOADED;
    },

    created(result, localId, ...args) {
      this._local[localId] = result; // HACK: So react component can still manipulate the same object
      this._local[result.id] = result;
      this._asyncStatus[localId] = LOADED;
      this._asyncStatus[result.id] = LOADED;
      this.emitChange();
      return (typeof this._created === 'function' ? this._created(result, localId, ...Array.from(args)) : undefined);
    },

    _change(id, obj) {
      if (this._changed[id] == null) { this._changed[id] = {}; }
      _.extend(this._changed[id], obj);
      return this.emitChange();
    },

    _save(id) {
      return this._asyncStatus[id] = SAVING;
    },

    delete(id) {
      this._asyncStatus[id] = DELETING;
      return (typeof this._delete === 'function' ? this._delete(id) : undefined);
    },

    deleted(result, id, ...args) {
      this._asyncStatus[id] = DELETED;
      delete this._local[id];
      this.emitChange();
      return (typeof this._deleted === 'function' ? this._deleted(result, id, ...Array.from(args)) : undefined);
    },

    clearChanged(id) {
      return delete this._changed[id];
    },

    HACK_DO_NOT_RELOAD(bool) { return this._HACK_DO_NOT_RELOAD = bool; },

    // Keep this here so other exports method have access to it
    _get(id) {
      const val = this._local[id];
      if (!val && (this._asyncStatus[id] !== SAVING)) { return null; }
      // Scores stores an Array unlike most other stores
      if (_.isArray(val)) {
        return val;
      } else {
        return _.extend({}, val, this._changed[id]);
      }
    },

    exports: {
      isUnknown(id) { return !this._asyncStatus[id]; },
      isLoading(id) { return this._asyncStatus[id] === LOADING; },
      isLoaded(id) { return this._asyncStatus[id] === LOADED; },
      isDeleting(id) { return this._asyncStatus[id] === DELETING; },
      isSaving(id) { return this._asyncStatus[id] === SAVING; },
      isFailed(id) { return this._asyncStatus[id] === FAILED; },
      getAsyncStatus(id) { return this._asyncStatus[id]; },
      get(id) { return this._get(id); },
      isChanged(id) { return !_.isEmpty(this._changed[id]); },
      getChanged(id) { return this._changed[id] || {}; },
      freshLocalId() { return CREATE_KEY(); },
      isNew(id) { return isNew(id); },
      reload(id) { return this._reload[id]; },
      getError(id) { return this._errors[id]; },
    },
  };
};

// Helper for creating a simple store for actions
const makeSimpleStore = function(storeConfig) {

  let actionsConfig = _.omit(storeConfig, (value, key) => (typeof value !== 'function') || (key === 'exports'));

  actionsConfig = _.keys(actionsConfig);
  const actions = flux.createActions(actionsConfig);
  storeConfig.actions = _.values(actions);
  const store = flux.createStore(storeConfig);
  return { actions, store };
};


const extendConfig = function(newConfig, origConfig) {
  if (newConfig.exports == null) { newConfig.exports = {}; }
  _.defaults(newConfig, origConfig);
  _.defaults(newConfig.exports, origConfig.exports);
  return newConfig;
};


const makeStandardStore = function(name, storeConfig) {
  extendConfig(storeConfig, new CrudConfig());
  const { actions, store } = makeSimpleStore(storeConfig);
  return { [`${name}Actions`]: actions, [`${name}Store`]: store };
};


export { CrudConfig, makeSimpleStore, extendConfig, makeStandardStore, isNew, STATES };
