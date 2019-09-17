import { React, Factory, R } from '../../helpers';
import BuilderUX from '../../../src/screens/new-course/ux';
import BuildCourse from '../../../src/screens/new-course/build-course';

describe('CreateCourse: saving new course', function() {

  let ux;
  beforeEach(() => {
    ux = new BuilderUX({
      router: { match: { params: {} } },
      offerings: Factory.offeringsMap({ count: 1 }),
    });
  });

  it('matches snapshot', function() {
    expect.snapshot(<R><BuildCourse ux={ux} /></R>).toMatchSnapshot();
  });
});
