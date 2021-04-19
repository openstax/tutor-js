import StudentAccess from '../../../src/screens/course-settings/student-access';
import { ApiMock, Factory } from '../../helpers'

jest.mock('../../../src/helpers/clipboard');

describe('Course Settings, student access', () => {

    let props;
    let course;

    ApiMock.intercept({
        'lms/courses/\\d+': () => ({
            key: 'key-1234',
            secret: 'secret-1234',
            launch_url: 'launch-url',
            configuration_url: 'config-url-1234',
        }),
    })

    beforeEach(() => {
        course = Factory.course()
        props = {
            course,
        };
    });

    it('renders with only link for non-lms enabled', () => {
        const access = mount(<StudentAccess {...props} />);
        expect(access).toHaveRendered(
            `.direct-links-only input[value="${course.periods[0].enrollment_url_with_details}"]`,
        );
        expect.snapshot(<StudentAccess {...props} />).toMatchSnapshot();
    });

    it('renders chooser when lms is enabled', () => {
        course.is_lms_enabling_allowed = true;
        expect.snapshot(<StudentAccess {...props} />).toMatchSnapshot();
    });

    it('can switch to links', () => {
        course.is_lms_enabled = true
        course.is_lms_enabling_allowed = true;
        course.save = jest.fn();
        const access = mount(<StudentAccess {...props} />);
        access.find('.choice.links').simulate('click');
        expect(course.save).not.toHaveBeenCalled();
        document.querySelector('.modal.warn-before-links .btn-primary').click();
        expect(course.save).toHaveBeenCalled();
        expect(course.is_lms_enabled).toEqual(false);
        expect.snapshot(<StudentAccess {...props} />).toMatchSnapshot();
        access.unmount();
    });

    it('can switch to lms', () => {
        course.is_lms_enabled = false
        course.is_lms_enabling_allowed = true;
        course.save = jest.fn();
        course.lms.key = 'key-123';
        course.lms.secret = 'secret-sshhh';
        course.lms.url = 'test.url.com';
        course.lms.fetch = jest.fn();
        const access = mount(<StudentAccess {...props} />);
        access.find('.choice.lms').simulate('click');
        expect(course.lms.fetch).toHaveBeenCalled();
        expect(course.save).toHaveBeenCalled();
        expect(course.is_lms_enabled).toEqual(true);
        expect.snapshot(<StudentAccess {...props} />).toMatchSnapshot();
        access.unmount();
    });
});
