import UX from '../../../src/screens/task/ux';
import Homework from '../../../src/screens/task/homework';
import { Factory, C, FakeWindow, TestRouter, TimeMock } from '../../helpers';

describe('Reading Tasks Screen', () => {
  let props;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    const task = Factory.studentTasks({
      count: 1,
      attributes: { type: 'homework' },
    }).array[0];

    props = {
      windowImpl: new FakeWindow(),
      ux: new UX({ task, router: new TestRouter() }),
    };
  });

  it('matches snapshot', () => {
    expect(<C><Homework {...props} /></C>).toMatchSnapshot();
  });

  it('renders value props', () => {
    props.ux._task.steps.unshift({ type: 'two-step-intro' });
    props.ux._stepIndex = 0;
    const h = mount(<C><Homework {...props} /></C>);
    expect(h).toHaveRendered('TwoStepValueProp');
    h.unmount();
  });
});
