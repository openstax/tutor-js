import UX from '../../../src/screens/task/ux';
import { Factory, TimeMock, TestRouter, ld } from '../../helpers';
import UiSettings from 'shared/model/ui-settings';
jest.mock('shared/model/ui-settings', () => ({
  set: jest.fn(),
  get: jest.fn(() => false),
}));

jest.mock('../../../src/helpers/scroll-to');

describe('Task UX Model', () => {
  let ux;
  let task;

  TimeMock.setTo('2017-10-14T12:00:00.000Z');

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

    // set feedback in future
    ux.task.feedback_at = new Date('2017-12-01T12:00:00.000Z');

    s.save = jest.fn().mockResolvedValue({});
    await ux.onAnswerSave(s, { id: 1 });
    expect(s.save).toHaveBeenCalled();

    expect(ux.scroller.scrollToSelector).toHaveBeenCalledWith(
      `[data-task-step-id="${group.steps[1].id}"]`
    );
  });

  it('stores viewed in UiSettings when unmount', () => {
    ux.viewedInfoSteps.push('two-step-intro');
    ux.isUnmounting();
    expect(UiSettings.set).toHaveBeenCalledWith(
      'has-viewed-two-step-intro', { taskId: ux.task.id },
    );
  });

});
