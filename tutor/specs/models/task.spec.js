import Task from '../../src/models/task';
import TaskUI from '../../src/models/task/ui';
import bootstrapTaskModels from '../../api/tasks/bootstrap-models';
import { range } from 'lodash';

describe('Task Model', () => {

  beforeEach(() => bootstrapTaskModels(range(1, 4)));

  it('can be created', () => {
    const task = new Task({ id: 42 });
    expect(task).toBeInstanceOf(Task);
    expect(task.steps).toHaveLength(0);
  });

  it('sets steps', () => {
    const task = Task.forId('3');
    expect(task.steps).toHaveLength(1);
  });

});
