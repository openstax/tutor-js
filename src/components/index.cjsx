# @cjsx React.DOM

React = require 'react'
{Link} = require 'react-router'

AsyncState = require '../async-state'
API = require '../api'
{ReadingTask, InteractiveTask, ExerciseTask, AssignmentTask} = require './tasks'
{TaskActions, TaskStore} = require '../flux/task'
{CurrentUserActions} = require '../flux/current-user'

# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))

App = React.createClass

  logout: -> CurrentUserActions.logout()

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

            <Link to='dashboard' className='navbar-brand'>
              <i className='ui-brand-logo'></i>
            </Link>

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
      {@props.activeRouteHandler()}
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


SingleTask = React.createClass

  componentWillMount: ->
    # Fetch the task if it has not been loaded yet
    id = @props.params.id
    if TaskStore.isUnknown(id)
      TaskActions.load(id)

    # TODO: Only update if this task changed, not the entire Store
    @_forceUpdate = @forceUpdate.bind(@)
    TaskStore.addChangeListener(@_forceUpdate)

  componentWillUnmount: ->
    TaskStore.removeChangeListener(@_forceUpdate)

  render: ->
    id = @props.params.id
    switch TaskStore.getAsyncStatus(id)
      when 'loaded'
        task = TaskStore.get(id)
        Type = switch task.type
          when 'reading' then ReadingTask
          when 'interactive' then InteractiveTask
          when 'exercise' then ExerciseTask
          when 'assignment' then AssignmentTask
          else err('BUG: Invalid task type', @props)
        @transferPropsTo(<Type task={task} />)

      when 'failed'
        <div>Error. Please refresh</div>

      when 'loading'
        <div>Loading...</div>

      else
        <div>Starting loading</div>


TaskResult = React.createClass
  render: ->
    {id} = @props.item
    {title, actionTitle} = switch @props.item.type
      when 'reading' then {title: 'Reading Task', actionTitle: 'Read Now'}
      when 'interactive' then {title: 'Interactive Task', actionTitle: 'Play Now'}
      when 'exercise' then {title: 'Exercise Task', actionTitle: 'Answer Now'}
      when 'assignment' then {title: 'Assignment', actionTitle: 'Work on Now'}
      else err('Invalid task type')

    <div className='panel panel-default'>
      <div className='panel-heading'>
        <Link to='task' id={id}>{title}</Link>
        <span className='pull-right'>
          <Link className='ui-action btn btn-primary btn-sm' to='task' id={id}>{actionTitle}</Link>
        </span>
      </div>
    </div>


Tasks = React.createClass
  mixins: [AsyncState]
  statics:
    getInitialAsyncState: (params, query, setState) ->
      results: API.fetchUserTasks()

  render: ->
    if @state?.results
      if @state.results['total_count'] is 0
        <div className='ui-task-list ui-empty'>No Tasks</div>
      else
        tasks = for item in @state.results.items
          <TaskResult item={item} />

        <div className='ui-task-list'>
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
