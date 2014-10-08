# @cjsx React.DOM
React = require 'react'
{Link} = require 'react-router'

AsyncState = require './async-state'



App = React.createClass
  render: ->
    <div>
      <div className='navbar navbar-default navbar-fixed-top' role='navigation'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#ui-navbar-collapse'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>

            <Link to='dashboard' className='navbar-brand'>OpenStax Tutor</Link>
          </div>

          <div className='collapse navbar-collapse' id='ui-navbar-collapse'>
            <ul className='nav navbar-nav'>
              <li>
                <Link to='tasks'>Tasks</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      {@props.activeRouteHandler()}
      <br/>
      <br/>
      <br/>
      <div className='navbar navbar-default navbar-fixed-bottom' role='navigation'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            Page Footer
          </div>
        </div>
      </div>
    </div>

Dashboard = React.createClass
  render: ->
    <div>Dashboard!</div>

ReadingTask = React.createClass
  render: ->
    <div className='panel panel-default'>
      <div className='panel-heading'>
        Reading Asignment

        <span className='pull-right'>
          <a className='btn btn-primary btn-sm' target='_window' href={@props.item.content_url}>Read Now</a>
        </span>
      </div>
    </div>

Task = React.createClass
  render: ->
    TaskType = switch @props.item.type
      when 'reading' then ReadingTask
      else throw new Error('Invalid task type')

    <TaskType item={@props.item} />

Tasks = React.createClass
  mixins: [AsyncState]
  statics:
    getInitialAsyncState: (params, query, setState) ->
      results: $.ajax('/api/user/tasks', {dataType:'json'})

  render: ->
    if @state?.results
      if @state.results['total_count'] is 0
        <div>No Tasks</div>
      else
        tasks = for item in @state.results.items
          <Task item={item} />

        <div>
          <div>{@state.results['total_count']} tasks</div>
          {tasks}
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
