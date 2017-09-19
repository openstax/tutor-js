async = require './helpers/webpack-async-loader'

getMyCourses = ->
  {default: MyCourses} = require './components/my-courses'
  MyCourses

getDashboard = ->
  ConditionalHandlers = require './helpers/conditional-handlers'
  ConditionalHandlers.dashboard

getTeacherTaskPlans = ->
  {default: TeacherTaskPlans} = require './components/course-calendar'
  TeacherTaskPlans

getTaskShell = ->
  {TaskShell} = require './components/task'
  TaskShell

getReferenceBookShell = ->
  {ReferenceBookShell} = require './components/reference-book'
  ReferenceBookShell

getReferenceBookPageShell = ->
  {ReferenceBookPageShell} = require './components/reference-book'
  ReferenceBookPageShell

getReadingShell = ->
  {ReadingShell} = require './components/task-plan'
  ReadingShell

getHomeworkShell = ->
  {HomeworkShell} = require './components/task-plan'
  HomeworkShell

getExternalShell = ->
  {ExternalShell} = require './components/task-plan'
  ExternalShell

getPaymentsShell = ->
  {default: Payments} = require './components/payments/manage'
  Payments

getEventShell = ->
  {EventShell} = require './components/task-plan'
  EventShell

getScoresShell = ->
  {ScoresShell} = require './components/scores'
  ScoresShell

getPerformanceForecastGuide = ->
  PerformanceForecast = require './components/performance-forecast'
  PerformanceForecast.Guide

getCourseSettings = ->
  require './components/course-settings'

getPractice = ->
  require './components/task/practice'

getQuestionsLibrary = ->
  require './components/questions'

getChangeStudentId = ->
  {default: StudentId} = require './components/change-student-id'
  StudentId

getQADashboard = ->
  require './components/qa/index'

getQABook = ->
  require './components/qa/view-book'

getCreateCourse = ->
  {default: Wizard} =  require './components/new-course'
  Wizard

getTeacherReview = ->
  {TaskTeacherReviewShell} = require './components/task-teacher-review'
  TaskTeacherReviewShell

getCCHelp = ->
  require './components/cc-dashboard/help'

getAssignmentLinks = ->
  require './components/assignment-links'

getCreateEnrollmentChange = ->
  {default: CourseEnroll} = require './components/enroll'
  CourseEnroll

getAccessibilityStatement = ->
  {default: AccessibilityStatement} = require './components/accessibility-statement'
  AccessibilityStatement

getStudentPreview = ->
  {default: StudentPreview} = require './components/student-preview'
  StudentPreview

ROUTES = [
  { path: '/dashboard',              name: 'myCourses',                renderer: getMyCourses }
  { path: '/enroll/start/:enrollmentCode', name: 'createEnrollmentChange',   renderer: getCreateEnrollmentChange }
  { path: '/new-course/:sourceId?',  name: 'createNewCourse',          renderer: getCreateCourse  }
  {
    path: '/qa',                     name: 'QADashboard',              renderer: getQADashboard
    routes: [
      {
        path: ':ecosystemId',        name: 'QAViewBook',               renderer: getQABook
        routes: [{
          path: 'section/:section',  name: 'QAViewBookSection',        renderer: getQABook
        }]
      }
    ]
  }
  {
    path: '/course/:courseId',       name: 'dashboard',                renderer: getDashboard
    routes: [
      { path: 'scores',              name: 'viewScores',               renderer: getScoresShell }
      { path: 'cc/help',             name: 'ccDashboardHelp',          renderer: getCCHelp      }
      { path: 'guide/:roleId?',      name: 'viewPerformanceGuide',     renderer: getPerformanceForecastGuide }
      {
        path: 't',                   name: 'viewTeacherDashboard',     renderer: getTeacherTaskPlans
        routes: [
          {
            path: 'month/:date',     name: 'calendarByDate',           renderer: getTeacherTaskPlans
            routes: [{
              path: 'plan/:planId',  name: 'calendarViewPlanStats',    renderer: getTeacherTaskPlans
            }]
          }
        ]
      }
      { path: 'assignment-links',    name: 'viewAssignmentLinks',      renderer: getAssignmentLinks }
      { path: 'metrics/:id',         name: 'reviewTask',               renderer: getTeacherReview }
      {
        path: 'task/:id',            name: 'viewTask',                 renderer: getTaskShell
        routes: [
          {
            path: 'step/:stepIndex', name: 'viewTaskStep',             renderer: getTaskShell
            routes: [{
              path: ':milestones',   name: 'viewTaskStepMilestones',   renderer: getTaskShell
            }]
          }
        ]
      }
      { path: 'practice/:taskId?',   name: 'practiceTopics',           renderer: getPractice            }
      { path: 'homework/new',        name: 'createHomework'                                        }
      { path: 'homework/:id',        name: 'editHomework',             renderer: getHomeworkShell       }
      { path: 'reading/new',         name: 'createReading'                                         }
      { path: 'reading/:id',         name: 'editReading',              renderer: getReadingShell        }
      { path: 'external/new',        name: 'createExternal'                                        }
      { path: 'external/:id',        name: 'editExternal',             renderer: getExternalShell       }
      { path: 'event/new',           name: 'createEvent'                                           }
      { path: 'event/:id',           name: 'editEvent',                renderer: getEventShell          }
      { path: 'settings',            name: 'courseSettings',           renderer: getCourseSettings      }
      { path: 'questions',           name: 'viewQuestionsLibrary',     renderer: getQuestionsLibrary    }
      { path: 'change-student-id',   name: 'changeStudentId',          renderer: getChangeStudentId     }
    ]

  }, {
    path: '/accessibility-statement/:courseId?', name: 'accessibilityStatement', renderer: getAccessibilityStatement
  }, {
    path: '/student-preview/:courseId?', name: 'studentPreview',       renderer: getStudentPreview
  }
  { path: '/payments',                name: 'managePayments',           renderer: getPaymentsShell     }
  {
    path: '/books/:courseId',        name: 'viewReferenceBook',        renderer: getReferenceBookShell
    routes: [
      { path: 'section/:section',    name: 'viewReferenceBookSection', renderer: getReferenceBookShell  }
      { path: 'page/:cnxId',         name: 'viewReferenceBookPage',    renderer: getReferenceBookPageShell  }
    ]
  }
]

module.exports = ROUTES

## Below is pre router upgrade config

# {Route, Redirect, NotFoundRoute} = Router

# async = require './helpers/webpack-async-loader'

# {App, Root, Dashboard, SingleTask, SinglePractice, Invalid} = require './components'
# {CourseListing} = require './components/course-listing'
# {AssignmentLinks} = require './components/assignment-links'
# QuestionsLibrary = require './components/questions'
# ChangeStudentId = require './components/change-student-id'
# PerformanceForecastShell = require './components/performance-forecast'
# {ScoresShell} = require './components/scores'
# {ReadingShell, HomeworkShell, ExternalShell, EventShell} = require './components/task-plan'
# {StudentDashboardShell} = require './components/student-dashboard'
# CCStudentRedirect = require './components/cc-student-redirect'
# TeacherTaskPlans = require './components/task-plan/teacher-task-plans-listing'
# {TaskTeacherReviewShell} = require './components/task-teacher-review'
# {ReferenceBookShell, ReferenceBookPageShell, ReferenceBookFirstPage} =
#   require './components/reference-book'
# {StatsShell} = require './components/plan-stats'
# CCDashboard = require './components/cc-dashboard'
# CCDashboardHelp = require './components/cc-dashboard/help'

# CourseSettings = require './components/course-settings'
# Sandbox = require './sandbox'
# CourseHandler = require './helpers/conditional-rendering'

# QALoader = require 'promise?global!./qa'

# routes = (
#   <Route handler={Root} name='root'>
#     <Route path='/' handler={App} name='app'>
#       <Redirect from='/' to='dashboard' />
#       <Route path='dashboard/?' name='dashboard' handler={CourseListing} />

#       <Route path='courses/:courseId/?'>
#         <Route path='change-student-id' name='changeStudentId' handler={ChangeStudentId} />
#         <Router.DefaultRoute handler={TeacherTaskPlans}/>
#         <Route path='cc-student-redirect/?' name='viewStudentCCRedirect' handler={CCStudentRedirect} />

#         <Route path='assignment-links/?' name='viewAssignmentLinks' handler={AssignmentLinks} />
#         <Route path='list/?' name='viewStudentDashboard' handler={StudentDashboardShell} />
#         <Route path='tasks/:id/?' name='viewTask' handler={SingleTask} ignoreScrollBehavior>
#           <Route path='steps/:stepIndex/?'
#             name='viewTaskStep'
#             handler={SingleTask}
#             ignoreScrollBehavior>
#             <Route
#               path=':milestones/?'
#               name='viewTaskStepMilestones'
#               ignoreScrollBehavior/>
#           </Route>
#         </Route>

#         <Route path='practice/?' name='viewPractice' handler={SinglePractice} />
#         <Route
#           path='guide/?'
#           name='viewPerformanceForecast'
#           handler={PerformanceForecastShell.Student}/>

#         <Route path='t/' name='viewTeacherDashBoard'>
#           <Router.DefaultRoute handler={TeacherTaskPlans} />
#           <Route path='scores/?' name='viewScores'
#             handler={CourseHandler(ScoresShell, requireRole: 'teacher', requirePeriods: true)} />
#           <Route path='guide' name='viewTeacherPerformanceForecast'
#             handler={CourseHandler(PerformanceForecastShell.Teacher, requireRole: 'teacher', requirePeriods: true)} />
#           <Route path='guide/student/:roleId?' name='viewStudentTeacherPerformanceForecast'
#             handler={CourseHandler(PerformanceForecastShell.TeacherStudent, requireRole: 'teacher', requirePeriods: true)}/>

#           <Route path='calendar/?' name='taskplans'>
#             <Router.DefaultRoute handler={TeacherTaskPlans} />
#             <Route
#               path='months/:date/?'
#               name='calendarByDate'
#               handler={TeacherTaskPlans}
#               ignoreScrollBehavior>
#               <Route
#                 path='plans/:planId/?'
#                 name='calendarViewPlanStats'
#                 ignoreScrollBehavior/>
#             </Route>
#           </Route>
#           <Route path='questions' name='viewQuestionsLibrary' handler={QuestionsLibrary} />

#           <Route path='cc-dashboard/?' name='cc-dashboard'>
#             <Router.DefaultRoute handler={CCDashboard} />
#             <Route path='help/?' name='ccDashboardHelp' handler={CCDashboardHelp} />
#             <Route path='guide/?' name='ccDashboardGuide' handler={CCDashboard} />
#           </Route>

#           <Route path='homeworks/new/?' name='createHomework' handler={HomeworkShell} />
#           <Route path='homeworks/:id/?' name='editHomework' handler={HomeworkShell} />
#           <Route path='readings/new/?' name='createReading' handler={ReadingShell} />
#           <Route path='readings/:id/?' name='editReading' handler={ReadingShell} />
#           <Route path='externals/new/?' name='createExternal' handler={ExternalShell} />
#           <Route path='externals/:id/?' name='editExternal' handler={ExternalShell} />
#           <Route path='events/new/?' name='createEvent' handler={EventShell} />
#           <Route path='events/:id/?' name='editEvent' handler={EventShell} />
#           <Route path='settings' name='courseSettings' handler={CourseSettings} />
#           <Route path='plans/:id/?'>
#             <Router.DefaultRoute handler={StatsShell}/>
#             <Route path='stats/?' name='viewStats' handler={StatsShell} />
#             <Route path='summary/?' name='reviewTask' handler={TaskTeacherReviewShell}>
#               <Route
#                 path='sections/:sectionIndex/?'
#                 name='reviewTaskStep'
#                 ignoreScrollBehavior />
#             </Route>
#           </Route>
#         </Route>
#       </Route>
#       <Route path='sandbox/?' name='sandbox' handler={Sandbox} />
#     </Route> # end of routes handled by App

#     <Route path='/books/:courseId/?' name='viewReferenceBook' handler={ReferenceBookShell}>
#       <Router.DefaultRoute name="viewReferenceBookFirstPage" handler={ReferenceBookPageShell}/>
#       <Route path='section/:section' name='viewReferenceBookSection' handler={ReferenceBookShell} />
#       <Route path='page/:cnxId' name='viewReferenceBookPage' handler={ReferenceBookPageShell}/>
#     </Route> # end of /books route

#     <Route path='/qa' name='QADashboard' handler={async(QALoader, 'QADashboard')} >
#       <Router.DefaultRoute name="QAViewFirstBook" handler={async(QALoader, 'QABook')}/>

#       <Route path=':ecosystemId' name='QAViewBook'
#         handler={async(QALoader, 'QABook')} />
#       <Route path=':ecosystemId/section/:section' name='QAViewBookSection'
#         handler={async(QALoader, 'QABook')} />

#     </Route> # end of qa route

#     <NotFoundRoute handler={Invalid} />
#   </Route>
# )


# # Remember the router for unit testing
# router = Router.create
#   routes: routes
#   location: Router.HistoryLocation


# start = (mountPoint) ->
#   router.run (Handler) ->
#     React.render(<Handler/>, mountPoint)

# module.exports = {start, router, routes}
