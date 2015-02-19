# @cjsx React.DOM

React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
{RouteHandler, Link} = Router


App = require './app'
Task = require './task'
{TaskActions, TaskStore} = require '../flux/task'


# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))



Dashboard = React.createClass
  render: ->
    <div>Dashboard!</div>


SingleTask = React.createClass
  mixins: [Router.State]

  componentWillMount: ->
    # Fetch the task if it has not been loaded yet
    id = @getParams().id
    if TaskStore.isUnknown(id)
      TaskActions.load(id)

    # TODO: Only update if this task changed, not the entire Store
    @_forceUpdate = @forceUpdate.bind(@)
    TaskStore.addChangeListener(@_forceUpdate)

  componentWillUnmount: ->
    TaskStore.removeChangeListener(@_forceUpdate)

  render: ->
    id = @getParams().id
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

    @_forceUpdate = @forceUpdate.bind(@)
    TaskStore.addChangeListener(@_forceUpdate)

  componentWillUnmount: -> TaskStore.removeChangeListener(@_forceUpdate)


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
