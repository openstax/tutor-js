import ld from 'underscore';
import moment from 'moment';

import { TimeActions, TimeStore } from '../../src/flux/time';
import { TaskActions, TaskStore } from '../../src/flux/task';
import { TaskStepActions, TaskStepStore } from '../../src/flux/task-step';
import { TaskPlanActions, TaskPlanStore } from '../../src/flux/task-plan';
import { StepCard } from '../../src/helpers/policies';

// fake model stuffs for homework, late homework, reading, and practice
const homeworkTaskId = 6;
import homework_model from '../../api/tasks/6.json';
homework_model.due_at = moment(TimeStore.getNow()).add(1, 'year').toDate();

const late_homework_model = require('../../api/tasks/5.json');
late_homework_model.due_at = moment(TimeStore.getNow()).subtract(1, 'year').toDate();
const lateHomeworkId = 5;

const stepIds = ld.pluck(homework_model.steps, 'id');
let answerId = homework_model.steps[0].content.questions[0].answers[0].id;

const readingTaskId = 4;
const fake_reading_model = require('../../api/tasks/4.json');

const practiceTaskId = 8;
const fake_practice_model = require('../../api/courses/1/practice.json');

const models = {};
models[lateHomeworkId] = late_homework_model;
models[readingTaskId] = fake_reading_model;
models[practiceTaskId] = fake_practice_model;

// fake complete step
const fakeComplete = function(stepId) {
  const taskStep = TaskStepStore.get(stepId);
  taskStep.is_completed = true;
  return TaskStepActions.loaded(taskStep, stepId);
};

// test for exercise step based on task id so that these tests can be repeated for different tasks
const testForExerciseStepWithReview = taskId =>
  function() {
    answerId = null;
    let stepId = null;

    beforeEach(function() {
      TaskActions.loaded(models[taskId], taskId);
      const steps = TaskStore.getSteps(taskId);

      const firstUnansweredExercise = ld.find(steps, step => (step.type === 'exercise') && !step.is_completed);

      answerId = firstUnansweredExercise.content.questions[0].answers[0].id;
      stepId = firstUnansweredExercise.id;

      answerId = answerId;
      return stepId = stepId;
    });

    afterEach(function() {
      TaskActions.reset();
      return TaskStepActions.reset();
    });


    it('should return free-response and multiple-choice as available panels', function() {
      const panels = StepCard.getCardsWithStatus(stepId);
      expect(panels.length).toEqual(3);
      expect(panels[0].name).toEqual('free-response');
      expect(panels[1].name).toEqual('multiple-choice');
      expect(panels[2].name).toEqual('review');
      return undefined;
    });

    it('should allow review for past due homework', function() {
      const canReview = StepCard.canReview(stepId);
      expect(canReview).toEqual(true);
      return undefined;
    });

    it('should return multiple-choice as the panel after free-response answered', function() {
      TaskStepActions.setFreeResponseAnswer(stepId, 'Hello!');
      const panel = StepCard.getCard(stepId);
      expect(panel).toEqual('multiple-choice');
      return undefined;
    });

    it('should return multiple-choice as the panel after multiple-choice answered', function() {
      TaskStepActions.setFreeResponseAnswer(stepId, 'Hello!');
      TaskStepActions.setAnswerId(stepId, answerId);
      const panel = StepCard.getCard(stepId);
      expect(panel).toEqual('multiple-choice');
      return undefined;
    });

    return it('should return review as the panel after completed', function() {
      TaskStepActions.setFreeResponseAnswer(stepId, 'Hello!');
      TaskStepActions.setAnswerId(stepId, answerId);
      fakeComplete(stepId);
      const panel = StepCard.getCard(stepId);
      expect(panel).toEqual('review');
      return undefined;
    });
  }
;


describe('Step Panel Store, homework before due', function() {
  beforeEach(() => TaskActions.loaded(homework_model, homeworkTaskId));

  afterEach(function() {
    TaskActions.reset();
    return TaskStepActions.reset();
  });

  it('should return free-response and multiple-choice as available panels', function() {
    const panels = StepCard.getCardsWithStatus(stepIds[0]);
    expect(panels.length).toEqual(2);
    expect(panels[0].name).toEqual('free-response');
    expect(panels[1].name).toEqual('multiple-choice');
    return undefined;
  });

  it('should return multiple-choice as the panel after free-response answered', function() {
    TaskStepActions.setFreeResponseAnswer(stepIds[0], 'Hello!');
    const panel = StepCard.getCard(stepIds[0]);
    expect(panel).toEqual('multiple-choice');
    return undefined;
  });

  it('should return multiple-choice as the panel after multiple-choice answered', function() {
    TaskStepActions.setFreeResponseAnswer(stepIds[0], 'Hello!');
    TaskStepActions.setAnswerId(stepIds[0], answerId);
    const panel = StepCard.getCard(stepIds[0]);
    expect(panel).toEqual('multiple-choice');
    return undefined;
  });

  return it('should return multiple-choice as the panel after completed', function() {
    TaskStepActions.setFreeResponseAnswer(stepIds[0], 'Hello!');
    TaskStepActions.setAnswerId(stepIds[0], answerId);
    fakeComplete(stepIds[0]);
    const panel = StepCard.getCard(stepIds[0]);
    expect(panel).toEqual('multiple-choice');
    return undefined;
  });
});

describe('Step Panel Store, reading, view non-exercise', function() {
  beforeEach(() => TaskActions.loaded(fake_reading_model, readingTaskId));

  afterEach(function() {
    TaskActions.reset();
    return TaskStepActions.reset();
  });

  return it('should return view panel for a non-exercise step', function() {
    const stepId = 'step-id-4-3';
    const panel = StepCard.getCard(stepId);
    const taskStep = TaskStepStore.get(stepId);
    expect(taskStep.type).not.toEqual('exercise');
    expect(panel).toEqual('view');
    return undefined;
  });
});

describe('Step Panel Store, homework after due', testForExerciseStepWithReview(lateHomeworkId));

describe('Step Panel Store, reading', testForExerciseStepWithReview(readingTaskId));

describe('Step Panel Store, practice', testForExerciseStepWithReview(practiceTaskId));
