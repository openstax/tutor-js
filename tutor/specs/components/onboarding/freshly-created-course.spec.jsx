import { Wrapper, SnapShot } from '../helpers/component-testing';
import FreshlyCreatedCourse from '../../../src/components/onboarding/freshly-created-course';
import CourseUX from '../../../src/models/course/standard-ux';

describe('Freshly Created Course prompt', () => {

  let ux;

  beforeEach(() => {
    ux = new CourseUX({});
    ux.dismissNag = jest.fn();
  });

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(
      <Wrapper _wrapped_component={FreshlyCreatedCourse} ux={ux} />).toJSON()
    ).toMatchSnapshot();
  });

});
