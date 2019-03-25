import UX from '../../../src/screens/task/ux';
import Homework from '../../../src/screens/task/homework';
import { Factory, FakeWindow, TestRouter } from '../../helpers';

describe('Reading Tasks Screen', () => {
  let props;

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
    expect(<Homework {...props} />).toMatchSnapshot();
  });

  it('render as loading', () => {
    props.ux.goToStep(1);
    props.ux.currentStep.isFetched = false;
    const h = mount(<Homework {...props} />);
    expect(h).toHaveRendered('ContentLoader');
    h.unmount();
  });

  it('renders content', () => {
    const h = mount(<Homework {...props} />);
    expect(h).not.toHaveRendered('ContentLoader');
    h.unmount();
  });

  it('renders value props', () => {
    props.ux._task.steps.unshift({ type: 'two-step-intro' });
    props.ux._stepIndex = 0;
    const h = mount(<Homework {...props} />);
    expect(h).toHaveRendered('TwoStepValueProp');
    h.unmount();
  });
});
