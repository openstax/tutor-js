// coffeelint: disable=no_empty_functions
import {
  map, find, filter, each, values, findIndex, isEqual, first, pick,
  findLastIndex, isEmpty, pluck, uniq, compact,
} from 'lodash';
import moment from 'moment';
import flux from 'flux-react';

import Durations from '../helpers/durations';
import { CrudConfig, makeSimpleStore, extendConfig } from './helpers';
import { TaskStepActions, TaskStepStore } from './task-step';

import { MediaActions } from './media';
import { StepTitleActions } from './step-title';

const getSteps = steps =>
  map(steps, ({ id }) => TaskStepStore.get(id))
;

const getCurrentStepIndex = function(steps) {
  let currentStep = -1;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (!step.is_completed) {
      currentStep = i;
      break;
    }
  }
  return currentStep;
};

const getCurrentStep = steps =>
  find(steps, step =>
    // return for first step where step.is_completed = false or
    // step.is_completed is undefined
    !step.is_completed || (step.is_completed == null)
  )
;

const getIncompleteSteps = steps =>
  filter(steps, step => (step != null) && !step.is_completed)
;

const getCompleteSteps = steps =>
  filter(steps, step => (step != null) && step.is_completed)
;

const getChangedSteps = steps =>
  filter(steps, step => (step != null) && TaskStepStore.isChanged(step.id))
;

// HACK When working locally a step completion triggers a reload but the is_completed field on the TaskStep
// is discarded. so, if is_completed is set on the local object but not on the returned JSON
// Tack on a dummy correct_answer_id
const hackLocalStepCompletion = function(step) {
  if (step.is_completed && (__guard__(__guard__(step.content != null ? step.content.questions : undefined, x1 => x1[0]), x => x.answers[0]) != null) && !step.correct_answer_id) {
    step.correct_answer_id = step.content.questions[0].answers[0].id;
    return step.feedback_html = 'Some <em>FAKE</em> feedback';
  }
};

const TaskConfig = {
  _steps: {},

  _getStep(taskId, stepId) {
    const step = find(this._steps[taskId], s => s.id === stepId);
    return step;
  },

  _grabHtmlFromReading(step) {
    return step.content_html;
  },

  _grabHtmlFromExercise(step) {
    if (step.content == null) { return ''; }

    let html = step.content.stimulus_html;
    const questionHtml = pluck(step.content.questions, 'stem_html').join('');
    return html += questionHtml;
  },

  _grabHtml(obj) {
    let htmlToParse;
    return htmlToParse = map(obj.steps, step => {
      let html;
      if (step.type === 'reading') {
        html = this._grabHtmlFromReading(step);
      } else if (step.type === 'exercise') {
        html = this._grabHtmlFromExercise(step);
      }
      return html;
    }).join('');
  },

  _loaded(obj, id) {
    this.emit('loaded', id);
    MediaActions.parse(this._grabHtml(obj));
    StepTitleActions.parseSteps(obj.steps);
    // Populate all the TaskSteps when a Task is loaded
    if (this._steps == null) { this._steps = {}; }
    // Remove the steps so Components are forced to use `.getSteps()` to get
    // the updated step objects
    const { steps } = obj;
    delete obj.steps;
    this._steps[id] = steps;

    for (let step of steps) {
      if (obj.HACK_LOCAL_STEP_COMPLETION) { hackLocalStepCompletion(step); }
      //HACK: set the task_id so we have a link back to the task from the step
      step.task_id = id;
      TaskStepActions.loaded(step, step.id);
    }
    obj;

    // explicit return obj to load onto @_local
    return obj;
  },

  completeStep(id, taskId) {
    TaskStepActions.complete(id);
    this.emit('step.completing', id);
    if (this.exports.hasPlaceholders.call(this, taskId) &&
      !this.exports.hasIncompleteCoreStepsIndexes.call(this, taskId)) {
      const placeholderSteps = this.exports.getPlaceholders.call(this, taskId);
      return each(placeholderSteps, step => TaskStepActions._loadPersonalized(step.id));
    }
  },

  stepCompleted(obj, taskStepId) {
    TaskStepActions.completed(obj, taskStepId);
    this.loaded(obj, obj.id);
    return this.emit('step.completed', taskStepId, obj.id);
  },

  exports: {
    getSteps(id) {
      if (!this._steps[id]) { throw new Error('BUG: Steps not loaded'); }
      return getSteps(this._steps[id]);
    },

    getAll() { return values(this._local); },

    getCurrentStepIndex(taskId) {
      const steps = getSteps(this._steps[taskId]);
      // Determine the first uncompleted step
      return getCurrentStepIndex(steps);
    },

    // Returns the reading and it's step index for a given task's ID
    getReadingForTaskId(taskId, id) {
      const steps = getSteps(this._steps[taskId]);
      const { related_content } = TaskStepStore.get(id);

      // replace findIndex with findLastIndex if we should be going to the
      // most recent step of a related reading
      const relatedStepIndex = findIndex(steps, step => (step.type === 'reading') && (isEqual(step.chapter_section, first(related_content).chapter_section)));

      // should never happen if the taskId was valid
      if (relatedStepIndex <= -1) { throw new Error('BUG: Invalid taskId.  Unable to find index'); }
      // Find the first step of the related reading that appears before the given task
      return { reading: steps[relatedStepIndex], index: relatedStepIndex };
    },

    getDefaultStepIndex(taskId) {
      const steps = getSteps(this._steps[taskId]);
      return getCurrentStepIndex(steps);
    },

    getStepsIds(id) {
      return map(this._steps[id], step => pick(step, 'id'));
    },

    getCurrentStep(taskId) {
      let step;
      const steps = getSteps(this._steps[taskId]);
      return step = getCurrentStep(steps);
    },

    getIncompleteSteps(taskId) {
      let steps;
      const allSteps = getSteps(this._steps[taskId]);
      return steps = getIncompleteSteps(allSteps);
    },

    getCompletedSteps(taskId) {
      let steps;
      const allSteps = getSteps(this._steps[taskId]);
      return steps = getCompleteSteps(allSteps);
    },

    getIncompleteCoreStepsIndexes(taskId) {
      const allSteps = getSteps(this._steps[taskId]);
      const firstIndex =   findIndex(allSteps, step => (step != null) && !step.is_completed && TaskStepStore.isCore(step.id));

      const lastIndex = findLastIndex(allSteps, step => (step != null) && !step.is_completed && TaskStepStore.isCore(step.id));

      const coreSteps = [
        firstIndex,
      ];
      if (lastIndex !== firstIndex) {
        coreSteps.push(lastIndex);
      }

      return coreSteps;
    },

    hasAnyStepChanged(taskId) {
      const allSteps = getSteps(this._steps[taskId]);
      return getChangedSteps(allSteps).length;
    },

    hasIncompleteCoreStepsIndexes(taskId) {
      const allSteps = getSteps(this._steps[taskId]);
      const steps = find(allSteps, step => (step != null) && !step.is_completed && TaskStepStore.isCore(step.id));
      return (steps != null);
    },

    getPlaceholders(taskId) {
      const allSteps = getSteps(this._steps[taskId]);
      return filter(allSteps, { type: 'placeholder' });
    },

    getFirstNonCoreIndex(taskId) {
      let stepIndex;
      const allSteps = getSteps(this._steps[taskId]);
      return stepIndex = findIndex(allSteps, step => (step != null) && !TaskStepStore.isCore(step.id));
    },

    hasPlaceholders(taskId) {
      return !isEmpty(this.exports.getPlaceholders.call(this, taskId));
    },

    isTaskCompleted(taskId) {
      const incompleteStep = getCurrentStep(getSteps(this._steps[taskId]));
      return !incompleteStep;
    },

    hasCrumbs(taskId) {
      return !(
        ((this._steps[taskId].length === 1) &&
        (this._get(taskId).type === 'external')) ||
        (this._get(taskId).type === 'reading')
      );
    },

    hasProgress(taskId) {
      return (this._steps[taskId].length >= 1) && (this._get(taskId).type === 'reading');
    },

    getRelatedSections(taskId) {
      return uniq(
        compact(
          pluck(
            getSteps(this._steps[taskId]), 'chapter_section'
          )
        )
      );
    },

    getStepsRelatedContent(taskId) {
      return sortBy(
        uniqBy(
          flatten(
            compact(
              pluck(
                filter(
                  getSteps(this._steps[taskId]),
                  step => TaskStepStore.isCore(step.id)
                ),
                'related_content'
              ),
            )
          ),
          cs => cs.chapter_section.join('.')
        ),
        cs => cs.chapter_section.join('.')
      );
    },

    getDetails(taskId) {
      let type;
      let title = '';
      let sections = [];

      ({ title, type } = this._get(taskId));
      sections = this.exports.getRelatedSections.call(this, taskId);

      if (isEmpty(sections) && (type === 'concept_coach')) {
        const details = this.exports.getStepsRelatedContent.call(this, taskId);
        if (!isEmpty(details)) {
          sections = pluck(details, 'chapter_section');
          ({ title } = details[0]);
        }
      }

      return { title, sections };
    },

    getCompletedStepsCount(taskId) {
      const allSteps = getSteps(this._steps[taskId]);
      const steps = getCompleteSteps(allSteps);

      return steps.length;
    },

    getTotalStepsCount(taskId) {
      const allSteps = getSteps(this._steps[taskId]);

      return allSteps.length;
    },

    isTaskPastDue(taskId) {
      return Durations.isPastDue( this._get(taskId) );
    },

    isPractice(taskId) {
      const practices = [
        'practice',
        'chapter_practice',
        'page_practice',
        'practice_worst_topics',
      ];

      if (practices.indexOf(this._get(taskId).type) > -1) { return true; } else { return false; }
    },

    getStepIndex(taskId, stepId) {
      return findIndex(this._steps[taskId], { id: stepId });
    },

    getStepLateness(taskId, stepId) {
      const result = {
        late: false,
        last_completed_at: null,
        how_late: null,
      };

      const step = this._getStep(taskId, stepId);
      const { due_at, type } = this._get(taskId);

      if ((step == null) || (type !== 'homework')) { return result; }

      const { last_completed_at } = step;

      result.late = moment(due_at).isBefore(last_completed_at);
      result.last_completed_at = last_completed_at;
      result.how_late = moment(due_at).from(last_completed_at, true);

      return result;
    },

    getStepParts(taskId, stepId) {
      const currentStep = this._getStep(taskId, stepId);
      const { content_url } = currentStep;
      let parts = filter(this._steps[taskId], step => step.is_in_multipart && (step.content_url === content_url));

      if (isEmpty(parts)) { parts = [currentStep]; }

      return parts = getSteps(parts);
    },

    getStepByIndex(taskId, stepIndex) {
      return this._steps[taskId][stepIndex];
    },

    isFeedbackImmediate(taskId) {
      const { is_feedback_available } = this._get(taskId);
      return is_feedback_available;
    },

    isDeleted(taskId) {
      const { is_deleted } = this._get(taskId);
      return is_deleted;
    },

    isSameStep(taskId, ...stepIds) {
      const contentUrls = uniq(
        map(stepIds, stepId => {
          const step = this._getStep(taskId, stepId);

          if ((step != null ? step.is_in_multipart : undefined)) {
            return step.content_url;
          } else {
            return null;
          }
        })
      );
      return (contentUrls.length === 1) && (first(contentUrls) != null);
    },
  },
};

extendConfig(TaskConfig, new CrudConfig());
const { actions, store } = makeSimpleStore(TaskConfig);
export { actions as TaskActions, store as TaskStore };

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
