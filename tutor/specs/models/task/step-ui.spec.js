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

  it('calculates component', () => {
    //console.log(ui.currentStepUI.component.displayName)
    expect(ui.currentStepUI.component).toBeDefined()
  });

});
