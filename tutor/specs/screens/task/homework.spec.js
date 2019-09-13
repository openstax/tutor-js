import UX from '../../../src/screens/task/ux';
import Homework from '../../../src/screens/task/homework';
import { Factory, C, FakeWindow, TestRouter, TimeMock } from '../../helpers';

describe('Reading Tasks Screen', () => {
  let props;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    const task = Factory.studentTask({
      type: 'homework', stepCount: 5,
    });

    props = {
      windowImpl: new FakeWindow(),
      ux: new UX({ task, course: Factory.course(), history: new TestRouter().history }),
    };
  });

  it('matches snapshot', () => {
    expect(<C><Homework {...props} /></C>).toMatchSnapshot();
  });

  it('renders value props', () => {
    const h = mount(<C><Homework {...props} /></C>);
    expect(props.ux.currentStep.type).toEqual('two-step-intro');
    expect(h).toHaveRendered('TwoStepValueProp');
    h.unmount();
  });

  it('renders task with placeholders', () => {
    props.ux.task.steps.forEach(s => s.type = 'placeholder');
    const h = mount(<C><Homework {...props} /></C>);
    expect(h).toHaveRendered('IndividualReview');
    props.ux.goForward();
    expect(h).toHaveRendered('LoadingCard');
    props.ux.currentStep.api.requestCounts.read = 1;
    expect(h).toHaveRendered('PlaceHolderTaskStep');
    h.unmount();
  });

});
