_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

Root = require './root'
App = require './app'
Task = require './task'
LoadableItem = require './loadable-item'
{TaskActions, TaskStore} = require '../flux/task'
{CourseActions, CourseStore} = require '../flux/course'
{CurrentUserActions, CurrentUserStore} = require '../flux/current-user'


# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))

SingleTask = React.createClass
  displayName: 'SingleTask'
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {id} = @context.router.getCurrentParams()
    <LoadableItem
      id={id}
      store={TaskStore}
      actions={TaskActions}
      renderItem={-> <Task key={id} id={id} />}
    />


SinglePractice = React.createClass
  displayName: 'SinglePractice'
  contextTypes:
    router: React.PropTypes.func

  componentWillMount: ->
    @createPractice(@getId())
    CourseStore.on('practice.loaded', @update)

  componentWillUnmount: ->
    CourseStore.off('practice.loaded', @update)

  createPractice: (courseId) ->
    query = @context?.router?.getCurrentQuery()
    CourseActions.createPractice(courseId, query)

  getInitialState: ->
    # force a new practice each time
    taskId: null

  getId: ->
    {courseId} = @context.router.getCurrentParams()
    courseId

  update: ->
    @setState({
      taskId:  CourseStore.getPracticeId(@getId())
    })

  render: ->
    <LoadableItem
      id={@state.taskId}
      store={TaskStore}
      actions={TaskActions}
      renderItem={=> <Task key={@state.taskId} id={@state.taskId} />}
    />


TaskResult = React.createClass
  displayName: 'TaskResult'
  contextTypes:
    router: React.PropTypes.func
  propTypes:
    courseId: React.PropTypes.string.isRequired
    id: React.PropTypes.string.isRequired

  render: ->
    {courseId, id} = @props
    task = TaskStore.get(id)
    steps = TaskStore.getSteps(id)

    actionTitle = 'Work Now'
    title = task.title or err('BUG: Task without a title')

    if steps.length is 1
      mainType = steps[0].type
    else
      mainType = ''
      stepsInfo = <small className='details'>({steps.length} steps)</small>

    <BS.Panel bsStyle='default' onClick={@onClick}>
      <Router.Link
        to='viewTask'
        params={{courseId, id}}>
        <i className="fa fa-fw #{mainType}"></i>
        {title}
      </Router.Link>
      {stepsInfo}
      <span className='pull-right'>
        <Router.Link
          to='viewTask'
          params={{courseId, id}}
          className='ui-action btn btn-primary btn-sm'>
          {actionTitle}
        </Router.Link>
      </span>
    </BS.Panel>

  onClick: ->
    {courseId, id} = @props
    @context.router.transitionTo('viewTask', {courseId, id})


Invalid = React.createClass
  render: ->
    <div>
      <h1>Woops, this is an invalid page {@props.path}</h1>
      <Router.Link to='dashboard'>Home</Router.Link>
    </div>

module.exports = {App, SingleTask, SinglePractice, Invalid}
