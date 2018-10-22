import { loadAsync, asyncComponent } from './helpers/async-component';
import { getConditionalHandlers } from './helpers/conditional-handlers';
import OnlyCollege from './components/my-courses/no-hs-teachers';

const getMyCourses = function() {
  const { default: MyCourses } = require('./components/my-courses');
  return MyCourses;
};

const NewCourseWizard = asyncComponent(
  () => import('./screens/new-course')
);
const getNewCourseWizard = () => NewCourseWizard;

const TeacherDashboard = asyncComponent(
  () => import('./screens/teacher-dashboard')
);
const getTeacherDashboard = () => TeacherDashboard;

const ReferenceBook = asyncComponent(
  () => import('./screens/reference-book/index.jsx')
);
const getReferenceBook = () => ReferenceBook;
const legacyReferenceBookRedirect = () => LegacyReferenceBookRedirect;

const QAView = asyncComponent(
  () => import('./screens/qa-view/index.jsx')
);
const getQAView = () => QAView;

const getTaskShell = function() {
  const { TaskShell } = require('./components/task');
  return TaskShell;
};

const getReadingShell = function() {
  const { ReadingShell } = require('./components/task-plan');
  return ReadingShell;
};

const getHomeworkShell = function() {
  const { HomeworkShell } = require('./components/task-plan');
  return HomeworkShell;
};

const getExternalShell = function() {
  const { ExternalShell } = require('./components/task-plan');
  return ExternalShell;
};

const getPaymentsShell = function() {
  const { default: Payments } = require('./components/payments/manage');
  return Payments;
};

const getEventShell = function() {
  const { EventShell } = require('./components/task-plan');
  return EventShell;
};

const getPerformanceForecastGuide = function() {
  const PerformanceForecast = require('./components/performance-forecast');
  return PerformanceForecast.Guide;
};

const getCourseSettings = function() {
  const { default: CourseSettings } = require('./components/course-settings');
  return CourseSettings;
};

const getCourseRoster = function() {
  const { default: CourseRoster } = require('./components/course-roster');
  return CourseRoster;
};

const getPractice = () => require('./components/task/practice');

const getChangeStudentId = function() {
  const { default: StudentId } = require('./components/change-student-id');
  return StudentId;
};


const getTeacherReview = function() {
  const { default: TaskTeacherReview } = require('./components/task-teacher-review');
  return TaskTeacherReview;
};

const getCCHelp = () => require('./components/cc-dashboard/help');

const getCreateEnrollmentChange = function() {
  const { default: CourseEnroll } = require('./components/enroll');
  return CourseEnroll;
};

const getAccessibilityStatement = function() {
  const { default: AccessibilityStatement } = require('./components/accessibility-statement');
  return AccessibilityStatement;
};

const getStudentPreview = function() {
  const { default: StudentPreview } = require('./components/student-preview');
  return StudentPreview;
};

const getRoutes = (router) => {
  const ConditionalHandlers = getConditionalHandlers(router);

  return [
    { path: '/dashboard', name: 'myCourses', renderer: getMyCourses },
    { path: '/only-college-instructors', name: 'onlyCollegeInstructors', renderer: () => OnlyCollege },
    { path: '/enroll/start/:enrollmentCode', name: 'createEnrollmentChange', renderer: getCreateEnrollmentChange },
    { path: '/new-course/offering/:appearanceCode?', name: 'createNewCourseFromOffering', renderer: getNewCourseWizard },
    { path: '/new-course/:sourceId?', name: 'createNewCourse', renderer: getNewCourseWizard },
    {
      name: 'QADashboard',
      path: '/qa/:ecosystemId?/:chapterSection?',
      settings: { navBar: 'Plugable' },
      renderer: getQAView,
    },
    {
      path: '/course/:courseId', name: 'dashboard', renderer:  ConditionalHandlers.dashboard,

      routes: [{
        path: 'scores',
        name: 'viewScores',
        renderer: loadAsync(() => import('./screens/scores-report/index.jsx')),
      }, { path: 'cc/help', name: 'ccDashboardHelp', renderer: getCCHelp }, { path: 'guide/:roleId?', name: 'viewPerformanceGuide', renderer: getPerformanceForecastGuide }, {
        path: 't', name: 'viewTeacherDashboard', renderer: getTeacherDashboard,
        routes: [
          {
            path: 'month/:date', name: 'calendarByDate', renderer: getTeacherDashboard,
            routes: [{
              path: 'plan/:planId', name: 'calendarViewPlanStats', renderer: getTeacherDashboard,
            }],
          },
        ],
      }, { path: 'metrics/:id', name: 'reviewTask', renderer: getTeacherReview }, {
        path: 'task/:id', name: 'viewTask', renderer: getTaskShell,
        routes: [
          {
            path: 'step/:stepIndex', name: 'viewTaskStep', renderer: getTaskShell,
            routes: [{
              path: ':milestones', name: 'viewTaskStepMilestones', renderer: getTaskShell,
            }],
          },
        ],
      }, { path: 'practice/:taskId?', name: 'practiceTopics', renderer: getPractice }, { path: 'homework/new', name: 'createHomework' }, { path: 'homework/:id', name: 'editHomework', renderer: getHomeworkShell }, { path: 'reading/new', name: 'createReading' }, { path: 'reading/:id', name: 'editReading', renderer: getReadingShell }, { path: 'external/new', name: 'createExternal' }, { path: 'external/:id', name: 'editExternal', renderer: getExternalShell }, { path: 'event/new', name: 'createEvent' }, { path: 'event/:id', name: 'editEvent', renderer: getEventShell }, { path: 'settings', name: 'courseSettings', renderer: getCourseSettings }, { path: 'roster', name: 'courseRoster', renderer: getCourseRoster }, {
        path: 'questions',
        name: 'viewQuestionsLibrary',
        renderer: loadAsync(() => import('./screens/question-library/index.jsx')),
      }, { path: 'change-student-id', name: 'changeStudentId', renderer: getChangeStudentId }],

    }, {
      path: '/accessibility-statement/:courseId?', name: 'accessibilityStatement', renderer: getAccessibilityStatement,
    }, {
      path: '/student-preview/:courseId?', name: 'studentPreview', renderer: getStudentPreview,
    },
    { path: '/payments', name: 'managePayments', renderer: getPaymentsShell },
    {
      path: '/book/:ecosystemId',
      name: 'viewReferenceBook',
      renderer: getReferenceBook,
      settings: { navBar: 'Plugable' },
    },
    {
      path: '/book/:ecosystemId/section/:chapterSection',
      name: 'viewReferenceBookSection',
      renderer: getReferenceBook,
      settings: { navBar: 'Plugable' },
    },
    {
      path: '/books/:parts*',
      name: 'legacyReferenceBookRedirect',
      renderer: ConditionalHandlers.legacyReferenceBookRedirect,
    },
    {
      path: '/surveys/:courseId/:surveyId', name: 'researchSurvey',
      renderer: loadAsync(() => import('./screens/surveys/index.jsx')),
    },
  ];
};

export { getRoutes };
