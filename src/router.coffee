# @cjsx React.DOM
React = require 'react'
{Routes, Route, Redirect, NotFoundRoute} = require 'react-router'
{App, Dashboard, Tasks, Invalid} = require './components'

start = (mountPoint) ->

  router =
    <Routes location='history'>
      <Redirect path='/' to='dashboard' />
      <Route path='/' handler={App}>
        <Route path='dashboard' name='dashboard' handler={Dashboard} />
        <Route path='tasks' name='tasks' handler={Tasks} />
        <NotFoundRoute handler={Invalid}/>
      </Route>
    </Routes>

  React.renderComponent(router, mountPoint)


module.exports = {start}
