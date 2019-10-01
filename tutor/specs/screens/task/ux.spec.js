import UX from '../../../src/screens/task/ux';
import { Factory, TimeMock, TestRouter, ld, deferred } from '../../helpers';
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
    ux = new UX({ task: task, history: new TestRouter().history });
  });

  it('calculates tasks/steps', () => {
    expect(ux.task).toBe(task);
    expect(
      ld.find(ux.steps, { type: 'two-step-intro' }),
    ).not.toBeUndefined();
  });

  it('groups steps', () => {
    const i = 1 + ux.steps.findIndex(s => s.type == 'two-step-intro');
    // steps with null uid do not group
    ux.steps[i+1].uid = ux.groupedSteps[i].uid = undefined;
    expect(ux.groupedSteps[i].type).not.toBe('mpq');

    ux.steps[i+1].uid = ux.groupedSteps[i].uid = '123@4';
    const group = ux.groupedSteps[i];
    expect(group.type).toBe('mpq');
    expect(group.steps.map(s=>s.id)).toEqual([
      ux.steps[i].id,
      ux.steps[i+1].id,
    ]);
  });

  it('loads feedback and fixes scrolling if past that mpq', async () => {
    const i = 1 + ux.steps.findIndex(s => s.type == 'two-step-intro');
    ux.steps[i+1].uid = ux.groupedSteps[i].uid;
    const group = ux.groupedSteps[i];
    group.steps.forEach(s => s.fetchIfNeeded = jest.fn());

    const s = group.steps[0];
    const nextS = group.steps[1];
    expect(s.multiPartGroup).toBe(group);

    // set feedback in past
    ux.task.feedback_at = new Date('2017-10-13T12:00:00.000Z');

    s.save = jest.fn().mockResolvedValue({});
    ux.moveToStep(nextS);
    await ux.onAnswerSave(s, { id: 1 });
    expect(s.save).toHaveBeenCalled();
    expect(ux.scroller.scrollToSelector).toHaveBeenCalledWith(
      `[data-task-step-id="${nextS.id}"]`, { immediate: true, deferred: false }
    );
    group.steps.forEach(s => {
      expect(s.fetchIfNeeded).toHaveBeenCalled();
    });
  });

  it('calculates question numbers for homeworks', () => {
    expect(ux.questionNumberForStep(task.steps[0])).toBe(1);
    expect(ux.questionNumberForStep({})).toBeNull();
    ux.task.type = 'reading';
    expect(ux.questionNumberForStep(task.steps[0])).toBeNull();
  });

  it('stores viewed in UiSettings when unmount', () => {
    ux.viewedInfoSteps.push('two-step-intro');
    ux.isUnmounting();
    expect(UiSettings.set).toHaveBeenCalledWith(
      'has-viewed-two-step-intro', { taskId: ux.task.id },
    );
  });

  it('fetches steps or task when index changes', () => {
    const step = ux.steps[3];
    step.fetchIfNeeded = jest.fn();
    ux.task.fetch = jest.fn(() => Promise.resolve());

    ux.moveToStep(step);
    expect(step.fetchIfNeeded).toHaveBeenCalledTimes(1);
    expect(ux.task.fetch).not.toHaveBeenCalled();
    ux._stepIndex = 0;

    ux.task.fetch.mockImplementation(() => {
      ux.task.steps = [{ type: 'reading' }];
      ux.task.steps[0].fetchIfNeeded = jest.fn();
      return Promise.resolve();
    });
    step.type = 'placeholder';
    ux.moveToStep(step);

    return deferred(() => {
      expect(ux.task.fetch).toHaveBeenCalled();
      expect(ux.task.steps).toHaveLength(1);
      expect(ux.task.steps[0].fetchIfNeeded).toHaveBeenCalled();
    });
  });

  it('deals with tasks without steps such as events', () => {
    task = Factory.studentTask({ type: 'event', stepCount: 0 });
    expect(task.steps).toHaveLength(0);
    task.tasksMap = { course: Factory.course() };
    ux = new UX({ task: task, history: new TestRouter().history });
    expect(ux.currentStep).toBeNull();
  });

  it('calls becomes on student role when it matches', () => {
    ux.course.roles[0].type = 'teacher';
    ux.course.roles.push({ id: 99, type: 'teacher_student' });
    expect(ux.course.roles.teacher).toBeTruthy();
    expect(ux.course.roles.teacherStudent).toBeTruthy();
    ux._task.students.push({ role_id: 99 });
    expect(ux.course.current_role_id).toEqual(ux.course.roles[0].id);
    ux.becomeStudentIfNeeded();
    expect(ux.course.current_role_id).toEqual(99);
  });

  it('records in history when going to step', () => {
    ux.goToStep(1);
    expect(ux.history.push).toHaveBeenCalledWith(`/course/${ux.course.id}/task/${ux.task.id}/step/2`);
    ux.goToStep(2, false);
    expect(ux.history.push).toHaveBeenCalledTimes(1);
    const i = 1 + ux.steps.findIndex(s => s.type == 'two-step-intro');
    ux.steps[i+1].uid = ux.groupedSteps[i].uid = '123@4';
    const group = ux.groupedSteps[i];
    expect(group.type).toBe('mpq');
    expect(ux.stepGroupInfo.grouped).toBe(true);
    ux.stepGroupInfo.group.steps.forEach(
      s => s.api.requestCounts.read = 1
    );
    ux.goToStep(i + 1, false);
    expect(ux.history.push).toHaveBeenCalledTimes(1);
    return deferred(() => {
      expect(ux.scroller.scrollToSelector).toHaveBeenCalledWith(
        `[data-task-step-id="${ux.currentStep.id}"]`,
        { deferred: true, immediate: false },
      );
    });

  });
});
