import { C, EnzymeContext } from '../helpers';
import CourseListing from '../../src/components/my-courses';
import { flatten } from 'lodash';
import Courses from '../../src/models/courses-map';
import User from '../../src/models/user';
import Offerings from '../../src/models/course/offerings/index';
import OFFERINGS from '../../api/offerings';
import moment from 'moment';
jest.mock('../../src/models/chat');

import { bootstrapCoursesList, STUDENT_COURSE_ONE_MODEL, TEACHER_COURSE_TWO_MODEL, TEACHER_AND_STUDENT_COURSE_THREE_MODEL, MASTER_COURSES_LIST, TUTOR_HELP, CONCEPT_COACH_HELP, STUDENT_ARCHIVED_COURSE, TEACHER_PAST_COURSE, STUDENT_PAST_COURSE } from '../courses-test-data';

const loadTeacherUser = () => User.faculty_status = 'confirmed_faculty';

const loadOfferings = () => {
  Offerings.onLoaded({ data: OFFERINGS });
};

describe('My Courses Component', function() {

  beforeEach(bootstrapCoursesList);

  afterEach(() => {
    Courses.clear();
    User.faculty_status = '';
    User.school_type = 'college';
    User.self_reported_role = '';
  });

  it('matches snapshot', function() {
    expect.snapshot(<C><CourseListing /></C>).toMatchSnapshot();
  });

  it('renders the listing sorted', async function() {
    const wrapper = mount(<C><CourseListing /></C>);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    for (let i = 0; i < MASTER_COURSES_LIST.length; i++) {
      const course = MASTER_COURSES_LIST[i];
      expect(wrapper).toHaveRendered(`.my-courses [data-course-id='${course.id}']`);
    }
    wrapper.unmount();
  });

  it('renders the listing without archived courses', function() {
    Courses.bootstrap(flatten([MASTER_COURSES_LIST, STUDENT_ARCHIVED_COURSE]), { clear: true });
    const wrapper = shallow(<CourseListing />, EnzymeContext.withDnD());
    expect(wrapper).not.toHaveRendered(`CourseLink[courseId='${STUDENT_ARCHIVED_COURSE.id}']`);
    wrapper.unmount();
  });

  it('renders add course action if user is teacher', function() {
    loadTeacherUser();
    const wrapper = mount(<C><CourseListing /></C>);
    expect(User.isConfirmedFaculty).toBeTruthy();

    expect(wrapper).toHaveRendered('.my-courses-add-zone');
    wrapper.unmount();
  });

  it('renders controls for course if user is teacher of course', function() {
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

  it('renders past courses in past courses listing', function() {
    loadTeacherUser();
    Courses.bootstrap([TEACHER_PAST_COURSE, STUDENT_PAST_COURSE], { clear: true });
    const wrapper = mount(<C><CourseListing /></C>);
    expect(wrapper).toHaveRendered(`.my-courses-past [data-course-id='${TEACHER_PAST_COURSE.id}']`);
    expect(wrapper).toHaveRendered(`.my-courses-past [data-course-id='${STUDENT_PAST_COURSE.id}']`);
  });

  it('renders empty courses if course list is empty', function() {
    Courses.clear();
    const wrapper = shallow(<CourseListing />, EnzymeContext.withDnD());
    expect(wrapper).toHaveRendered('EmptyCourses');
  });

  it('renders course appropriate flag', function() {
    const wrapper = mount(<C><CourseListing /></C>);
    for (let i = 0; i < MASTER_COURSES_LIST.length; i++) {
      const course = MASTER_COURSES_LIST[i];
      expect(
        wrapper.find(`[data-course-id='${course.id}'] p.my-courses-item-brand`).render().text()
      ).toEqual('OpenStax Tutor');
    }
  });

  it('redirects to student dashboard for a single student course', function() {
    Courses.clear();
    Courses.bootstrap([STUDENT_COURSE_ONE_MODEL], { clear: true });
    const c = Courses.get(STUDENT_COURSE_ONE_MODEL.id);
    c.ends_at = moment().add(1, 'week');
    c.starts_at = moment().subtract(1, 'week');
    const wrapper = shallow(<CourseListing />, EnzymeContext.withDnD());
    expect(wrapper).toHaveRendered('Redirect[to="/course/1"]');
  });

  it('displays pending screen', () => {
    Courses.clear();
    User.self_reported_role = 'instructor';
    const wrapper = shallow(<CourseListing />, EnzymeContext.withDnD());
    expect(wrapper).toHaveRendered('PendingVerification');
    wrapper.unmount();
  });

  describe('non college instructors', () => {
    it('locks them out and displays message when they hve no courses', () => {
      loadTeacherUser();
      Courses.clear();
      User.school_type = 'unknown_school_type';
      const wrapper = shallow(<CourseListing />, EnzymeContext.withDnD());
      expect(wrapper).toHaveRendered('NoHSTeachers');
      wrapper.unmount();
    });

    it('hides previews if they have courses', () => {
      loadTeacherUser();
      const wrapper = mount(<C><CourseListing /></C>);
      expect(wrapper).toHaveRendered('MyCoursesPreview MyCoursesBasic');
      User.school_type = 'unknown_school_type';
      expect(wrapper).not.toHaveRendered('MyCoursesPreview MyCoursesBasic');
      wrapper.unmount();
    });
  });
});
