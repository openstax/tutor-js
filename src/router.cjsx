React = require 'react'
Router = require 'react-router'
{Route, Redirect, NotFoundRoute} = Router
{App, Root, Dashboard, SingleTask, SinglePractice, Invalid} = require './components'
{CourseListing} = require './components/course-listing'
{LearningGuideShell} = require './components/learning-guide'
{PerformanceShell} = require './components/performance'
{ReadingShell, HomeworkShell} = require './components/task-plan'
{StudentDashboardShell} = require './components/student-dashboard'
TeacherTaskPlans = require './components/task-plan/teacher-task-plans-listing'
{TaskTeacherReviewShell} = require './components/task-teacher-review'
{ReferenceBookShell, ReferenceBookPageShell, ReferenceBookFirstPage} =
  require './components/reference-book'

{StatsShell} = require './components/task-plan/reading-stats'

Sandbox = require './sandbox'

routes = (
  <Route handler={Root} name='root'>
    <Route path='/' handler={App} name='app'>
      <Redirect from='/' to='dashboard' />
      <Route path='dashboard/?' name='dashboard' handler={CourseListing} />
      <Route path='courses/:courseId/?'>
        <Route path='list/?' name='viewStudentDashboard' handler={StudentDashboardShell} />
        <Route path='tasks/:id/?' name='viewTask' handler={SingleTask}/>
        <Route path='tasks/:id/steps/:stepIndex/?'
          name='viewTaskStep'
          handler={SingleTask}
          ignoreScrollBehavior/>

        <Route path='practice/?' name='viewPractice' handler={SinglePractice} />
        <Route path='guide/?' name='viewGuide' handler={LearningGuideShell}/>

        <Route path='t/'>
          <Router.DefaultRoute handler={TeacherTaskPlans} />
          <Route path='performance/?' name='viewPerformance' handler={PerformanceShell} />
          <Route path='calendar/?' name='taskplans' handler={TeacherTaskPlans} />
          <Route path='homeworks/new/?' name='createHomework' handler={HomeworkShell} />
          <Route path='homeworks/:id/?' name='editHomework' handler={HomeworkShell} />
          <Route path='readings/new/?' name='createReading' handler={ReadingShell} />
          <Route path='readings/:id/?' name='editReading' handler={ReadingShell} />
          <Route path='plans/:id/?'>
            <Router.DefaultRoute handler={StatsShell}/>
            <Route path='stats/?' name='viewStats' handler={StatsShell} />
            <Route path='summary/?' name='reviewTask' handler={TaskTeacherReviewShell} >
              <Route
                path='sections/:sectionIndex/?'
                name='reviewTaskStep'
                ignoreScrollBehavior />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path='sandbox/?' name='sandbox' handler={Sandbox} />
    </Route> # end of App route
    <Route path='/books/:courseId' name='viewReferenceBook' handler={ReferenceBookShell}>
      <Router.DefaultRoute name="viewReferenceBookFirstPage" handler={ReferenceBookFirstPage}/>
      <Route path='page/:cnxId' name='viewReferenceBookPage' handler={ReferenceBookPageShell}/>
    </Route>
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
