# @cjsx React.DOM

React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
{RouteHandler, Link} = Router


App = require './app'
Task = require './task'
LoadableMixin = require './loadable-mixin'
{TaskActions, TaskStore} = require '../flux/task'


# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))



Dashboard = React.createClass
  render: ->
    <div className="-dashboard">
      <p>Dashboard!</p>
      <div className="-student">
        <p>Student:</p>
        <Link className="btn" to="tasks">Task List</Link>
      </div>
      <div className="-teacher">
        <p>Teacher:</p>
        <Link className="btn btn-primary" to='createReading'>Add a Reading</Link>
      </div>
    </div>


SingleTask = React.createClass
  mixins: [Router.State, LoadableMixin]

  getFlux: ->
    store: TaskStore
    actions: TaskActions

  renderLoaded: ->
    {id} = @getParams()
    @transferPropsTo(<Task key={id} id={id} />)


TaskResult = React.createClass
  mixins: [Router.Navigation]
  render: ->
    {id} = @props.model
    actionTitle = 'Work Now'
    title = @props.model.title or err('BUG: Task without a title')

    if @props.model.steps.length is 1
      mainType = @props.model.steps[0].type
    else
      mainType = ''
      stepsInfo = <small className='details'>({@props.model.steps.length} steps)</small>

    <BS.Panel bsStyle="default" onClick={@onClick}>
      <Link to='task' params={{id}}><i className="fa fa-fw #{mainType}"></i> {title}</Link>
      {stepsInfo}
      <span className='pull-right'>
        <Link to='task' params={{id}} className='ui-action btn btn-primary btn-sm'>{actionTitle}</Link>
      </span>
    </BS.Panel>

  onClick: ->
    {id} = @props.model
    @transitionTo('task', {id})


Tasks = React.createClass

  componentWillMount: ->
    TaskActions.loadUserTasks()
    TaskStore.addChangeListener(@update)

  componentWillUnmount: -> TaskStore.removeChangeListener(@update)

  update: -> @setState({})

  render: ->
    allTasks = TaskStore.getAll()
    if allTasks
      if allTasks.length is 0
        <div className='ui-task-list ui-empty'>No Tasks</div>
      else
        tasks = for task in allTasks
          <TaskResult model={task} />

        <div className='ui-task-list'>
          <h3>Current Tasks ({allTasks.length})</h3>
          {tasks}
        </div>

    # else if
    #   <div>Error loading tasks. Please reload the page and try again</div>
    #
    # else
    #   <div>Loading...</div>


Invalid = React.createClass
  render: ->
    <div>
      <h1>Woops, this is an invalid page {@props.path}</h1>
      <Link to='dashboard'>Home</Link>
    </div>

module.exports = {App, Dashboard, Tasks, SingleTask, Invalid}
