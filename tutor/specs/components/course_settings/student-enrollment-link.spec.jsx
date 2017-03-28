import StudentEnrollmentLink from '../../../src/components/course-settings/student-enrollment-link';
import { bootstrapCoursesList } from '../../courses-test-data';
import Courses from '../../../src/models/courses';
import Renderer from 'react-test-renderer';

describe('Course Settings, student enrollment link', () => {

  let props;

  beforeEach(() => {
    bootstrapCoursesList();
    props = {
      course: Courses.get('1'),
      period: {
        enrollment_url: '123456',
      },
    };
  });

  it('renders with url', () => {
    const enrollment = mount(<StudentEnrollmentLink {...props} />);
    expect(enrollment).toHaveRendered('input[value="123456"]');
    expect(Renderer.create(<StudentEnrollmentLink {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders with disabled url for preview course', () => {
    props.course.is_preview = true;
    const enrollment = mount(<StudentEnrollmentLink {...props} />);
    console.log(enrollment.debug())
//    expect(enrollment).toHaveRendered('input[value="123456"]');
//    expect(Renderer.create(<StudentEnrollmentLink {...props} />).toJSON()).toMatchSnapshot();
  });

});
