import { React, Factory } from '../../helpers';
import CourseName from '../../../src/screens/new-course/course-name';
import BuilderUX from '../../../src/screens/new-course/ux';

jest.mock('../../../src/models/user', () => ({
  canCreateCourses: true,
}));

describe('CreateCourse: entering name', function() {

  let ux;

  beforeEach(() => {
    ux = new BuilderUX({
      router: { match: { params: {} } },
      courses: Factory.coursesMap({ count: 1 }),
      offerings: Factory.offeringsMap({ count: 4 }),
    });
  });

  it('matches snapshot', function() {
    expect.snapshot(<CourseName ux={ux} />).toMatchSnapshot();
  });
});
