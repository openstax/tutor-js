import { Factory, ld } from '../../helpers';
import * as M from '../../../src/screens/task/ux-task-manipulations';

jest.mock('shared/model/ui-settings', () => ({
  get() { return false; },
}));

describe('Task Manipulations', () => {

  function createTask({ type }) {
    const task = Factory.studentTask({ type, stepCount: 10 });
    return { task, steps: task.steps };
  }

  it('insertIndividiualReview', () => {
    const t = createTask({ type: 'reading' });
    t.steps[7].labels = ['review'];
    const { steps } = M.insertIndividiualReview(t);
    expect(steps[7]).toMatchObject({ type: 'individual-review-intro' });
    expect(steps.length).toEqual(11);
  });

  it('value prop card', () => {
    const t = createTask({ type: 'homework' });
    const stepI = ld.findIndex(t.steps, { isTwoStep: true });
    expect(stepI).not.toEqual(-1);
    const { steps } = M.insertValueProp(t);
    expect(steps[stepI]).toMatchObject({ type: 'two-step-intro' });
    expect(steps.length).toEqual(11);
  });

});
