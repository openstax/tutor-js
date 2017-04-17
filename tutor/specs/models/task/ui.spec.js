import Task from '../../../src/models/task';
import TaskStep from '../../../src/models/task/step';
import TaskUI from '../../../src/models/task/ui';
import bootstrapTaskModels from '../../../api/tasks/bootstrap-models';
import { range } from 'lodash';

describe('Task Model', () => {
  let ui;
  beforeEach(() => {
    bootstrapTaskModels(range(3, 5));
    ui = new TaskUI({ task: Task.forId('4') });
  });

  it('can set forward/back', () => {
    expect(ui.canGoForward).toBeTruthy();
    expect(ui.canGoBackward).toBeFalsy();
    expect(ui.currentStep).toBeInstanceOf(TaskStep);
    expect(ui.currentStep.id).toEqual('step-id-4-1');
    ui.goForward();
    expect(ui.canGoBackward).toBeTruthy();
    expect(ui.canGoForward).toBeTruthy();
    expect(ui.currentStep.id).toEqual('step-id-4-2');
    ui.goBackward();
    expect(ui.currentStep.id).toEqual('step-id-4-1');
    expect(ui.canGoBackward).toBeFalsy();
  });

});
