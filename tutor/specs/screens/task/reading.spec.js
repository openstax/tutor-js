import UX from '../../../src/screens/task/ux';
import Reading from '../../../src/screens/task/reading';
import { Factory, FakeWindow, TestRouter } from '../../helpers';

describe('Reading Tasks Screen', () => {
  let props;

  beforeEach(() => {
    const task = Factory.studentTasks({
      count: 1,
      attributes: { type: 'reading' },
    }).array[0];

    props = {
      windowImpl: new FakeWindow(),
      ux: new UX({ task, router: new TestRouter() }),
    };
  });

  it('matches snapshot', () => {
    expect(<Reading {...props} />).toMatchSnapshot();
  });

  it('render as loading', () => {
    props.ux.goToStep(1);
    props.ux.currentStep.isFetched = false;
    expect(props.ux.currentStep.type).toEqual('exercise');
    expect(props.ux.currentStep.needsFetched).toBeTruthy();
    const r = mount(<Reading {...props} />);
    expect(r).toHaveRendered('ContentLoader');
    r.unmount();
  });

  it('renders content', () => {
    const r = mount(<Reading {...props} />);
    expect(r).not.toHaveRendered('ContentLoader');
    r.unmount();
  });

  it('renders value props', () => {
    props.ux._task.steps.unshift({ type: 'personalized-intro' });
    props.ux._stepIndex = 0;
    const r = mount(<Reading {...props} />);
    expect(r).toHaveRendered('PersonalizedGroup');
    r.unmount();
  });

});
