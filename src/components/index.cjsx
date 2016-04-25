_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
{ Link } = require 'react-router'

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
    params: React.PropTypes.object

  render: ->
    {id} = @context.params
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
    params: React.PropTypes.object

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
    {courseId} = @context.params
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
    params: React.PropTypes.object
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
      <Link to="/courses/#{courseId}/tasks/#{id}/?">
        <i className="fa fa-fw #{mainType}"></i>
        {title}
      </Link>
      {stepsInfo}
      <span className='pull-right'>
        <Link to="/courses/#{courseId}/tasks/#{id}/?"
          className='ui-action btn btn-primary btn-sm'>
          {actionTitle}
        </Link>
      </span>
    </BS.Panel>

  onClick: ->
    {courseId, id} = @props
    @context.router.push("/courses/#{courseId}/tasks/#{id}/")


Invalid = React.createClass
  render: ->
    <div>
      <h1>Woops, this is an invalid page {@props.path}</h1>
      <Link to='/dashboard'>Home</Link>
    </div>

module.exports = {App, SingleTask, SinglePractice, Invalid}
