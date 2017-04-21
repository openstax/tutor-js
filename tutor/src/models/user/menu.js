// coffeelint: disable=no_empty_functions
// import _ from 'lodash';
// import flux from 'flux-react';
// import { CourseListingStore } from './course-listing';
// import { CourseActions, CourseStore } from './course';

// Read the CSRF token from document's meta tag.  If not found, log a warning but proceed
// on the assumption that the server knows what it's doing.
import { observable } from 'mobx';

import { find, pickBy, invoke, each, isFunction, get } from 'lodash';

import User from '../user';
import Courses from '../courses-map';


// TODO consider putting this with policies?  especially when this same data could be used for other
// roles based stuffs?
// Roles listed in ascending order of rank, where admin will have most permissions
const RANKS = [
  'guest',
  'student',
  'teacher',
  'admin',
];

const TEACHER_FACULTY_STATUS = 'confirmed_faculty';

const getRankByRole = function(roleType) {
  const rank = RANKS.indexOf(roleType);
  if (rank < 0) { console.warn(`Warning: ${roleType} does not exist.  Rank of -1 assigned.  Check session status.`); }

  return rank;
};

const ROUTES = {
  dashboard: {
    label: 'Dashboard',
    allowedForCourse(course) { return !!course; },
    roles: {
      default: 'dashboard',
    },
  },
  guide: {
    label: 'Performance Forecast',
    allowedForCourse(course) { return get(course, 'is_concept_coach') !== true; },
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
  course: {
    label: 'Course Settings and Roster',
    roles: {
      teacher: 'courseSettings',
    },
  },
  get_started: {
    label: 'Getting Started',
    allowedForCourse(course) { return get(course, 'is_concept_coach') === true; },
    roles: {
      teacher: 'ccDashboardHelp',
    },
  },
  changeId: {
    label: 'Change Student ID',
    roles: {
      student: 'changeStudentId',
    },
  },
  createCourse: {
    label: 'Teach Another Course',
    roles: {
      teacher: 'createNewCourse',
    },
    allowedForCourse(course) {
      if (course) {
        return course.isTeacher;
      } else {
        return User.isConfirmedFaculty;
      }
    },
    isTeacherOnly: true,
  },
  cloneCourse: {
    label: 'Teach This Course Again',
    params({ courseId }) { return { sourceId: courseId }; },
    roles: {
      teacher: 'createNewCourse',
    },
    isTeacherOnly: true,
  },
  addOrCopyCourse: {
    label: 'Add or Copy a Course',
    options() {
      return { className: Courses.count ? '' : 'visible-when-debugging unstyled' };
    },
    allowedForCourse(course) { return (!course) && User.isConfirmedFaculty; },
    roles: {
      default: 'createNewCourse',
    },
  },
};

const TUTOR_HELP = 'http://openstax.force.com/support?l=en_US&c=Products%3ATutor';
const TUTOR_CONTACT = 'http://openstax.force.com/support/?cu=1&fs=ContactUs&l=en_US&c=Products%3ATutor';
const CONCEPT_COACH_HELP = 'http://openstax.force.com/support?l=en_US&c=Products%3AConcept_Coach';
const CONCEPT_COACH_CONTACT = 'http://openstax.force.com/support/?cu=1&fs=ContactUs&l=en_US&c=Products%3AConcept_Coach';

function getRouteByRole(routeName, menuRole) {
  return ROUTES[routeName].roles[menuRole] || ROUTES[routeName].roles.default;
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
    return find(Courses.array, 'is_concept_coach') ?
      CONCEPT_COACH_HELP : TUTOR_HELP;
  },

  helpLinkForCourseId(courseId) {
    if (!courseId) { return this.helpUrl; }
    const course = Courses.get(courseId);
    return course.is_concept_coach ? CONCEPT_COACH_HELP : TUTOR_HELP;
  },


  getRoutes(courseId) {
    let isTeacher = false, menuRole;
    let course;
    if (courseId) {
      course = Courses.get(courseId);
      ({ isTeacher, primaryRole: { type: menuRole } } = course);
    }
    const options = { courseId, menuRole };
    const validRoutes = pickBy(
      ROUTES, route => (invoke(route, 'allowedForCourse', course) !== false) && (!route.isTeacher || isTeacher)
    );
    const routes = [];

    each(validRoutes, (routeRules, routeName) => {
      const name = getRouteByRole(routeName, menuRole);
      if (!name) { return; }
      const route = { name };
      addRouteProperty(route, 'options', routeRules, options);
      addRouteProperty(route, 'params', routeRules, options, courseId ? { courseId } : null);
      addRouteProperty(route, 'label', routeRules, options);
      routes.push(route);
    });
    return routes;
  },

});

export default UserMenu;
