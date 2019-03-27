import UX from '../../../src/screens/task/ux';
import { Factory, TestRouter, ld } from '../../helpers';
jest.mock('../../../src/helpers/scroll-to');

describe('Task UX Model', () => {
  let ux;
  let task;

  beforeEach(() => {
    task = Factory.studentTask({ type: 'homework', stepCount: 10 });
    task.tasksMap = { course: Factory.course() };
    ux = new UX({ task: task, router: new TestRouter() });
  });

  it('calculates tasks/steps', () => {
    expect(ux.task).toBe(task);
    expect(
      ld.find(ux.steps, { type: 'two-step-intro' }),
    ).not.toBeUndefined();
  });

  it('scrolls to next mpq', async () => {
    const i = 1 + ux.steps.findIndex(s => s.type == 'two-step-intro');
    ux.steps[i+1].uid = ux.steps[i].uid;
    const group = ux.steps[i];
    expect(group.type).toBe('mpq');
    const s = group.steps[0];
    expect(s.multiPartGroup).toBe(group);

    s.saveAnswer = jest.fn().mockResolvedValue({});
    await ux.onAnswerSave(s, { id: 1 });
    expect(s.saveAnswer).toHaveBeenCalled();
    expect(ux.scroller.scrollToSelector).toHaveBeenCalledWith(
      `[data-task-step-id="${group.steps[1].id}"]`
    );
  });

});
