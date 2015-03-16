# @cjsx React.DOM
React = require 'react'
Router = require 'react-router'
{Route, Redirect, NotFoundRoute} = Router
{App, Dashboard, Tasks, SingleTask, Invalid} = require './components'
ReadingPlan = require './components/task-plan/reading'
Stats = require './components/task-plan/reading-stats'
Sandbox = require './sandbox'

routes = (
  <Route path='/' handler={App}>
    <Redirect from='/' to='dashboard' />
    <Route path='dashboard/?' name='dashboard' handler={Dashboard} />
    <Route path='tasks/?' name='tasks' handler={Tasks} />  
    <Route path='tasks/:id/?' name='task' handler={SingleTask} />
    <Route path='readings/?' name='createReading' handler={ReadingPlan} />
    <Route path='readings/:id/?' name='editReading' handler={ReadingPlan} />
    <Route path='sandbox/?' name='sandbox' handler={Sandbox} />
    <Route path='plans/:id/stats/?' name='viewStats' handler={Stats} />
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
