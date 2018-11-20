import { extend, clone, invoke } from 'lodash';

import User from '../../../src/models/user';
import Courses from '../../../src/models/courses-map';

import STUDENT_DASHBOARD_MODEL from '../../../api/courses/1/dashboard.json';
const TEACHER_DASHBOARD_MODEL = STUDENT_DASHBOARD_MODEL;

const STUDENT_DASHROUTE = 'viewStudentDashboard';
const TEACHER_DASHROUTE = 'taskplans';

const STUDENT_MENU = [
  {
    name: 'myCourses',
    label: 'My Courses',
  },
  { label: '' }, // divider has no label
  {
    name: STUDENT_DASHROUTE,
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
  { label: '' }, // divider has no label
  {
    label: 'Get Help',
  },
  {
    label: 'Browse the Book',
  },
];

const TEACHER_MENU = [
  {
    name: 'myCourses',
    label: 'My Courses',
  },
  { label: '' }, // divider has no label
  {
    name: TEACHER_DASHROUTE,
    label: 'Dashboard',
  },
  {
    name: 'viewTeacherPerformanceForecast',
    params: { courseId: '1' },
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
  },
  {
    name: 'courseSettings',
    label: 'Course Settings and Roster',
  },
  {
    label: '', // divider has no label
  },
  {
    name: 'createNewCourse',
    label: 'Create a Course',
  },
  {
    name: 'cloneCourse',
    label: 'Copy this Course',
  },
  {
    label: '', // divider has no label
  },
  {
    label: 'Get Help',
  },
  {
    label: 'Browse the Book',
  },
];


import COURSESldLIST from '../../../api/user/courses.json';
const COURSE_ID = COURSES_LIST[0].id;
import USER_MODEL from '../../../api/user.json';

const USER_ROLE_MODES = {
  teacher: {
    faculty_status: 'confirmed_faculty',
  },
};

const testParams = {
  student: {
    dashboard: STUDENT_DASHBOARD_MODEL,
    dashroute: STUDENT_DASHROUTE,
    menu: STUDENT_MENU,
    dashpath: '/courses/1/list/',
  },

  teacher: {
    dashboard: TEACHER_DASHBOARD_MODEL,
    dashroute: TEACHER_DASHROUTE,
    menu: TEACHER_MENU,
    dashpath: '/courses/1/t/calendar/',
  },

};

export function setupStores(roleType) {
  const roleTestParams = testParams[roleType];
  roleTestParams.user = USER_MODEL;

  if (USER_ROLE_MODES[roleType]) { roleTestParams.user = extend({}, roleTestParams.user, USER_ROLE_MODES[roleType]); }

  const coursesList = clone(COURSES_LIST);
  coursesList[0].roles[0].type = roleType;

  User.update(roleTestParams.user);
  Courses.bootstrap(coursesList);
  invoke( roleTestParams.actions, 'loaded', roleTestParams.dashboard, COURSE_ID);
  return roleTestParams;
}

export function resetStores(roleType) {
  invoke(testParams[roleType].actions, 'reset');
}

const courseModel = COURSES_LIST[0];

export { testParams, USER_MODEL as userModel, courseModel };
