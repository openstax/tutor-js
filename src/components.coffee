# @cjsx React.DOM
React = require 'react'
{Link} = require 'react-router'

AsyncState = require './async-state'



App = React.createClass
  render: ->
    @props.activeRouteHandler()

Dashboard = React.createClass
  render: ->
    <Link to='tasks'>Tasks</Link>

Tasks = React.createClass
  mixins: [AsyncState]
  statics:
    getInitialAsyncState: (params, query, setState) ->
      results: $.ajax('/api/user/tasks', {dataType:'json'})

  render: ->
    if @state?.results
      if @state.results['total_count'] is 0
        taskCount = 'No Tasks'
      else
        taskCount = "#{@state.results['total_count']} tasks"

      <div>
        <Link to='dashboard'>Home</Link>
        <br/>{taskCount}
      </div>

    else if @state?.results_error
      <div>Error loading tasks. Please reload the page and try again</div>

    else
      <div>Loading...</div>

Invalid = React.createClass
  render: ->
    <div>
      <h1>Woops, this is an invalid page {@props.path}</h1>
      <Link to='dashboard'>Home</Link>
    </div>

module.exports = {App, Dashboard, Tasks, Invalid}
