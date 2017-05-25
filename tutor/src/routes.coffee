async = require './helpers/webpack-async-loader'

getMyCourses = ->
  {default: MyCourses} = require './components/my-courses'
  MyCourses

getDashboard = ->
  ConditionalHandlers = require './helpers/conditional-handlers'
  ConditionalHandlers.dashboard

getStudentDashboardShell = ->
  {StudentDashboardShell} = require './components/student-dashboard'
  StudentDashboardShell

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
  require './components/change-student-id'

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
  require './components/enroll'


getStudentPreview = ->
  {default: StudentPreview} = require './components/student-preview'
  StudentPreview

ROUTES = [
  { pattern: '/dashboard',              name: 'myCourses',                renderer: getMyCourses }
  { pattern: '/enroll/:enrollmentCode', name: 'createEnrollmentChange',   renderer: getCreateEnrollmentChange }
  { pattern: '/new-course/:sourceId?',  name: 'createNewCourse',          renderer: getCreateCourse  }
  {
    pattern: '/qa',                     name: 'QADashboard',              renderer: getQADashboard
    routes: [
      {
        pattern: ':ecosystemId',        name: 'QAViewBook',               renderer: getQABook
        routes: [{
          pattern: 'section/:section',  name: 'QAViewBookSection',        renderer: getQABook
        }]
      }
    ]
  }
  {
    pattern: '/course/:courseId',       name: 'dashboard',                renderer: getDashboard
    routes: [
      { pattern: 'scores',              name: 'viewScores',               renderer: getScoresShell }
      { pattern: 'cc/help',             name: 'ccDashboardHelp',          renderer: getCCHelp      }
      { pattern: 'guide/:roleId?',      name: 'viewPerformanceGuide',     renderer: getPerformanceForecastGuide }
      {
        pattern: 't',                   name: 'viewTeacherDashboard',     renderer: getTeacherTaskPlans
        routes: [
          {
            pattern: 'month/:date',     name: 'calendarByDate',           renderer: getTeacherTaskPlans
            routes: [{
              pattern: 'plan/:planId',  name: 'calendarViewPlanStats',    renderer: getTeacherTaskPlans
            }]
          }
        ]
      }
      { pattern: 'assignment-links',    name: 'viewAssignmentLinks',      renderer: getAssignmentLinks }
      { pattern: 'metrics/:id',         name: 'reviewTask',               renderer: getTeacherReview }
      {
        pattern: 'task/:id',            name: 'viewTask',                 renderer: getTaskShell
        routes: [
          {
            pattern: 'step/:stepIndex', name: 'viewTaskStep',             renderer: getTaskShell
            routes: [{
              pattern: ':milestones',   name: 'viewTaskStepMilestones',   renderer: getTaskShell
            }]
          }
        ]
      }

      { pattern: 'practice/:taskId?',   name: 'practiceTopics',           renderer: getPractice            }
      { pattern: 'homework/new',        name: 'createHomework'                                        }
      { pattern: 'homework/:id',        name: 'editHomework',             renderer: getHomeworkShell       }
      { pattern: 'reading/new',         name: 'createReading'                                         }
      { pattern: 'reading/:id',         name: 'editReading',              renderer: getReadingShell        }
      { pattern: 'external/new',        name: 'createExternal'                                        }
      { pattern: 'external/:id',        name: 'editExternal',             renderer: getExternalShell       }
      { pattern: 'event/new',           name: 'createEvent'                                           }
      { pattern: 'event/:id',           name: 'editEvent',                renderer: getEventShell          }
      { pattern: 'settings',            name: 'courseSettings',           renderer: getCourseSettings      }
      { pattern: 'questions',           name: 'viewQuestionsLibrary',     renderer: getQuestionsLibrary    }
      { pattern: 'change-student-id',   name: 'changeStudentId',          renderer: getChangeStudentId     }
    ]

  }
  {
    pattern: '/student-preview',        name: 'studentPreview',           renderer: getStudentPreview
  }
  {
    pattern: '/books/:courseId',        name: 'viewReferenceBook',        renderer: getReferenceBookShell
    routes: [
      { pattern: 'section/:section',    name: 'viewReferenceBookSection', renderer: getReferenceBookShell  }
      { pattern: 'page/:cnxId',         name: 'viewReferenceBookPage',    renderer: getReferenceBookPageShell  }
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
