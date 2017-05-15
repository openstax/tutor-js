import Courses from '../../../src/models/courses-map';
import UserMenu from '../../../src/models/user/menu';
import User from '../../../src/models/user';
jest.mock('../../../src/models/user', () => ({
  isConfirmedFaculty: true,
}));

import { bootstrapCoursesList, STUDENT_COURSE_ONE_MODEL, TEACHER_COURSE_TWO_MODEL, TEACHER_AND_STUDENT_COURSE_THREE_MODEL, MASTER_COURSES_LIST } from '../../courses-test-data';

const STUDENT_MENU = [
  {
    name: 'myCourses',
    options: { separator: 'after' },
    label: 'My Courses',
  },
  {
    name: 'dashboard',
    params: { courseId: '1' },
    label: 'Dashboard',
  },
  {
    name: 'browseBook',
    params: { courseId: '1' },
    label: 'Browse the Book',
  },
  {
    name: 'viewPerformanceGuide',
    params: { courseId: '1' },
    label: 'Performance Forecast',
  },
  {
    name: 'changeStudentId',
    params: { courseId: '1' },
    label: 'Change Student ID',
    options: { separator: 'after' },
  },
];

const TEACHER_MENU = [
  {
    name: 'myCourses',
    options: { separator: 'after' },
    label: 'My Courses',
  },
  {
    name: 'dashboard',
    label: 'Dashboard',
    params: { courseId: '2' },
  },
  {
    name: 'browseBook',
    params: { courseId: '2' },
    label: 'Browse the Book',
  },
  {
    name: 'viewPerformanceGuide',
    params: { courseId: '2' },
    label: 'Performance Forecast',
  },
  {
    name: 'viewQuestionsLibrary',
    params: { courseId: '2' },
    label: 'Question Library',
  },
  {
    name: 'viewScores',
    label: 'Student Scores',
    params: { courseId: '2' },
  },
  {
    name: 'courseSettings',
    label: 'Course Settings and Roster',
    params: { courseId: '2' },
  },
  {
    name: 'createNewCourse',
    options: { className: '', separator: 'after' },
    params: { courseId: '2' },
    label: 'Create or Copy a Course',
  },
];

const TEACHER_NO_COURSE_MENU = [
  {
    name: 'createNewCourse',
    options: { className: 'visible-when-debugging unstyled', separator: 'after' },
    label: 'Create or Copy a Course',
  },
];

describe('Current User Store', function() {

  beforeEach(function() {
    bootstrapCoursesList();
  });

  afterEach(function() {
    Courses.clear();
  });

  it('computes help URL', () => {
    expect(UserMenu.helpURL).toContain('Tutor');
    expect(UserMenu.helpLinkForCourseId(1)).toContain('Tutor');
    Courses.get(1).is_concept_coach = true;
    expect(UserMenu.helpURL).toContain('Coach');
    expect(UserMenu.helpLinkForCourseId(1)).toContain('Coach');
  });

  it('should return expected menu routes for courses', function() {
    User.isConfirmedFaculty = false;
    expect(UserMenu.getRoutes('1')).to.deep.equal(STUDENT_MENU);
    User.isConfirmedFaculty = true;
    expect(UserMenu.getRoutes('2')).to.deep.equal(TEACHER_MENU);
    Courses.clear();
    expect(UserMenu.getRoutes()).to.deep.equal(TEACHER_NO_COURSE_MENU);
  });
});
