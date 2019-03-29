import UX from '../../../src/screens/task/ux';
import Reading from '../../../src/screens/task/reading';
import { Factory, FakeWindow, TestRouter, TimeMock } from '../../helpers';

describe('Reading Tasks Screen', () => {
  let props;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    const task = Factory.studentTask({ type: 'reading' });
    props = {
      windowImpl: new FakeWindow(),
      ux: new UX({ task, router: new TestRouter(), course: Factory.course() }),
    };
  });

  it('matches snapshot', () => {
    expect(<Reading {...props} />).toMatchSnapshot();
  });

  it('render as loading', () => {
    props.ux.goToStep(1);
    props.ux.currentStep.isFetched = false;
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
