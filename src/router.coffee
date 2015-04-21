# @cjsx React.DOM
React = require 'react'
Router = require 'react-router'
{Route, Redirect, NotFoundRoute} = Router
{App, Dashboard, TasksShell, SingleTask, SinglePractice, Invalid} = require './components'
{PlanShell} = require './components/task-plan'
{LearningGuideShell} = require './components/learning-guide'
TeacherTaskPlans = require './components/task-plan/teacher-task-plans-listing'

{StatsShell} = require './components/task-plan/reading-stats'

Sandbox = require './sandbox'

routes = (
  <Route path='/' handler={App}>
    <Redirect from='/' to='dashboard' />
    <Route path='dashboard/?' name='dashboard' handler={Dashboard} />
    <Route path='courses/:courseId/tasks/?' name='listTasks' handler={TasksShell} />
    <Route path='courses/:courseId/tasks/:id/?' name='viewTask' handler={SingleTask} />
    <Route path='courses/:courseId/practice/?' name='viewPractice' handler={SinglePractice} />
    <Route path='courses/:courseId/readings/?' name='taskplans' handler={TeacherTaskPlans} />
    <Route path='courses/:courseId/guide/?' name='viewGuide' handler={LearningGuideShell} />
    <Route path='courses/:courseId/:type/new/?' name='createPlan' handler={PlanShell} />
    <Route path='courses/:courseId/:type/:id/?' name='editPlan' handler={PlanShell} />
    <Route path='courses/:courseId/:type/:id/stats/?' name='viewStats' handler={StatsShell} />
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
