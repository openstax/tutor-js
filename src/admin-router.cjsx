React = require 'react'
Router = require 'react-router'
{Route, Redirect, NotFoundRoute} = Router

Root      = require './components/root'

{Invalid} = require './components'
Admin = require './admin/index'
Exercises = require './admin/exercises'

ReferenceBookShell = require './components/ecosystems/book'
{ReferenceBookPageShell, ReferenceBookFirstPage} =
  require './components/reference-book'


routes = (
  <Route handler={Root} name='root'>
    <Router.DefaultRoute handler={Admin}/>
    <NotFoundRoute handler={Invalid} />
    <Route path='/' handler={Admin} name='admin'>

      <Route path='exercises' handler={Exercises} name='dashboard'>

        <Route path=':courseId/?' name='viewReferenceBook' handler={ReferenceBookShell} >

          <Route path='section/:section'
            name='viewReferenceBookSection' handler={ReferenceBookPageShell} />

        </Route>

      </Route>

    </Route>

  </Route>

)


router = Router.create({routes, location: Router.HistoryLocation})

start = (mountPoint) ->
  router.run (Handler) ->
    React.render(<Handler/>, mountPoint)

module.exports = {start, router, routes}
