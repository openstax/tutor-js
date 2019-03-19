import { find, each, extend, last } from 'lodash';
import Durations from '../helpers/durations';
import { StepTitleActions } from './step-title';
import { ResponseValidation } from '../models/response_validation';
import { CrudConfig, makeSimpleStore, extendConfig, STATES } from './helpers';

let TaskActions;
const RECOVERY = 'recovery';
const crudConfig = new CrudConfig();

const isMissingExercises = response => (response.errors != null) && find(response.errors, { code: 'no_exercises' });

const TaskStepConfig = {
  _asyncStatus: {},
  _recoveryTarget: {},
  _loadingPersonalizedStatus: {},

  _loaded(obj, id) {
    if (!obj.task_id) {
      obj.task_id = this._local[id] != null ? this._local[id].task_id : undefined;
    }
    this.emit('step.loaded', id);
    each(this._recoveryTarget, (v,k) => this._updateRecoveredFor(id, v, k));
    StepTitleActions.parseStep(obj);

    if (this._loadingPersonalizedStatus[id]) { this._loadingPersonalizedStatus[id] = false; }

    return obj;
  },

  saved(obj, id) {
    const stepObj = find(obj.steps, { id });
    TaskActions.onStepSaved(obj, id);
    crudConfig.saved.call(this, stepObj, id);
  },

  _saved(obj, id) {
    obj.task_id = this._local[id] != null ? this._local[id].task_id : undefined;
    return obj;
  },

  _loadPersonalized(id) {
    return this._loadingPersonalizedStatus[id] = true;
  },

  loadPersonalized(id) {
    this._load(id);
    return this._loadPersonalized(id);
  },

  loadedNoPersonalized(obj, id) {
    const { data, status, statusMessage } = obj;
    this._asyncStatus[id] = STATES.LOADED;

    if (isMissingExercises(data) && this.exports.isPlaceholder.call(this, id)) {
      this.setNoPersonalized(id);
      this.emitChange();
      return this.emit('step.loaded', id);
    } else {
      return this.FAILED(status, statusMessage, id);
    }
  },

  // called by the Task flux store once it's initialized
  // to prevent circular dependencies
  setTaskActions(actions) {
    TaskActions = actions;
  },

  setNoPersonalized(id) {
    const fakeEmptyPersonalized = {
      type: 'placeholder',
      group: 'personalized',
      placeholder_for: 'exercise',
      exists: false,
      id,
      is_completed: true,
    };

    return this._local[id] = extend({}, this._get(id), fakeEmptyPersonalized);
  },

  forceReload(id) {
    return this._reload[id] = true;
  },

  complete(id) {
    if (this.exports.isCompleting.call(this, id)) { return; }
    this._change(id, { is_completed: true });
    this._save(id);
  },

  completed(obj, id) {
    delete this._changed[id];
    return this._asyncStatus[id] = STATES.LOADED;
  },

  setAnswerId(id, answer_id) {
    this._change(id, { answer_id });
    return this._save(id);
  },

  async setFreeResponseAnswer(id, free_response) {
    this._change(id, { free_response });
    const { spy, content: { uid } } = this._local[id];
    const validation = new ResponseValidation();
    try {
      await validation.validate({ uid, response: free_response });
      const garbage_estimate = validation.serialize();
      if (spy) {
        spy.garbage_estimate = garbage_estimate;
      }
      this._change(id, { spy, garbage_estimate });
    } catch(e) {
      console.warn(e); // eslint-disable-line no-console
    }
    return actions.saveFreeResponseAnswer(id);
  },
  // called once setFreeResponseAnswer completes above.  will trigger saving the flux store
  saveFreeResponseAnswer() {},

  updateTempFreeResponse(id, cachedFreeResponse) {
    return this._change(id, { cachedFreeResponse });
  },

  loadRecovery(id) {
    this._asyncStatus[id] = RECOVERY;
    return this.emit('change', id);
  },

  loadedRecovery(obj, id) {
    this._recoveryTarget[id] = obj.id;
    return this.emit('step.recovered', obj);
  },

  _updateRecoveredFor(loadedId, recoverTarget, recoveredFor) {
    if (recoverTarget === loadedId) {
      this.emit('change', recoveredFor);
      this.clearChanged(recoveredFor);
      delete this._asyncStatus[recoveredFor];
      delete this._recoveryTarget[recoveredFor];
    }
  },

  exports: {
    isRecovering(id) { return this._asyncStatus[id] === RECOVERY; },

    isCompleting(id) {
      return (this._changed[id] && this._changed[id].is_completed) || false;
    },

    isAnswered(id) {
      const step = this._get(id);
      let isAnswered = true;
      if (step.type === 'exercise') {
        if (!step.answer_id) {
          isAnswered = false;
        }
      }
      return isAnswered;
    },

    isCore(id) {
      const step = this._get(id);
      const coreGroups = [
        'core',
        'recovery',
        'default',
      ];
      return coreGroups.indexOf(step.group) > -1;
    },

    isPlaceholder(id) {
      const step = this._get(id);
      return (step != null ? step.type : undefined) === 'placeholder';
    },

    isLoadingPersonalized(id) {
      return this._loadingPersonalizedStatus[id];
    },

    shouldExist(id) {
      return __guard__(this._get(id), x => x.exists) !== false;
    },

    getTaskId(id) {
      const step = this._get(id);
      return step.task_id;
    },

    getCnxId(id) {
      const step = this._get(id);
      const parts = __guard__(step != null ? step.content_url : undefined, x => x.split('contents/'));
      if (parts.length > 1) {
        return last(parts);
      }
      return null;
    },

    getFreeResponse(id) {
      const step = this._get(id);
      return step.free_response;
    },

    getAnswerId(id) {
      const step = this._get(id);
      return step.answer_id;
    },

    hasContent(id) {
      const step = this._get(id);
      return (step.content != null) || (step.content_html != null) || (step.content_url != null);
    },

    hasFreeResponse(id) {
      const step = this._get(id);
      if (step.type !== 'exercise') { return false; }

      return __guard__(step.content.questions != null ? step.content.questions[0].formats : undefined, x => x.indexOf('free-response')) > -1;
    },

    getTempFreeResponse(id) {
      const step = this._get(id);
      if (!step.cachedFreeResponse) { return ''; }
      return step.cachedFreeResponse;
    },

    canTryAnother(id, task, hasIncorrect = false) {
      const step = this._get(id);
      return (step != null) &&
        (step.has_recovery && (hasIncorrect || (step.correct_answer_id !== step.answer_id))) &&
        !Durations.isPastDue(task) &&
        !this.exports.isLoading.call(this, id) &&
        !this.exports.isSaving.call(this, id);
    },
  },
};

extendConfig(TaskStepConfig, crudConfig);
const { actions, store } = makeSimpleStore(TaskStepConfig);
export { actions as TaskStepActions, store as TaskStepStore };

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
