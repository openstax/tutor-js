import { Wrapper, SnapShot } from 'helpers';
import FreshlyCreatedCourse from '../../../src/components/onboarding/freshly-created-course';
import OnboardingUX from '../../../src/models/course/onboarding/full-course';

describe('Freshly Created Course prompt', () => {

  let ux;

  beforeEach(() => {
    ux = new OnboardingUX({}, {});
    ux.dismissNag = jest.fn();
  });

  it('renders and matches snapshot', () => {
    expect(
      SnapShot.create(<FreshlyCreatedCourse ux={ux} />
    ).toMatchSnapshot();
  });

});
