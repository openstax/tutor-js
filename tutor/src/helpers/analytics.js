import { partial, get } from 'lodash';

import Router from '../helpers/router';
import Courses from '../models/courses-map';

// generate custom event data for routes
const Events = {
  viewTaskStep({ courseId }) {
    // track all work done on a course
    return Analytics.sendEvent('Course', 'Work', { label: courseId });
  },

  viewStudentDashboard({ courseId }) {
    // compare activity between courses
    return Analytics.sendEvent('Student', 'Dashboard', { label: courseId });
  },
};

// a bit shorter helper methods
const isTeacher = courseId => get(Courses.get(courseId), 'currentRole.isTeacher', false);
const getRole = function(courseId) {
  if (Courses.get(courseId).is_teacher) { return 'teacher'; } else { return 'student'; }
};

const assignmentTypeTranslator = function(assignmentType, { courseId, id }) {
  const newOrEdit = id === 'new' ? 'create' : 'edit';
  return `/teacher/assignment/${newOrEdit}/${assignmentType}/${courseId}`;
};

function viewReferenceBook({ courseId, pageId }) {
  const url = `/reference-view/${courseId}`;
  if (!pageId) {
    return url;
  }
  const course = Courses.get(courseId);
  const page = course.referenceBook.pages.byId.get(pageId);
  return page ? `${url}/section/${page.chapter_section.key}` : url;
}

// Translators convert a url like '/foo/bar/123/baz/1' into a simplified one like just '/foo/bar'
const Translators = {
  dashboard({ courseId }) {
    if (isTeacher(courseId)) { return `/teacher/calendar/${courseId}`; } else { return `/student/dashboard/${courseId}`; }
  },
  practiceTopics({ courseId }) { return `/student/practice/${courseId}`; },
  viewPerformanceGuide({ courseId }) {
    return `/${getRole(courseId)}/performance-forecast/${courseId}`;
  },
  calendarByDate({ courseId }) { return `/teacher/calendar/${courseId}`; },
  viewGradebook({ courseId }) { return `/teacher/student-scores/${courseId}`; },
  courseSettings({ courseId }) { return `/teacher/roster/${courseId}`; },
  editAssignment: partial(assignmentTypeTranslator, 'assignment'),
  calendarViewPlanStats({ courseId }) { return `/teacher/metrics/quick/${courseId}`; },
  reviewTask({ courseId }) { return `/teacher/metrics/review/${courseId}`; },
  viewReferenceBookSection: viewReferenceBook,
  viewReferenceBookPage: viewReferenceBook,
  viewReferenceBook,

  // Task steps are viewed by both teacher and student with no difference in params
  viewTaskStep({ courseId }) {
    const course = Courses.get(courseId);
    const role = course ? course.primaryRole.type : 'unknown';
    return `/${role}/task-step/${courseId}`;
  },
};

const TAG_MANAGER_ID = 'GTM-W6N7PB';

let GA = undefined;
let trackerNames = undefined;

var Analytics = {
  // copied from BIT
  initTagManager(w, d, s, l, i) {
    // Disable ESLint rules since we're copying Google's script
    /* eslint-disable one-var, prefer-const, prefer-template */
    w[l] = w[l] || [];
    w[l].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });
    let f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l !== 'dataLayer' ? '&l=' + l : '';
    // Breaks in tests because there are no scripts
    if (f) {
      j.async = true;
      j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    }
  },
  
  // Set the Command Queue (ga) and cache the (possibly multiple) tracker names
  setGa(ga) {
    trackerNames = undefined;
    GA = ga;
    if (GA) {
      GA(function() {
        trackerNames = GA.getAll().map(function(tracker) { return tracker.get('name'); });
      });
      this.initTagManager(window, document, 'script', 'dataLayer', TAG_MANAGER_ID);
    }

    return GA;
  },

  // Calls all trackers with the command and arguments given here
  ga(command, ...params) {
    if (!GA || !trackerNames) { return; }
    trackerNames.forEach((trackerName) => {
      this.realGa(trackerName + '.' + command, ...params);
    });
  },

  // Exists largely for spec mocking
  realGa(...args) {
    GA(...args);
  },

  sendPageView(url) {
    this.ga('send', 'pageview', url);
  },

  recordCourseDimension(courseId) {
    const course = Courses.get(courseId);
    if (course) {
      this.ga('set', 'dimension1', course.appearance_code);
    }
  },

  onNavigation(path) {
    if (!GA) { return; }
    const route = Router.currentMatch(path);

    if (!route) {
      this.sendPageView(`/not-found${path}`);
      return;
    }
    const { courseId } = route.params;
    if (courseId) { this.recordCourseDimension(courseId); }
    const translatedPath = Translators[route.entry.name] ?
      Translators[route.entry.name]( route.params ) : route.pathname;

    this.ga('set', 'page', translatedPath);
    // if we're also going to send custom events then we set the page
    if (Events[route.entry.name]) {
      Events[route.entry.name]( route.params );
    }

    this.sendPageView(); // url's not needed since it was set before events
  },

  sendEvent(category, action, attrs = {}) {
    this.ga('send', 'event', category, action, attrs.label, attrs.value);
  },
};

export default Analytics;
