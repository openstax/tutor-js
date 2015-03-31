# @cjsx React.DOM
React = require 'react'
Router = require 'react-router'
{Route, Redirect, NotFoundRoute} = Router
{App, Dashboard, Tasks, SingleTask, SinglePractice, Invalid} = require './components'
{ReadingShell} = require './components/task-plan/reading'
TeacherTaskPlans = require './components/task-plan/teacher-task-plans-listing'

Stats = require './components/task-plan/reading-stats'
{GuideShell} = require './components/task-plan/guide'

Sandbox = require './sandbox'

routes = (
  <Route path='/' handler={App}>
    <Redirect from='/' to='dashboard' />
    <Route path='dashboard/?' name='dashboard' handler={Dashboard} />
    <Route path='courses/:courseId/tasks/?' name='listTasks' handler={Tasks} />
    <Route path='courses/:courseId/tasks/:id/?' name='viewTask' handler={SingleTask} />
    <Route path='courses/:courseId/practice/?' name='viewPractice' handler={SinglePractice} />
    <Route path='courses/:courseId/readings/?' name='taskplans' handler={TeacherTaskPlans} />
    <Route path='courses/:courseId/readings/new/?' name='createReading' handler={ReadingShell} />
    <Route path='courses/:courseId/readings/:id/?' name='editReading' handler={ReadingShell} />
    <Route path='courses/:courseId/readings/:id/stats/?' name='viewStats' handler={Stats} />
    <Route path='courses/:courseId/guide/?' name='viewGuide' handler={GuideShell} />
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

module.exports = {start, router}
