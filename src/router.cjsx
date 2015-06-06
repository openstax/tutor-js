React = require 'react'
Router = require 'react-router'
{Route, Redirect, NotFoundRoute, DefaultRoute} = Router
{App, Dashboard, SingleTask, SinglePractice, Invalid} = require './components'
{CourseListing} = require './components/course-listing'
{LearningGuideShell} = require './components/learning-guide'
{PerformanceShell} = require './components/performance'
{ReadingShell, HomeworkShell} = require './components/task-plan'
{StudentDashboardShell} = require './components/student-dashboard'
TeacherTaskPlans = require './components/task-plan/teacher-task-plans-listing'

{StatsShell} = require './components/task-plan/reading-stats'

Sandbox = require './sandbox'

routes = (
  <Route path='/' handler={App} name='root'>
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
      <Route path='guide/?' name='viewGuide' handler={LearningGuideShell} />

      <Route path='t/'>
        <DefaultRoute handler={TeacherTaskPlans} />
        <Route path='performance/?' name='viewPerformance' handler={PerformanceShell} />
        <Route path='calendar/?' name='taskplans' handler={TeacherTaskPlans} />
        <Route path='homeworks/new/?' name='createHomework' handler={HomeworkShell} />
        <Route path='homeworks/:id/?' name='editHomework' handler={HomeworkShell} />
        <Route path='readings/new/?' name='createReading' handler={ReadingShell} />
        <Route path='readings/:id/?' name='editReading' handler={ReadingShell} />
        <Route path=':type/:id/stats/?' name='viewStats' handler={StatsShell} />
        <Route path='tasks/:id/?' name='reviewTask' handler={SingleTask} />
      </Route>
    </Route>
    <Route path='sandbox/?' name='sandbox' handler={Sandbox} />
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
