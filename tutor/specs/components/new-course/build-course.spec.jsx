import { React, SnapShot } from '../helpers/component-testing';

import BuilderUX from '../../../src/models/course/builder-ux';
import BuildCourse from '../../../src/components/new-course/build-course';

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
