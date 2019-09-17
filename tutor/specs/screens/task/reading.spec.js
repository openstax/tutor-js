import UX from '../../../src/screens/task/ux';
import Reading from '../../../src/screens/task/reading';
import { Factory, FakeWindow, ld, TimeMock, C } from '../../helpers';

describe('Reading Tasks Screen', () => {
  let props, history;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    const task = Factory.studentTask({ type: 'reading' });
    props = {
      windowImpl: new FakeWindow(),
      ux: new UX({ task, history, course: Factory.course() }),
    };
    history = {
      push: (url) => {
        props.ux.goToStep(ld.last(url.split('/')), false);
      },
    };
  });

  it('matches snapshot', () => {
    expect(<C><Reading {...props} /></C>).toMatchSnapshot();
  });

  it('render as loading', () => {
    props.ux.goToStep(1);
    props.ux.currentStep.isFetched = false;
    expect(props.ux.currentStep.needsFetched).toBeTruthy();
    const r = mount(<C><Reading {...props} /></C>);
    expect(r).toHaveRendered('ContentLoader');
    r.unmount();
  });

  it('renders content', () => {
    const r = mount(<C><Reading {...props} /></C>);
    expect(r).not.toHaveRendered('ContentLoader');
    r.unmount();
  });

  it('renders value props', () => {
    props.ux._stepIndex = props.ux.steps.findIndex(s=>s.type === 'two-step-intro');
    const r = mount(<C><Reading {...props} /></C>);
    expect(props.ux.currentStep.type).toEqual('two-step-intro');
    expect(r).toHaveRendered('TwoStepValueProp');
    r.unmount();
  });

});
