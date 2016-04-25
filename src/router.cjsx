React = require 'react'
ReactDOM = require 'react-dom'
{ Router, Route, Redirect, NonFoundRoute, IndexRoute, browserHistory } = require 'react-router'

async = require './helpers/webpack-async-loader'

{App, Root, Dashboard, SingleTask, SinglePractice, Invalid} = require './components'
{CourseListing, CourseListingOnEnter} = require './components/course-listing'
QuestionsLibrary = require './components/questions'
PerformanceForecastShell = require './components/performance-forecast'
{ScoresShell} = require './components/scores'
{ReadingShell, HomeworkShell, ExternalShell, EventShell} = require './components/task-plan'
{StudentDashboardShell} = require './components/student-dashboard'
{TeacherTaskPlansListing, TaskPlanListingOnEnter} = require './components/task-plan/teacher-task-plans-listing'
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
  <Route component={Root} name='root'>
    <Route path='/' component={App} name='app'>
      <Redirect from='/' to='dashboard' />
      <Route path='dashboard/?'
        onEnter={CourseListingOnEnter}
        name='dashboard'
        component={CourseListing} />

      <Route path='courses/:courseId/?'>
        <IndexRoute component={TeacherTaskPlansListing} onEnter={TaskPlanListingOnEnter}/>

        <Route path='list/?' name='viewStudentDashboard' component={StudentDashboardShell} />
        <Route path='tasks/:id/?' name='viewTask' component={SingleTask}/>
        <Route path='tasks/:id/steps/:stepIndex/?'
          name='viewTaskStep'
          component={SingleTask}
          ignoreScrollBehavior/>

        <Route path='practice/?' name='viewPractice' component={SinglePractice} />
        <Route
          path='guide/?'
          name='viewPerformanceForecast'
          component={PerformanceForecastShell.Student}/>

        <Route path='t/' name='viewTeacherDashBoard'>
          <IndexRoute component={TeacherTaskPlansListing} onEnter={TaskPlanListingOnEnter} />
          <Route path='scores/?' name='viewScores'
            component={Handler(ScoresShell, requireRole: 'teacher', requirePeriods: true)} />
          <Route path='guide' name='viewTeacherPerformanceForecast'
            component={Handler(PerformanceForecastShell.Teacher, requireRole: 'teacher', requirePeriods: true)} />
          <Route path='guide/student/:roleId?' name='viewStudentTeacherPerformanceForecast'
            component={Handler(PerformanceForecastShell.TeacherStudent, requireRole: 'teacher', requirePeriods: true)}/>

          <Route path='calendar/?'>
            <IndexRoute component={TeacherTaskPlansListing} onEnter={TaskPlanListingOnEnter} />
            <Route
              path='months/:date/?'
              name='calendarByDate'
              component={TeacherTaskPlansListing}
              onEnter={TaskPlanListingOnEnter}
              ignoreScrollBehavior>
              <Route
                path='plans/:planId/?'
                name='calendarViewPlanStats'
                ignoreScrollBehavior/>
            </Route>
          </Route>
          <Route path='questions' name='viewQuestionsLibrary' component={QuestionsLibrary} />
          <Route path='cc-dashboard/?' name='cc-dashboard' component={CCDashboard} />
          <Route path='homeworks/new/?' name='createHomework' component={HomeworkShell} />
          <Route path='homeworks/:id/?' name='editHomework' component={HomeworkShell} />
          <Route path='readings/new/?' name='createReading' component={ReadingShell} />
          <Route path='readings/:id/?' name='editReading' component={ReadingShell} />
          <Route path='externals/new/?' name='createExternal' component={ExternalShell} />
          <Route path='externals/:id/?' name='editExternal' component={ExternalShell} />
          <Route path='events/new/?' name='createEvent' component={EventShell} />
          <Route path='events/:id/?' name='editEvent' component={EventShell} />
          <Route path='settings' name='courseSettings' component={CourseSettings} />
          <Route path='plans/:id/?'>
            <IndexRoute component={StatsShell}/>
            <Route path='stats/?' name='viewStats' component={StatsShell} />
            <Route path='summary/?' name='reviewTask' component={TaskTeacherReviewShell}>
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
      <Route path='sandbox/?' name='sandbox' component={Sandbox} />
    </Route> # end of routes handled by App

    <Route path='/books/:courseId/?' name='viewReferenceBook' component={ReferenceBookShell}>
      <IndexRoute name="viewReferenceBookFirstPage" component={ReferenceBookPageShell}/>
      <Route path='section/:section' name='viewReferenceBookSection' component={ReferenceBookShell} />
      <Route path='page/:cnxId' name='viewReferenceBookPage' component={ReferenceBookPageShell}/>
    </Route> # end of /books route


    <Route path='/qa' name='QADashboard' component={async(QALoader, 'QADashboard')} >
      <IndexRoute name="QAViewFirstBook" component={async(QALoader, 'QABook')}/>

      <Route path=':ecosystemId' name='QAViewBook'
        component={async(QALoader, 'QABook')} />
      <Route path=':ecosystemId/section/:section' name='QAViewBookSection'
        component={async(QALoader, 'QABook')} />

    </Route> # end of qa route

    <Route path="*" component={Invalid} />
  </Route>
)


start = (mountPoint) ->
  ReactDOM.render(<Router history={browserHistory} routes={routes}/>, mountPoint)

module.exports = {start, routes}
