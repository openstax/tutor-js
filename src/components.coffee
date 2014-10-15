# @cjsx React.DOM
$ = require 'jquery'
React = require 'react'
{Link} = require 'react-router'

AsyncState = require './async-state'
Cache = require './cache'


# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))

App = React.createClass

  logout: ->
    $.ajax('/accounts/logout', {method: 'DELETE'})
    .always ->
      window.location.href = '/'

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
            <ul className='nav navbar-nav navbar-right'>
              <li>
                <button className='btn btn-link' onClick={@logout}>Sign out!</button>
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
  mixins: [AsyncState]
  statics:
    getInitialAsyncState: (params, query, setState) ->
      promise = Cache.fetchTask(params.id)
      htmlPromise = promise.then (task) ->
        err('no content_url') unless task.content_url
        unless task.content_html
          return $.ajax(task.content_url, {dataType:'html'})
          .then (raw_html) ->
            task.content_html = raw_html
            raw_html
        return task.content_html

      task: promise
      content_html: htmlPromise

  # HACK to load images from http://archive.cnx.org
  # <img src> tags are parsed **immediately** when the DOM node is created.
  # Since the HTML contains references to `/resources/...` make sure the browser
  # fetches the images from archive.cnx.org.
  #
  # But, as soon as the images are fetched, change the base back to tutor
  # so all links do not point to archive.
  componentWillUpdate: ->
    if $('base')[0]
      $('base').attr('href', 'http://archive.cnx.org')
    else
      $('body').append("<base href='http://archive.cnx.org' />")

  componentDidUpdate: ->
    $('base').attr('href', '')

  render: ->
    if @props.task.content_html

      <div className='panel panel-default'>
        <div className='panel-heading'>
          Reading Asignment

          <span className='pull-right'>
            <a className='btn btn-primary btn-sm' target='_window' href={@state.task.content_url}>Open in new Tab</a>
          </span>
        </div>
        <div className='panel-body' dangerouslySetInnerHTML={{__html: @state.content_html}} />
      </div>

    else if @state?.content_html_error
      <div>Error loading Reading task. Please reload the page and try again</div>

    else

      <div>Loading...</div>


SimulationTask = React.createClass

  render: ->
    <div className='panel panel-default ost-simulation'>
      <div className='panel-heading'>
        Simulation

        <span className='pull-right'>
          <a className='btn btn-primary btn-sm' target='_window' href={@props.task.content_url}>Open in new Tab</a>
        </span>
      </div>
      <div className='panel-body'>
        <iframe src={@props.task.content_url} />
      </div>
    </div>


SingleTask = React.createClass
  mixins: [AsyncState]
  statics:
    getInitialAsyncState: (params, query, setState) ->
      promise = Cache.fetchTask(params.id)
      task: promise

  render: ->
    if @state?.task
      Type = switch @state.task.type
        when 'reading' then ReadingTask
        when 'simulation' then SimulationTask
        else err('BUG: Invalid task type', @props)
      @transferPropsTo(<Type task={@state.task} />)
    else
      <div>Loading...</div>

TaskResult = React.createClass
  render: ->
    {id} = @props.item
    {title, actionTitle} = switch @props.item.type
      when 'reading' then {title: 'Reading Task', actionTitle: 'Read Now'}
      when 'simulation' then {title: 'Simulation Task', actionTitle: 'Play Now'}
      else err('Invalid task type')


    <div className='panel panel-default'>
      <div className='panel-heading'>
        <Link to='task' id={id}>{title}</Link>

        <span className='pull-right'>
          <Link className='btn btn-primary btn-sm' to='task' id={id}>{actionTitle}</Link>
        </span>
      </div>
    </div>


Tasks = React.createClass
  mixins: [AsyncState]
  statics:
    getInitialAsyncState: (params, query, setState) ->
      results: Cache.fetchUserTasks()

  render: ->
    if @state?.results
      if @state.results['total_count'] is 0
        <div>No Tasks</div>
      else
        tasks = for item in @state.results.items
          <TaskResult item={item} />

        <div>
          <h3>Current Tasks ({@state.results['total_count']})</h3>
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

module.exports = {App, Dashboard, Tasks, SingleTask, Invalid}
