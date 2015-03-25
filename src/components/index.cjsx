# @cjsx React.DOM

_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

App = require './app'
Task = require './task'
LoadableMixin = require './loadable-mixin'
PracticeButton = require './practice-button'
{TaskActions, TaskStore} = require '../flux/task'
{CourseActions, CourseStore} = require '../flux/course'
{CurrentUserActions, CurrentUserStore} = require '../flux/current-user'


# Hack until we have the course listing page
courseId = 1

# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))



Dashboard = React.createClass
  componentWillMount: -> CurrentUserStore.addChangeListener(@update)
  componentWillUnmount: -> CurrentUserStore.removeChangeListener(@update)

  update: -> @setState({})
  render: ->
    if CurrentUserStore.isCoursesLoaded()
      courses = CurrentUserStore.getCourses()
      if courses.length
        courses = _.map courses, (course) ->
          {id:courseId, name, roles} = course

          isStudent = _.find roles, (role) -> role.type is 'student'
          isTeacher = _.find roles, (role) -> role.type is 'teacher'
          footer = []
          if isStudent or not isTeacher # HACK since a student does not currently have a role
            footer.push(<Router.Link className="btn btn-link -student" to="listTasks" params={{courseId}}>Task List (Student)</Router.Link>)

          if isTeacher
            footer.push(<Router.Link className="btn btn-link -teacher" to="taskplans" params={{courseId}}>Plan List (Teacher)</Router.Link>)

          footer = <span className="-footer-buttons">{footer}</span>

          <BS.Panel header={name} footer={footer} bsStyle="primary">
            <h1>Course: "{name}" Dashboard!</h1>
          </BS.Panel>

        return <div className="-course-list">{courses}</div>
      else
        return <div className="-course-list-empty">No Courses</div>

    else
      CurrentUserActions.loadAllCourses()

      <div className="-loading">Loading?</div>


SingleTask = React.createClass
  mixins: [Router.State, LoadableMixin]

  getFlux: ->
    store: TaskStore
    actions: TaskActions

  renderLoaded: ->
    {id} = @getParams()
    @transferPropsTo(<Task key={id} id={id} />)


SinglePractice = React.createClass
  mixins: [Router.State, LoadableMixin]

  componentWillMount: ->
    CourseStore.on('practice.loaded', @update)

  componentWillUnmount: ->
    CourseStore.off('practice.loaded', @update)

  getInitialState: ->
      taskId: CourseStore.getPracticeId(@getId())

  getFlux: ->
    store: CourseStore
    actions: CourseActions

  getId: ->
    @getParams().courseId

  update: ->
    @setState({
      taskId:  CourseStore.getPracticeId(@getId())
    })

  renderLoaded: ->
    @transferPropsTo(<Task key={@state.taskId} id={@state.taskId} />)


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
        <div className='ui-task-list ui-empty'>
          <p>No Tasks</p>
          <PracticeButton courseId={courseId}/>
        </div>
      else
        tasks = for task in allTasks
          if not task or task.type is "practice"
            continue
          <TaskResult id={task.id} />

        <div className='ui-task-list'>
          <h3>Current Tasks ({allTasks.length})</h3>
          {tasks}
          <PracticeButton courseId={courseId}/>
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

module.exports = {App, Dashboard, Tasks, SingleTask, SinglePractice, Invalid}
