# @cjsx React.DOM

React = require 'react'
{Link, transitionTo} = require 'react-router'

AsyncState = require '../async-state'
API = require '../api'
Task = require './task'
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
    @transferPropsTo(<Task key={id} id={id} />)


TaskResult = React.createClass
  render: ->
    {id} = @props.model
    actionTitle = 'Work Now'
    title = @props.model.title or err('BUG: Task without a title')

    if @props.model.steps.length is 1
      mainType = @props.model.steps[0].type
    else
      mainType = ''
      stepsInfo = <small className='details'>({@props.model.steps.length} steps)</small>

    <div className='panel panel-default'>
      <div className='panel-body' onClick={@onClick}>
        <Link to='task' id={id}><i className="fa fa-fw #{mainType}"></i> {title}</Link>
        {stepsInfo}
        <span className='pull-right'>
          <Link className='ui-action btn btn-primary btn-sm' to='task' id={id}>{actionTitle}</Link>
        </span>
      </div>
    </div>

  onClick: ->
    {id} = @props.model
    transitionTo('task', {id})


Tasks = React.createClass
  mixins: [AsyncState]
  statics:
    getInitialAsyncState: (params, query, setState) ->
      model: API.fetchUserTasks()

  render: ->
    if @state?.model
      if @state.model['total_count'] is 0
        <div className='ui-task-list ui-empty'>No Tasks</div>
      else
        tasks = for task in @state.model.items
          <TaskResult model={task} />

        <div className='ui-task-list'>
          <h3>Current Tasks ({@state.model['total_count']})</h3>
          {tasks}
        </div>

    else if @state?.model_error
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
