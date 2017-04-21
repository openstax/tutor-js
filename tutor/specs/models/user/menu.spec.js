import Courses from '../../../src/models/courses-map';
import UserMenu from '../../../src/models/user/menu';
import User from '../../../src/models/user';

import { bootstrapCoursesList, STUDENT_COURSE_ONE_MODEL, TEACHER_COURSE_TWO_MODEL, TEACHER_AND_STUDENT_COURSE_THREE_MODEL, MASTER_COURSES_LIST } from '../../courses-test-data';

const STUDENT_MENU = [
  {
    name: 'dashboard',
    params: { courseId: '1' },
    label: 'Dashboard',
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
  },
];

const TEACHER_MENU = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    params: { courseId: '2' },
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
    params: { courseId: '2' },
    label: 'Teach Another Course'
  },
  {
    name: 'createNewCourse',
    params: { sourceId: '2' },
    label: 'Teach This Course Again'
  },
];

const TEACHER_NO_COURSE_MENU = [
  {
    name: 'createNewCourse',
    options: { className: 'visible-when-debugging unstyled' },
    label: 'Add or Copy a Course',
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
    expect(UserMenu.getRoutes('1')).to.deep.equal(STUDENT_MENU);
    expect(UserMenu.getRoutes('2')).to.deep.equal(TEACHER_MENU);
    User.faculty_status = 'confirmed_faculty';
    expect(UserMenu.getRoutes()).to.deep.equal(TEACHER_NO_COURSE_MENU);
  });
});
