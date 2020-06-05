import UX from '../../../src/screens/task/ux';
import Homework from '../../../src/screens/task/homework';
import { TestRouter, Factory, C, FakeWindow, ld, TimeMock } from '../../helpers';

describe('Reading Tasks Screen', () => {
  let props, history;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    const task = Factory.studentTask({
      type: 'homework', stepCount: 5,
    });
    history = new TestRouter({
      push: (url) => {
        const id = ld.last(url.split('/'));
        props.ux.goToStepId(id, false);
      },
    }).history;
    props = {
      windowImpl: new FakeWindow(),
      ux: new UX({ task, course: Factory.course(), history }),
    };
  });

  it('matches snapshot', () => {
    expect(<C><Homework {...props} /></C>).toMatchSnapshot();
  });

  it('renders value props', () => {
    const h = mount(<C><Homework {...props} /></C>);
    expect(props.ux.currentStep.type).toEqual('instructions');
    props.ux.goForward();
    expect(props.ux.currentStep.type).toEqual('two-step-intro');
    expect(h).toHaveRendered('TwoStepValueProp');
    h.unmount();
  });

  it('renders task with placeholders', () => {
    props.ux.task.steps.forEach(s => s.type = 'placeholder');
    const h = mount(<C><Homework {...props} /></C>);
    expect(h).toHaveRendered('Instructions');
    props.ux.goForward();
    expect(h).toHaveRendered('IndividualReview');
    props.ux.isLocked = false;
    props.ux.goForward();
    h.render();
    expect(h).toHaveRendered('LoadingCard');
    props.ux.currentStep.api.requestCounts.read = 1;
    expect(h).toHaveRendered('PlaceHolderTaskStep');
    h.unmount();
  });
});
