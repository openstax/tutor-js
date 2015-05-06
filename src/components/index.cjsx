_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

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

Dashboard = React.createClass
  displayName: 'Dashboard'
  componentWillMount: -> CurrentUserStore.addChangeListener(@update)
  componentWillUnmount: -> CurrentUserStore.removeChangeListener(@update)

  contextTypes:
    router: React.PropTypes.func

  update: -> @setState({})

  redirectToSingleCourse: (courseId, roleType) ->
    destination = switch roleType
      when 'student' then 'viewStudentDashboard'
      when 'teacher' then 'taskplans'
      else
        throw new Error("BUG: Unrecognized role type #{roleType}")
    _.defer => @context.router.replaceWith(destination, {courseId: courseId})

  render: ->
    if CurrentUserStore.isCoursesLoaded()
      courses = CurrentUserStore.getCourses()
      if courses.length is 1 and courses[0].roles?.length is 1
        @redirectToSingleCourse(courses[0].id, courses[0].roles[0].type)
        return null # explicitly return null so React won't render

      if courses.length
        courses = _.map courses, (course) ->
          {id:courseId, name, roles} = course
          isStudent = _.find roles, (role) -> role.type is 'student'
          isTeacher = _.find roles, (role) -> role.type is 'teacher'
          footer = []
          if isStudent or not isTeacher # HACK since a student does not currently have a role
            footer.push(
              <Router.Link
                className='btn btn-link -student'
                to='viewStudentDashboard'
                params={{courseId}}>Task List (Student)</Router.Link>)

          if isTeacher
            footer.push(
              <Router.Link
                className='btn btn-link -teacher'
                to='taskplans'
                params={{courseId}}>
                Plan List (Teacher)
              </Router.Link>)

          footer = <span className='-footer-buttons'>{footer}</span>

          <BS.Panel header={name} footer={footer} bsStyle='primary'>
            <h1>Course: "{name}" Dashboard!</h1>
          </BS.Panel>

        return <div className='-course-list'>{courses}</div>
      else
        return <div className='-course-list-empty'>No Courses</div>

    else
      CurrentUserActions.loadAllCourses()

      <div className='-loading'>Loading?</div>


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
    CourseStore.on('practice.loaded', @update)

  componentWillUnmount: ->
    CourseStore.off('practice.loaded', @update)

  createPractice: (courseId) ->
    query = @context?.router?.getCurrentQuery()
    CourseActions.createPractice(courseId, query)

  getInitialState: ->
    @createPractice(@getId())

    # force a new practice each time
    taskId: undefined

  getId: ->
    {courseId} = @context.router.getCurrentParams()
    courseId

  update: ->
    @setState({
      taskId:  CourseStore.getPracticeId(@getId())
    })

  render: ->
    if @state.taskId
      <LoadableItem
        id={@state.taskId}
        store={TaskStore}
        actions={TaskActions}
        renderItem={=> <Task key={@state.taskId} id={@state.taskId} />}
      />
    else
      <div>Loading...</div>



TaskResult = React.createClass
  displayName: 'TaskResult'
  contextTypes:
    router: React.PropTypes.func
  propTypes:
    courseId: React.PropTypes.any.isRequired
    id: React.PropTypes.any.isRequired

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

module.exports = {App, Dashboard, SingleTask, SinglePractice, Invalid}
