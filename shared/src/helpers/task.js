import _ from 'underscore';
import {
  merge,
  includes,
  find,
  findIndex,
  findLastIndex,
  findLast,
  isEmpty,
  isNil,
  some,
  pick,
  extend,
  compact,
  map,
  each,
  intersection,
  flatten,
  values,
  get,
} from 'lodash';
import UiSettings from '../model/ui-settings';
import { formatSection } from './step-content';
import { INDIVIDUAL_REVIEW, REVIEW_LABEL, PERSONALIZED_GROUP, SPACED_PRACTICE_GROUP, TWO_STEP_ALIAS, INTRO_ALIASES, makeAliases } from './step-helps';

const ONE_TIME_CARD_DEFAULTS = {
  taskId: '',
  stepId: '',
};

// Settings keys are:
// 'two-step-info'
// 'personalized-info'
// 'spaced-practice-info'
const SETTING_KEYS = makeAliases('info');

const PRACTICES = [
  'practice',
  'chapter_practice',
  'page_practice',
  'practice_worst_topics',
];

const SEE_AHEAD_ALLOWED = [
  'concept_coach',
  'homework',
].concat(PRACTICES);

const ALL_TYPES = ['reading'].concat(SEE_AHEAD_ALLOWED);

const TYPE_SEPARATOR = '-';

const makeStep = function(task, step, stepIndex) {

  if (step == null) { step = {}; }
  if (step.chapter_section != null) {
    const sectionLabel = formatSection(step.chapter_section);
    const firstSectionStep = findIndex(task.steps, compareStep => formatSection(compareStep.chapter_section) === sectionLabel);
    if (stepIndex === firstSectionStep) { step.sectionLabel = formatSection(step.chapter_section); }
  }

  step = pick(step,
    'id', 'type', 'is_completed', 'related_content', 'group', 'chapter_section',
    'is_correct', 'answer_id', 'correct_answer_id', 'labels', 'sectionLabel'
  );
  task = pick(task, 'title', 'type', 'due_at', 'description', 'id');

  return extend({ task }, step);
};

const makeUiSettings = initial => merge({}, ONE_TIME_CARD_DEFAULTS, initial);

const makeKeyForType = (settingKey, taskType) => `${settingKey}${TYPE_SEPARATOR}${taskType}`;

const isPlacedHere = function(settingKey, step) {
  let settings = UiSettings.get(settingKey) || {};
  settings = settings.placement || settings;
  return (step.task_id === settings.taskId) && (step.id === settings.stepId);
};

const hasBeenPlaced = function(settingKey) {
  const settings = UiSettings.get(settingKey);
  // has been found for setting in current task type, return early
  if (!isEmpty(settings)) { return true; }

  // otherwise, need to check for setting in all task types

  // make a setting key with no type
  const settingKeyParts = settingKey.split(TYPE_SEPARATOR);
  settingKeyParts.pop();
  const settingKeyNoType = settingKeyParts.join(TYPE_SEPARATOR);

  // find type for which setting exists
  const placedForType = find(ALL_TYPES, function(taskType) {
    const typedSettingKey = makeKeyForType(settingKeyNoType, taskType);
    return !isEmpty( UiSettings.get(typedSettingKey));
  });

  return (placedForType != null);
};

const isPractice = task => includes(PRACTICES, task.type);

const stepMapOneTimeCard = function(condition, type, settingKey, isAvailable, task, step, stepIndex) {
  const settingKeyForTaskType = makeKeyForType(settingKey, task.type);

  if (hasBeenPlaced(settingKeyForTaskType)) {
    if (isPlacedHere(settingKeyForTaskType, step)) {
      return makeStep(task, { type }, stepIndex);
    }
  } else if (isAvailable && condition(task, step, stepIndex)) {
    let settings = {
      stepId: step.id,
      taskId: task.id,
    };

    settings = makeUiSettings(settings);
    UiSettings.set(settingKeyForTaskType, settings);

    return makeStep(task, { type }, stepIndex);
  }
};

const stepMapOneTimeCardForGroup = function(group, condition, isAvailable, task, step, stepIndex) {
  const type = INTRO_ALIASES[group];
  const settingKey = SETTING_KEYS[group];
  if (some([type, settingKey, group], isNil)) { return null; }
  return stepMapOneTimeCard(condition, type, settingKey, isAvailable, task, step, stepIndex);
};


const befores = {};

const isReview = (task, step) => get(find(task.steps, function(step) {
  includes(step.labels, REVIEW_LABEL)
}), 'id') === step.id;

const isSpacedPractice = (task, step) => get(find(task.steps, { group: SPACED_PRACTICE_GROUP }), 'id') === step.id;

const isPersonalized = (task, step) => get(find(task.steps, { group: PERSONALIZED_GROUP }), 'id') === step.id;

// TODO for future implementation of instructions card.
// befores['intro'] = (task, step, stepIndex) ->
//   makeStep(task, {type: 'task-intro'}, stepIndex)

befores[INDIVIDUAL_REVIEW] = function(task, step, stepIndex) {
  if (includes(['reading', 'homework'], task.type) && isReview(task, step, stepIndex)) {
    return makeStep(task, { type: INTRO_ALIASES[INDIVIDUAL_REVIEW] }, stepIndex);
  }
  return null;
};

befores[SPACED_PRACTICE_GROUP] = function(task, step, stepIndex, isAvailable) {

  if (isPractice(task)) { return null; }

  if (task.type === 'reading') {
    if (isSpacedPractice(task, step, stepIndex)) {
      return makeStep(task, { type: INTRO_ALIASES[SPACED_PRACTICE_GROUP] }, stepIndex);
    }
  }
  return stepMapOneTimeCardForGroup(
    SPACED_PRACTICE_GROUP,
    isSpacedPractice,
    isAvailable,
    ...arguments
  );
};


befores[PERSONALIZED_GROUP] = function(task, step, stepIndex, isAvailable) {

  if (isPractice(task)) { return null; }

  return stepMapOneTimeCardForGroup(
    PERSONALIZED_GROUP,
    isPersonalized,
    isAvailable,
    ...arguments
  );
};

// to gather for multiparts to have one intro two-step card before the full
// multipart.
const gatherFollowingParts = function(task, step, stepIndex) {
  const { content_url } = step;
  const parts = [step.content.questions];
  if (!step.is_in_multipart) { return flatten(parts); }

  each(task.steps, function(stepCheck, checkIndex) {
    if ((checkIndex > stepIndex) &&
      stepCheck.is_in_multipart &&
      (stepCheck.content_url === content_url)) {
      parts.push(stepCheck.content.questions);
    }
  });

  return flatten(parts);
};

befores[TWO_STEP_ALIAS] = function(task, step, stepIndex, isAvailable) {
  const isTwoStep = function(task, step, stepIndex) {
    if (!get(step, 'content.questions', false)) { return null; }

    const stepQuestions = gatherFollowingParts(task, step, stepIndex);

    return some(stepQuestions, question =>
      includes(question.formats, 'free-response') &&
        !isEmpty(
          intersection(question.formats, ['multiple-choice', 'true-false', 'fill-in-the-blank'])
        )
    );
  };

  return stepMapOneTimeCard(
    isTwoStep,
    INTRO_ALIASES[TWO_STEP_ALIAS],
    SETTING_KEYS[TWO_STEP_ALIAS],
    isAvailable,
    ...arguments
  );
};

const afters = {
  ['end'](task, step, stepIndex) {
    if (stepIndex === (task.steps.length - 1)) { return makeStep(task, { type: 'end', labels: ['summary'] }, stepIndex); }
    return null;
  },
};

const stepMappers = flatten([
  values(befores),
  makeStep,
  values(afters),
]);

const mapSteps = task =>
  compact(
    flatten(
      map((task.steps), (step, stepIndex) =>
        map(stepMappers, function(stepMapper) {
          const lastComplete = findLastIndex(task.steps, { is_completed: true });
          const latestIncomplete = lastComplete + 1;

          const isAvailable = includes(SEE_AHEAD_ALLOWED, task.type) || (stepIndex <= latestIncomplete);

          const stepInfo = stepMapper(task, step, stepIndex, isAvailable);
          if (stepInfo) { extend(stepInfo, { isAvailable }); }

          return stepInfo;
        })
      )
    )
  )
;

export { mapSteps };
