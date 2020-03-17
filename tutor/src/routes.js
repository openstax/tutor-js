import { loadAsync } from './helpers/async-component';
import { memoize } from 'lodash';
import { getConditionalHandlers } from './helpers/conditional-handlers';
import OnlyCollege from './components/my-courses/no-hs-teachers';

const r = (i, n) => memoize(loadAsync(i, n));

const getRoutes = (router) => {
  const ConditionalHandlers = getConditionalHandlers(router);

  return [
    { path: '/dashboard', name: 'myCourses',
      renderer: r(() => import('./components/my-courses'), 'Courses Listing') },
    { path: '/only-college-instructors', name: 'onlyCollegeInstructors',
      renderer: () => OnlyCollege },
    { path: '/enroll/start/:enrollmentCode', name: 'createEnrollmentChange',
      renderer: r(() => import('./components/enroll'), 'Course Enrollment') },
    { path: '/new-course/offering/:appearanceCode?', name: 'createNewCourseFromOffering',
      renderer: r(() => import('./screens/new-course'), 'Create Course') },
    { path: '/new-course/:sourceId?', name: 'createNewCourse',
      renderer: r(() => import('./screens/new-course'), 'Copy Course') },
    {
      name: 'QADashboard',
      path: '/qa/:ecosystemId?/:pageId?',
      settings: { navBar: 'Plugable' },
      renderer: r(() => import('./screens/qa-view'), 'QA View') },
    {
      path: '/course/:courseId', name: 'dashboard',
      renderer:  ConditionalHandlers.dashboard,
      routes: [
        {
          path: 'scores', name: 'viewGradebook',
          renderer: r(() => import('./screens/scores-report/index.jsx')) },
        { path: 'guide/:roleId?', name: 'viewPerformanceGuide',
          renderer: r(() => import('./screens/performance-forecast')) },
        {
          path: 'become/:roleId', name: 'becomeRole',
          renderer:  ConditionalHandlers.becomeRole },
        { path: 't', name: 'viewTeacherDashboard',
          renderer: r(() => import('./screens/teacher-dashboard'), 'Course'),
          routes: [
            { path: 'month/:date', name: 'calendarByDate',
              renderer: r(() => import('./screens/teacher-dashboard'), 'Course'),
              routes: [
                { path: 'plan/:planId', name: 'calendarViewPlanStats',
                  renderer: r(() => import('./screens/teacher-dashboard'), 'Course') },
              ],
            },
          ],
        }, {
          path: 'metrics/:id', name: 'reviewTask',
          renderer: r(() => import('./screens/teacher-review-metrics')) },

        { path: 'task/:id', name: 'viewTask',
          renderer: r(() => import('./screens/task'), 'Assignment'),
          routes: [
            {
              path: 'step/:stepIndex', name: 'viewTaskStep',
              renderer: r(() => import('./screens/task'), 'Assignment'),
            },
          ],
        }, {
          path: 'practice/:taskId?', name: 'practiceTopics',
          renderer: r(() => import('./screens/task/practice'), 'Practice') },
        {
          path: 'assignment/edit/:type/:id/:step?', name: 'editAssignment',
          renderer: r(() => import('./screens/assignment-edit'), 'Assignment Builder') },
        {
          path: 'assignment/review/:id', name: 'reviewAssignment',
          renderer: r(() => import('./screens/assignment-review')) },
        {
          path: 'gradebook', name: 'viewGradebook',
          renderer: r(() => import('./screens/gradebook/index.js')) },
        { path: 'settings', name: 'courseSettings',
          renderer: r(() => import('./screens/course-settings'), 'Course Settings') },
        { path: 'roster', name: 'courseRoster',
          renderer: r(() => import('./screens/course-roster'), 'Course Roster') },
        { path: 'questions', name: 'viewQuestionsLibrary',
          renderer: r(() => import('./screens/question-library/index.jsx')),
        },
        { path: 'change-student-id', name: 'changeStudentId',
          renderer: r(() => import('./components/change-student-id')),
        },
        { path: 'grading-templates', name: 'gradingTemplates',
          renderer: r(() => import('./screens/grading-templates')),
        },
      ],
    }, {
      path: '/accessibility-statement/:courseId?', name: 'accessibilityStatement',
      renderer: r(() => import('./components/accessibility-statement')),
    },
    { path: '/payments', name: 'managePayments',
      renderer: r(() => import('./components/payments/manage')) },
    {
      path: '/book/:courseId', name: 'viewReferenceBook', settings: { navBar: 'Plugable' },
      renderer: r(() => import('./screens/reference-book/index.jsx')) },
    {
      path: '/book/:courseId/page/:pageId',
      name: 'viewReferenceBookPage', settings: { navBar: 'Plugable' },
      renderer: r(() => import('./screens/reference-book/index.jsx')) },
    {
      path: '/book/:courseId/section/:chapterSection',
      name: 'viewReferenceBookSection', settings: { navBar: 'Plugable' },
      renderer: r(() => import('./screens/reference-book/index.jsx')) },
    {
      path: '/surveys/:courseId/:surveyId', name: 'researchSurvey',
      renderer: r(() => import('./screens/surveys/index.jsx')),
    },
    {
      path: '/stats', name: 'Stats',
      renderer: r(() => import('./screens/stats/index.jsx')),
    },
  ];
};

export { getRoutes };
