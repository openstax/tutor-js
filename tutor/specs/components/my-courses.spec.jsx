import { C, TimeMock, action, fetchMock } from '../helpers';
import CourseListing from '../../src/components/my-courses';
import { flatten } from 'lodash';
import { currentCourses, currentUser } from '../../src/models';
import moment from 'moment';
import { bootstrapCoursesList, STUDENT_COURSE_ONE_MODEL, TEACHER_COURSE_TWO_MODEL, TEACHER_AND_STUDENT_COURSE_THREE_MODEL, MASTER_COURSES_LIST, TUTOR_HELP, CONCEPT_COACH_HELP, STUDENT_ARCHIVED_COURSE, TEACHER_PAST_COURSE, STUDENT_PAST_COURSE } from '../courses-test-data';

jest.mock('../../src/helpers/chat');
jest.mock('react-floater', () => () => null);

const User = currentUser;
const Courses = currentCourses;

const loadTeacherUser = action(() => {
    User.faculty_status = 'confirmed_faculty';
    User.can_create_courses = true;
})

describe('My Courses Component', function() {

    const now = TimeMock.setTo('2021-01-15T12:00:00.000Z');

    beforeEach(async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ ok: true }))
        bootstrapCoursesList()
    });

    afterEach(action(() => {
        Courses.clear();
        User.fetch = jest.fn();
        User.faculty_status = '';
        User.created_at = now;
        User.school_type = 'college';
        User.self_reported_role = '';
    }));


    it('matches snapshot', function() {
        expect.snapshot(<C><CourseListing /></C>).toMatchSnapshot();
    });

    it('re-fetches courses if the back button is used', () => {
        currentCourses.fetch = jest.fn(() => Promise.resolve());

        let wrapper = mount(<C><CourseListing /></C>);
        expect(currentCourses.fetch).not.toHaveBeenCalled();
        wrapper.unmount();

        wrapper = mount(<C><CourseListing history={{ action: 'POP' }} /></C>);
        expect(currentCourses.fetch).toHaveBeenCalled();
        wrapper.unmount();
    });

    it('re-reloads if the back button is used after logging out', () => {
        delete window.location;
        window.location = { reload: jest.fn() };

        currentCourses.fetch = jest.fn(() => { throw('Logged out')} );

        let wrapper = mount(<C><CourseListing history={{ action: 'POP' }} /></C>);
        expect(currentCourses.fetch).toHaveBeenCalled();
        expect(window.location.reload).toHaveBeenCalled();
        wrapper.unmount();
    });

    it('renders the listing sorted', function() {
        const wrapper = mount(<C><CourseListing /></C>);
        for (let i = 0; i < MASTER_COURSES_LIST.length; i++) {
            const course = MASTER_COURSES_LIST[i];
            expect(wrapper).toHaveRendered(`.my-courses [data-course-id='${course.id}']`);
        }
        wrapper.unmount();
    });

    it('renders the listing without archived courses', function() {
        Courses.bootstrap(flatten([MASTER_COURSES_LIST, STUDENT_ARCHIVED_COURSE]), { clear: true });
        const wrapper = mount(<C><CourseListing /></C>);
        expect(wrapper).not.toHaveRendered(`CourseLink[courseId='${STUDENT_ARCHIVED_COURSE.id}']`);
        wrapper.unmount();
    });

    it('renders add course action if user is teacher', function() {
        loadTeacherUser();
        const wrapper = mount(<C><CourseListing /></C>);
        expect(User.canCreateCourses).toBeTruthy();

        expect(wrapper).toHaveRendered('.my-courses-add-zone');
        wrapper.unmount();
    });

    xit('renders controls for course if user is teacher of course', function() {
        loadTeacherUser();
        const wrapper = mount(<C><CourseListing /></C>);
        for (let i = 0; i < MASTER_COURSES_LIST.length; i++) {
            const course = MASTER_COURSES_LIST[i];
            if (Courses.get(course.id).currentRole.isTeacher) {
                expect(wrapper).toHaveRendered(`[data-course-id='${course.id}'] .my-courses-item-controls`);
            }
        }
        wrapper.unmount();
    });

    it('does not render controls for course if user is student of course', function() {
        loadTeacherUser();
        const wrapper = mount(<C><CourseListing /></C>);
        for (let i = 0; i < MASTER_COURSES_LIST.length; i++) {
            const course = MASTER_COURSES_LIST[i];
            if (!Courses.get(course.id).currentRole.isTeacher) {
                expect(wrapper).not.toHaveRendered(`[data-course-id='${course.id}'] .my-courses-item-controls`);
            }
        }
        wrapper.unmount();
    });

    xit('renders past courses in past courses listing', function() {
        loadTeacherUser();
        Courses.bootstrap([TEACHER_PAST_COURSE, STUDENT_PAST_COURSE], { clear: true });
        const wrapper = mount(<C><CourseListing /></C>);
        expect(wrapper).toHaveRendered(`.my-courses-past [data-course-id='${TEACHER_PAST_COURSE.id}']`);
        expect(wrapper).toHaveRendered(`.my-courses-past [data-course-id='${STUDENT_PAST_COURSE.id}']`);
    });

    it('renders empty courses if course list is empty', action(() => {() => {
        Courses.clear();
        const wrapper = mount(<C><CourseListing /></C>);
        expect(wrapper).toHaveRendered('EmptyCourses');
    }}));

    it('redirects to student dashboard for a single student course', action(() => {() => {
        Courses.clear();
        Courses.bootstrap([STUDENT_COURSE_ONE_MODEL], { clear: true });
        const c = Courses.get(STUDENT_COURSE_ONE_MODEL.id);
        c.ends_at = moment().add(1, 'week');
        c.starts_at = moment().subtract(1, 'week');
        User.can_create_courses = true;
        const wrapper = mount(<C><CourseListing /></C>);
        expect(wrapper).not.toHaveRendered('Redirect');
        User.can_create_courses = false;
        expect(wrapper).toHaveRendered('Redirect[to="/course/1"]');
    }}));

    // disabled until we convert instructor my-courses
    xit('displays pending screen', () => {
        Courses.clear();
        User.can_create_courses = false;
        User.self_reported_role = 'instructor';
        const wrapper = mount(<C><CourseListing /></C>);
        expect(wrapper).toHaveRendered('PendingVerification');
        wrapper.unmount();
    });

    // disabled until we convert instructor my-courses
    xdescribe('non-allowed users', () => {
        it('shows empty courses for self reported students', () => {
            Courses.clear();
            User.can_create_courses = false;
            User.self_reported_role = 'student';
            const wrapper = mount(<C><CourseListing /></C>);
            User.created_at = new Date('2021-01-15T12:00:00.000Z') // now
            expect(wrapper).not.toHaveRendered('PendingVerification');
            expect(wrapper).toHaveRendered('EmptyCourses');
            wrapper.unmount();
        });

        it('displays pending screen', () => {
            Courses.clear();
            User.can_create_courses = false;
            User.self_reported_role = 'instructor';
            const wrapper = mount(<C><CourseListing /></C>);
            expect(wrapper).toHaveRendered('PendingVerification');
            wrapper.unmount();
        });
    });

    // disabled until we convert instructor my-courses
    xdescribe('non-allowed users', () => {
        it('shows empty courses for self reported students', () => {
            Courses.clear();
            User.can_create_courses = false;
            User.self_reported_role = 'student';
            const wrapper = mount(<C><CourseListing /></C>);
            User.created_at = new Date('2021-01-15T12:00:00.000Z') // now
            expect(wrapper).not.toHaveRendered('PendingVerification');
            expect(wrapper).toHaveRendered('EmptyCourses');
            wrapper.unmount();
        });

        it('locks instructors out and displays message when they hve no courses', () => {
            User.faculty_status = 'confirmed_faculty';
            User.can_create_courses = false;
            Courses.clear();
            const wrapper = mount(<C><CourseListing /></C>);
            User.created_at = new Date('2021-01-11T12:00:00.000Z')
            expect(wrapper).toHaveRendered('NonAllowedTeachers');
            User.created_at = new Date('2021-01-15T12:00:00.000Z')
            expect(wrapper).not.toHaveRendered('NonAllowedTeachers');
            expect(wrapper).toHaveRendered('PendingVerification');
            wrapper.unmount();
        });

        it('hides previews for self reported instructors who cannot create course', () => {
            User.can_create_courses = true;
            const wrapper = mount(<C><CourseListing /></C>);
            expect(wrapper).toHaveRendered('MyCoursesPreview MyCoursesBasic');
            User.can_create_courses = false;
            expect(wrapper).not.toHaveRendered('MyCoursesPreview MyCoursesBasic');
            wrapper.unmount();
        });
    });
});
