# @cjsx React.DOM

React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

App = require './app'
Task = require './task'
LoadableMixin = require './loadable-mixin'
{TaskActions, TaskStore} = require '../flux/task'


# Hack until we have the course listing page
courseId = 1

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
        <Router.Link className="btn btn-primary" to="listTasks" params={{courseId}}>Task List</Router.Link>
      </div>
      <div className="-teacher">
        <p>Teacher:</p>
        <Router.Link className="btn btn-primary" to="taskplans" params={{courseId}}>Plan List</Router.Link>
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


Practice = React.createClass
  mixins: [Router.Navigation]
  render: ->  
    <BS.Button bsStyle="primary" onClick={@onClick}>Practice</BS.Button>
  onClick: ->
    @transitionTo('viewTask', {courseId, id: 'practice'})


TaskResult = React.createClass
  mixins: [Router.Navigation]
  render: ->
    {id} = @props
    task = TaskStore.get(id)
    steps = TaskStore.getSteps(id)

    actionTitle = 'Work Now'
    title = task.title or err('BUG: Task without a title')

    if steps.length is 1
      mainType = steps[0].type
    else
      mainType = ''
      stepsInfo = <small className='details'>({steps.length} steps)</small>

    <BS.Panel bsStyle="default" onClick={@onClick}>
      <Router.Link to="viewTask" params={{courseId, id}}><i className="fa fa-fw #{mainType}"></i> {title}</Router.Link>
      {stepsInfo}
      <span className="pull-right">
        <Router.Link to="viewTask" params={{courseId, id}} className="ui-action btn btn-primary btn-sm">{actionTitle}</Router.Link>
      </span>
    </BS.Panel>

  onClick: ->
    {id} = @props
    @transitionTo('viewTask', {courseId, id})


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
          <TaskResult id={task.id} />

        <div className='ui-task-list'>
          <h3>Current Tasks ({allTasks.length})</h3>
          {tasks}
          <Practice />
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
      <Router.Link to="dashboard">Home</Router.Link>
    </div>

module.exports = {App, Dashboard, Tasks, SingleTask, Invalid}
