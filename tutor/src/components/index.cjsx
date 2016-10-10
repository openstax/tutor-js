_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

Root = require './root'
App = require './app'
Task = require './task'
LoadableItem = require './loadable-item'
{TaskActions, TaskStore} = require '../flux/task'
{CoursePracticeActions, CoursePracticeStore} = require '../flux/practice'
{CurrentUserActions, CurrentUserStore} = require '../flux/current-user'


# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))


SinglePractice = React.createClass
  displayName: 'SinglePractice'
  contextTypes:
    router: React.PropTypes.func

  componentWillMount: ->
    CoursePracticeStore.on("loaded.#{@getId()}", @update)
    @createPractice(@getId())

  componentWillUnmount: ->
    CoursePracticeStore.off("loaded.#{@getId()}", @update)

  createPractice: (courseId) ->
    query = @context?.router?.getCurrentQuery()
    CoursePracticeActions.create(courseId, query)

  getInitialState: ->
    # force a new practice each time
    taskId: null

  getId: ->
    {courseId} = @context.router.getCurrentParams()
    courseId

  update: ->
    @setState({
      taskId:  CoursePracticeStore.getTaskId(@getId())
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


module.exports = {App, SinglePractice}
