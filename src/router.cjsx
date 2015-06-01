React = require 'react'
Router = require 'react-router'
{Route, Redirect, NotFoundRoute, DefaultRoute} = Router
{App, Dashboard, SingleTask, SinglePractice, Invalid} = require './components'
{LearningGuideShell} = require './components/learning-guide'
{PerformanceShell} = require './components/performance'
{ReadingShell, HomeworkShell} = require './components/task-plan'
{StudentDashboardShell} = require './components/student-dashboard'
TeacherTaskPlans = require './components/task-plan/teacher-task-plans-listing'

{StatsShell} = require './components/task-plan/reading-stats'

Sandbox = require './sandbox'

StepOnly = require './components/task-step/step-only'

routes = (
  <Route path='/' handler={App} name='root'>
    <Redirect from='/' to='dashboard' />
    <Route path='dashboard/?' name='dashboard' handler={Dashboard} />
    <Route path='courses/:courseId/?'>
      <Route path='list/?' name='viewStudentDashboard' handler={StudentDashboardShell} />
      <Route path='tasks/:id/?' name='viewTask' handler={SingleTask}>
        <DefaultRoute handler={StepOnly}/>
        <Route path='steps/:stepIndex/?' name='viewTaskStep' handler={StepOnly}/>
      </Route>

      <Route path='practice/?' name='viewPractice' handler={SinglePractice} />
      <Route path='guide/?' name='viewGuide' handler={LearningGuideShell} />

      <Route path='t/performance/?' name='viewPerformance' handler={PerformanceShell} />
      <Route path='t/calendar/?' name='taskplans' handler={TeacherTaskPlans} />
      <Route path='t/homeworks/new/?' name='createHomework' handler={HomeworkShell} />
      <Route path='t/homeworks/:id/?' name='editHomework' handler={HomeworkShell} />
      <Route path='t/readings/new/?' name='createReading' handler={ReadingShell} />
      <Route path='t/readings/:id/?' name='editReading' handler={ReadingShell} />
      <Route path='t/:type/:id/stats/?' name='viewStats' handler={StatsShell} />
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
