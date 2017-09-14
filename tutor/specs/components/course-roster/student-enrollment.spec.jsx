import StudentEnrollment from '../../../src/components/course-roster/student-enrollment';
import { bootstrapCoursesList } from '../../courses-test-data';
import Courses from '../../../src/models/courses-map';
import Renderer from 'react-test-renderer';

describe('Course Settings, enrollment url', () => {

  let props;

  beforeEach(() => {
    bootstrapCoursesList();
    props = {
      courseId: '1',
      period: {
        enrollment_url: '123456',
      },
    };
  });

  it('renders for regular courses', () => {
    const enrollment = mount(<StudentEnrollment {...props} />);
    expect(enrollment).toHaveRendered('StudentEnrollmentLink');
    expect(Renderer.create(<StudentEnrollment {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders for cc courses', () => {
    Courses.get(props.courseId).is_concept_coach = true;
    const enrollment = mount(<StudentEnrollment {...props} />);
    expect(enrollment).toHaveRendered('CCPeriodEnrollmentCode');
    expect(Renderer.create(<StudentEnrollment {...props} />).toJSON()).toMatchSnapshot();
  });

});
