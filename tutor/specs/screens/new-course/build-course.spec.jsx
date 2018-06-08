import { React, SnapShot } from '../../components/helpers/component-testing';
import BuildCourse from '../../../src/screens/new-course/build-course';
import BuilderUX from '../../../src/screens/new-course/ux';

describe('CreateCourse: saving new course', function() {

  let ux;
  beforeEach(() => {
    ux = new BuilderUX();
  });

  it('matches snapshot', function() {
    const component = SnapShot.create(<BuildCourse ux={ux} />).toJSON();
    expect(component).toMatchSnapshot();
  });
});
