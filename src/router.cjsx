React = require 'react'
Router = require 'react-router'
{Route, Redirect, NotFoundRoute} = Router

async = require './helpers/webpack-async-loader'

{App, Root, Dashboard, SingleTask, SinglePractice, Invalid} = require './components'
{CourseListing} = require './components/course-listing'
PerformanceForecastShell = require './components/performance-forecast'
{ScoresShell} = require './components/scores'
{ReadingShell, HomeworkShell, ExternalShell, EventShell} = require './components/task-plan'
{StudentDashboardShell} = require './components/student-dashboard'
TeacherTaskPlans = require './components/task-plan/teacher-task-plans-listing'
{TaskTeacherReviewShell} = require './components/task-teacher-review'
{ReferenceBookShell, ReferenceBookPageShell, ReferenceBookFirstPage} =
  require './components/reference-book'

{StatsShell} = require './components/plan-stats'
CCDashboard = require './components/cc-dashboard'

CourseSettings = require './components/course-settings'
Sandbox = require './sandbox'
Handler = require './helpers/conditional-rendering'

QALoader = require 'promise?global!./qa'

routes = (
  <Route handler={Root} name='root'>
    <Route path='/' handler={App} name='app'>
      <Redirect from='/' to='dashboard' />
      <Route path='dashboard/?' name='dashboard' handler={CourseListing} />
      <Route path='courses/:courseId/?'>
        <Router.DefaultRoute handler={TeacherTaskPlans}/>

        <Route path='list/?' name='viewStudentDashboard' handler={StudentDashboardShell} />
        <Route path='tasks/:id/?' name='viewTask' handler={SingleTask}/>
        <Route path='tasks/:id/steps/:stepIndex/?'
          name='viewTaskStep'
          handler={SingleTask}
          ignoreScrollBehavior/>

        <Route path='practice/?' name='viewPractice' handler={SinglePractice} />
        <Route
          path='guide/?'
          name='viewPerformanceForecast'
          handler={PerformanceForecastShell.Student}/>

        <Route path='t/' name='viewTeacherDashBoard'>
          <Router.DefaultRoute handler={TeacherTaskPlans} />
          <Route path='scores/?' name='viewScores'
            handler={Handler(ScoresShell, requireRole: 'teacher')} />
          <Route path='guide' name='viewTeacherPerformanceForecast'
            handler={Handler(PerformanceForecastShell.Teacher, requireRole: 'teacher')} />
          <Route path='guide/student/:roleId?' name='viewStudentTeacherPerformanceForecast'
            handler={Handler(PerformanceForecastShell.TeacherStudent, requireRole: 'teacher')}/>

          <Route path='calendar/?' name='taskplans'>
            <Router.DefaultRoute handler={TeacherTaskPlans} />
            <Route
              path='months/:date/?'
              name='calendarByDate'
              handler={TeacherTaskPlans}
              ignoreScrollBehavior>
              <Route
                path='plans/:planId/?'
                name='calendarViewPlanStats'
                ignoreScrollBehavior/>
            </Route>
          </Route>
          <Route path='cc-dashboard/?' name='cc-dashboard' handler={CCDashboard} />

          <Route path='homeworks/new/?' name='createHomework' handler={HomeworkShell} />
          <Route path='homeworks/:id/?' name='editHomework' handler={HomeworkShell} />
          <Route path='readings/new/?' name='createReading' handler={ReadingShell} />
          <Route path='readings/:id/?' name='editReading' handler={ReadingShell} />
          <Route path='externals/new/?' name='createExternal' handler={ExternalShell} />
          <Route path='externals/:id/?' name='editExternal' handler={ExternalShell} />
          <Route path='events/new/?' name='createEvent' handler={EventShell} />
          <Route path='events/:id/?' name='editEvent' handler={EventShell} />
          <Route path='settings' name='courseSettings' handler={CourseSettings} />
          <Route path='plans/:id/?'>
            <Router.DefaultRoute handler={StatsShell}/>
            <Route path='stats/?' name='viewStats' handler={StatsShell} />
            <Route path='summary/?' name='reviewTask' handler={TaskTeacherReviewShell}>
              <Route
                path='periods/:periodIndex/?'
                name='reviewTaskPeriod'
                ignoreScrollBehavior >
                <Route
                  path='sections/:sectionIndex/?'
                  name='reviewTaskStep'
                  ignoreScrollBehavior />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path='sandbox/?' name='sandbox' handler={Sandbox} />
    </Route> # end of routes handled by App

    <Route path='/books/:courseId/?' name='viewReferenceBook' handler={ReferenceBookShell}>
      <Router.DefaultRoute name="viewReferenceBookFirstPage" handler={ReferenceBookPageShell}/>
      <Route path='section/:section' name='viewReferenceBookSection' handler={ReferenceBookShell} />
      <Route path='page/:cnxId' name='viewReferenceBookPage' handler={ReferenceBookPageShell}/>
    </Route> # end of /books route

    <Route path='/qa' name='QADashboard' handler={async(QALoader, 'QADashboard')} >
      <Router.DefaultRoute name="QAViewFirstBook" handler={async(QALoader, 'QABook')}/>

      <Route path=':ecosystemId' name='QAViewBook'
        handler={async(QALoader, 'QABook')} />
      <Route path=':ecosystemId/section/:section' name='QAViewBookSection'
        handler={async(QALoader, 'QABook')} />

    </Route> # end of qa route

    <NotFoundRoute handler={Invalid} />
  </Route>
)


# Remember the router for unit testing
router = Router.create
  routes: routes
  location: Router.HistoryLocation


start = (mountPoint) ->
  router.run (Handler) ->
    React.render(<Handler/>, mountPoint)

module.exports = {start, router, routes}
