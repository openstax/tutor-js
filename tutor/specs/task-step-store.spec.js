import { expect } from 'chai';
import moment from 'moment';
import ld from 'underscore';

import { TimeStore } from '../src/flux/time';
import { TaskStepActions, TaskStepStore } from '../src/flux/task-step';

const LoadStepData = function(properties = {}) {
  const step = _.extend({
    id: '1',
    task_id: '5',
    has_recovery: true,
    correct_answer_id: 1,
    answer_id: 2,
  }, properties);
  TaskStepActions.loaded(step, step.id);
  return step;
};

describe('Task Step Store', function() {
  let task = {};

  beforeEach(() =>
    task =
      { due_at: moment(TimeStore.getNow()).add(1, 'minute').toDate() }
  );

  afterEach(() => TaskStepActions.reset());

  return describe('try another', function() {

    it('is allowed if conditions are right', function() {
      const step = LoadStepData();
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.true;
      return undefined;
    });

    it('is false if has_recovery is false', function() {
      const step = LoadStepData({ has_recovery: false });
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.false;
      return undefined;
    });

    it('is false if answer is correct', function() {
      const step = LoadStepData({ correct_answer_id: '2', answer_id: '2' });
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.false;
      return undefined;
    });

    it('checks loading state', function() {
      const step = LoadStepData();
      TaskStepActions.load(step.id);
      expect(TaskStepStore.isLoading(step.id)).to.be.true;
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.false;
      return undefined;
    });

    it('checks saving state', function() {
      const step = LoadStepData();
      TaskStepActions.save(step.id);
      expect(TaskStepStore.isSaving(step.id)).to.be.true;
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.false;
      return undefined;
    });

    it('doesnt work on past due tasks', function() {
      const step = LoadStepData();
      task.due_at = moment(TimeStore.getNow()).subtract(1, 'minute').toDate();
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.false;
      return undefined;
    });

    return it('isRecovering updates when recovering a task', function() {
      const step = LoadStepData();
      expect(TaskStepStore.isRecovering(step.id)).to.be.false;
      TaskStepActions.loadRecovery(step.id);
      expect(TaskStepStore.isRecovering(step.id)).to.be.true;
      expect(TaskStepStore.canTryAnother(step.id, task)).to.be.true;
      TaskStepActions.loadedRecovery({ id: 'RECOVERED_STEP' }, step.id);
      expect(TaskStepStore.isRecovering(step.id)).to.be.true;
      TaskStepActions.loaded({ id: 'RECOVERED_STEP' }, 'RECOVERED_STEP');
      expect(TaskStepStore.isRecovering(step.id)).to.be.false;
      return undefined;
    });
  });
});
