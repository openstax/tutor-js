import { find, pickBy, invoke, each, isFunction, get, pick } from 'lodash';
import { observable } from 'mobx';

import User from '../user';
import Courses from '../courses-map';
import Payments from '../payments';

const ROUTES = {

  myCourses: {
    label: 'My Courses',
    isAllowed(course) { return !!course; },
    params: () => undefined,
    options: {
      separator: 'after',
    },
  },
  dashboard: {
    label: 'Dashboard',
    isAllowed(course) { return !!course; },
  },
  browseBook: {
    label: 'Browse the Book',
    isAllowed(course) { return !!course; },
  },
  guide: {
    label: 'Performance Forecast',
    isAllowed(course) { return get(course, 'is_concept_coach') !== true; },
    roles: {
      student: 'viewPerformanceGuide',
      teacher: 'viewPerformanceGuide',
    },
  },
  questions: {
    label: 'Question Library',
    roles: {
      teacher: 'viewQuestionsLibrary',
    },
  },
  scores: {
    label: 'Student Scores',
    roles: {
      teacher: 'viewScores',
    },
  },
  courseSettings: {
    label: 'Course Settings',
    roles: {
      teacher: 'courseSettings',
    },
  },
  courseRoster: {
    label: 'Course Roster',
    roles: {
      teacher: 'courseRoster',
    },
  },
  get_started: {
    label: 'Getting Started',
    isAllowed(course) { return get(course, 'is_concept_coach') === true; },
    roles: {
      teacher: 'ccDashboardHelp',
    },
  },
  changeId: {
    label: 'Change Student ID',
    roles: {
      student: 'changeStudentId',
    },
    options: {
      separator: 'after',
    },
  },
  createNewCourse: {
    label: 'Create a Course',
    isAllowed() { return User.isConfirmedFaculty; },
    options({ courseId }) {
      return courseId ? { separator: 'before' } : { separator: 'both' };
    },
  },
  cloneCourse: {
    label: 'Copy this Course',
    params(course) {
      return { sourceId: course.courseId };
    },
    roles: {
      teacher: 'createNewCourse',
    },
    options: {
      key: 'clone-course', separator: 'after',
    },
    isAllowed(course) {
      return !!(course && !course.is_concept_coach && User.isConfirmedFaculty); },
  },
  customer_service: {
    label: 'Customer Service',
    href: '/customer_service',
    isAllowed() { return !!User.is_customer_service; },
  },
  admin: {
    label: 'Admin',
    href: '/admin',
    isAllowed() { return !!User.is_admin; },
  },
  QADashboard: {
    label: 'QA Dashboard',
    isAllowed() { return !!User.is_content_analyst; },
  },
  managePayments: {
    label: 'Manage payments',
    isAllowed() { return Payments.config.is_enabled && Courses.costing.student.any; },
  },
  qaHome: {
    label: 'Content Analyst',
    href: '/content_analyst',
    isAllowed() { return !!User.is_content_analyst; },
  },
  accessibilityStatement: {
    label: 'Accessibility statement',
    params(course) {
      return { courseId: course.courseId };
    },
  },

};

const TUTOR_HELP = 'http://openstax.force.com/support?l=en_US&c=Products%3ATutor';
const TUTOR_CONTACT = 'http://openstax.force.com/support/?cu=1&fs=ContactUs&l=en_US&c=Products%3ATutor';
const CONCEPT_COACH_HELP = 'http://openstax.force.com/support?l=en_US&c=Products%3AConcept_Coach';
const CONCEPT_COACH_CONTACT = 'http://openstax.force.com/support/?cu=1&fs=ContactUs&l=en_US&c=Products%3AConcept_Coach';

const SUPPORT_EMAIL = 'support@openstaxtutor.org';

function getRouteByRole(routeName, menuRole) {
  if (!ROUTES[routeName].roles) { return routeName; }
  return ROUTES[routeName].roles[menuRole];
}

function addRouteProperty(route, property, rules, options, defaults) {
  let value;
  if (isFunction(rules[property])) {
    value = rules[property](options);
  } else {
    value = rules[property] || defaults;
  }
  if (value) {
    route[property] = value;
  }
}


const UserMenu = observable({

  get helpURL() {
    return TUTOR_HELP;
  },

  get supportEmail() {
    return SUPPORT_EMAIL;
  },

  helpLinkForCourseId(courseId) {
    if (!courseId) { return this.helpURL; }
    const course = Courses.get(courseId);
    return course.is_concept_coach ? CONCEPT_COACH_HELP : TUTOR_HELP;
  },

  getRoutes(courseId) {
    let isTeacher = false, menuRole;
    let course;
    if (courseId) {
      course = Courses.get(courseId);
      if (course) {
        ({ isTeacher, primaryRole: { type: menuRole } } = course);
      }
    }
    const options = { courseId, menuRole };
    const validRoutes = pickBy(
      ROUTES, (route, routeName) =>
        (invoke(route, 'isAllowed', course) !== false) &&
        (!route.isTeacher || isTeacher) &&
        getRouteByRole(routeName, menuRole)
    );
    const routes = [];

    each(validRoutes, (routeRules, routeName) => {
      const name = getRouteByRole(routeName, menuRole);
      const route = { name };
      if (routeRules.href){ route.href = routeRules.href; }
      addRouteProperty(route, 'options', routeRules, options);
      addRouteProperty(route, 'params', routeRules, options, courseId ? { courseId } : null);
      addRouteProperty(route, 'label', routeRules, options);
      routes.push(route);
    });
    return routes;
  },

});

export default UserMenu;
