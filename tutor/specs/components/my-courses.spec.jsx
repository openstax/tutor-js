import { SnapShot, Wrapper } from './helpers/component-testing';
import CourseListing from '../../src/components/my-courses';
import { flatten } from 'lodash';
import EnzymeContext from './helpers/enzyme-context';
import Courses from '../../src/models/courses-map';
import User from '../../src/models/user';
import moment from 'moment';
jest.mock('../../src/models/chat');

import { bootstrapCoursesList, STUDENT_COURSE_ONE_MODEL, TEACHER_COURSE_TWO_MODEL, TEACHER_AND_STUDENT_COURSE_THREE_MODEL, MASTER_COURSES_LIST, TUTOR_HELP, CONCEPT_COACH_HELP, STUDENT_ARCHIVED_COURSE, TEACHER_PAST_COURSE, STUDENT_PAST_COURSE } from '../courses-test-data';

const loadTeacherUser = () => User.faculty_status = 'confirmed_faculty'

describe('My Courses Component', function() {

  beforeEach(bootstrapCoursesList);

  afterEach(() => {
    Courses.clear();
    User.faculty_status = '';
    User.self_reported_role = '';
  });

  it('matches snapshot', function() {
    const component = SnapShot.create(
      <Wrapper _wrapped_component={CourseListing} noReference />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    component.unmount();
  });

  it('renders the listing sorted', function() {
    const wrapper = mount(<CourseListing />, EnzymeContext.withDnD());
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
    const wrapper = mount(<CourseListing />, EnzymeContext.withDnD());
    expect(User.isConfirmedFaculty).toBeTruthy();
    expect(wrapper).toHaveRendered('.my-courses-add-zone');
    wrapper.unmount();
  });

  it('renders controls for course if user is teacher of course', function() {
    loadTeacherUser();
    const wrapper = mount(<CourseListing />, EnzymeContext.withDnD());
    for (let i = 0; i < MASTER_COURSES_LIST.length; i++) {
      const course = MASTER_COURSES_LIST[i];
      if (Courses.get(course.id).isTeacher) {
        expect(wrapper).toHaveRendered(`[data-course-id='${course.id}'] .my-courses-item-controls`);
      }
    }
    wrapper.unmount();
  });

  it('does not render controls for course if user is student of course', function() {
    loadTeacherUser();
    const wrapper = mount(<CourseListing />, EnzymeContext.withDnD());
    for (let i = 0; i < MASTER_COURSES_LIST.length; i++) {
      const course = MASTER_COURSES_LIST[i];
      if (!Courses.get(course.id).isTeacher) {
        expect(wrapper).not.toHaveRendered(`[data-course-id='${course.id}'] .my-courses-item-controls`);
      }
    }
    wrapper.unmount();
  });

  it('renders past courses in past courses listing', function() {
    loadTeacherUser();
    Courses.bootstrap([TEACHER_PAST_COURSE, STUDENT_PAST_COURSE], { clear: true });
    const wrapper = mount(<CourseListing />, EnzymeContext.withDnD());
    expect(wrapper).toHaveRendered(`.my-courses-past [data-course-id='${TEACHER_PAST_COURSE.id}']`);
    expect(wrapper).toHaveRendered(`.my-courses-past [data-course-id='${STUDENT_PAST_COURSE.id}']`);
  });

  it('renders empty courses if course list is empty', function() {
    Courses.clear();
    const wrapper = shallow(<CourseListing />, EnzymeContext.withDnD());
    expect(wrapper).toHaveRendered('EmptyCourses');
  });

  it('renders course appropriate flag', function() {
    const wrapper = mount(<CourseListing />, EnzymeContext.withDnD());
    for (let i = 0; i < MASTER_COURSES_LIST.length; i++) {
      const course = MASTER_COURSES_LIST[i];
      expect(
        wrapper.find(`[data-course-id='${course.id}'] .my-courses-item-brand`).render().text()
      ).equal('OpenStax Tutor');
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

  it('displays popover help for verified instructor without courses', () => {
    Courses.clear();
    loadTeacherUser();
    const wrapper = mount(<CourseListing />, EnzymeContext.withDnD());
    expect(wrapper).toHaveRendered('[data-tour-anchor-id="create-course-zone"]');
    wrapper.unmount();
  });
});
