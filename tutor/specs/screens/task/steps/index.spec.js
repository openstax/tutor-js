import { TaskStep } from '../../../../src/screens/task/step';
import { Factory, FakeWindow, ld } from '../../../helpers';
import UX from '../../../../src/screens/task/ux';

jest.mock('../../../../src/screens/task/ux');
jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Tasks Steps', () => {
  let props;

  beforeEach(() => {
    const step = Factory.studentTask({ type: 'homework', stepCount: 1 }).steps[0];
    const ux = new UX();
    Object.assign(ux, {
      viewedInfoSteps: [],
      course: Factory.course(),
      onAnswerChange: jest.fn(),
      canGoForward: true,
      goForward: jest.fn(),
      currentStep: step,
    });
    props = { ux, step, windowImpl: new FakeWindow };
  });

  it('renders loading', () => {
    props.step.isFetched = false;
    expect(props.step.needsFetched).toBeTruthy();
    const s = mount(<TaskStep {...props} />);
    expect(s).toHaveRendered('ContentLoader');
    s.unmount();
  });

  it('renders info cards', () => {
    ld.forEach({
      'two-step-intro': 'TwoStepValueProp',
      'personalized-intro': 'PersonalizedGroup',
      'spaced-practice-intro': 'SpacedPractice',
      'individual-review-intro': 'IndividualReview',
    }, (component, type) => {
      props.step = { type, fetchIfNeeded: jest.fn() };
      const ts = mount(<TaskStep {...props} />);
      expect(props.step.fetchIfNeeded).toHaveBeenCalled();
      expect(ts).toHaveRendered(component);
      ts.unmount();
    });
  });

});
