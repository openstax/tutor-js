import StudentAccess from '../../../src/components/course-settings/student-access';
import Renderer from 'react-test-renderer';
import { bootstrapCoursesList } from '../../courses-test-data';

jest.mock('../../../src/helpers/clipboard');

describe('Course Settings, student access', () => {

  let props;
  let course;

  beforeEach(() => {
    course = bootstrapCoursesList().get('2');
    props = {
      course,
    };
  });

  it('renders with only link for non-lms enabled', () => {
    const access = mount(<StudentAccess {...props} />);
    expect(access).toHaveRendered(
      `.direct-links-only input[value="${course.periods[0].enrollment_url_with_details}"]`,
    );
    expect(Renderer.create(<StudentAccess {...props} />).toJSON()).toMatchSnapshot();
  });

  it('renders chooser when lms is enabled', () => {
    course.is_lms_enabling_allowed = true;
    expect(Renderer.create(<StudentAccess {...props} />).toJSON()).toMatchSnapshot();
  });

  it('can switch to links', () => {
    course.is_lms_enabling_allowed = true;
    course.save = jest.fn();
    const access = mount(<StudentAccess {...props} />);
    access.find('.panel.links .panel-heading a').simulate('click');
    expect(course.save).not.toHaveBeenCalled();
    document.querySelector('.modal.warn-before-links .btn-primary').click();
    expect(course.save).toHaveBeenCalled();
    expect(course.is_lms_enabled).toEqual(false);
    expect(Renderer.create(<StudentAccess {...props} />).toJSON()).toMatchSnapshot();
    access.unmount();
  });

  it('can switch to lms', () => {
    course.is_lms_enabling_allowed = true;
    course.save = jest.fn();
    course.lms.key = 'key-123';
    course.lms.secret = 'secret-sshhh';
    course.lms.url = 'test.url.com';
    course.lms.fetch = jest.fn();
    const access = mount(<StudentAccess {...props} />);
    access.find('.panel.lms .panel-heading a').simulate('click');
    expect(course.lms.fetch).toHaveBeenCalled();
    expect(course.save).toHaveBeenCalled();
    expect(course.is_lms_enabled).toEqual(true);
    expect(Renderer.create(<StudentAccess {...props} />).toJSON()).toMatchSnapshot();
    access.unmount();
  });
});
