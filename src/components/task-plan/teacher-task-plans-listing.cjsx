React = require 'react'
moment = require 'moment'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../flux/teacher-task-plan'
CourseCalendar = require '../course-calendar'

# TODO should probably make this a loadable?
TeacherTaskPlans = React.createClass

  contextTypes:
    router: React.PropTypes.func

  displayName: 'TeacherTaskPlans'

  componentDidMount:->
    {courseId} = @context.router.getCurrentParams()
    TeacherTaskPlanActions.load( courseId )

  componentWillMount: -> TeacherTaskPlanStore.addChangeListener(@update)
  componentWillUnmount: -> TeacherTaskPlanStore.removeChangeListener(@update)

  update: -> @setState({})

  render: ->
    {courseId} = @context.router.getCurrentParams()
    title = "Task plans for course ID #{courseId}"
    plansList = TeacherTaskPlanStore.getCoursePlans(courseId)

    footer = <span>
      <Router.Link className="btn btn-primary" to="createPlan" params={courseId: courseId, type: 'reading'}>Add a Reading</Router.Link>
      <Router.Link className="btn btn-primary" to="createPlan" params={courseId: courseId, type: 'homework'}>Add a Homework</Router.Link>
    </span>
    <BS.Panel header=title
        className="list-courses"
        bsStyle="primary"
        footer=footer>
      <CourseCalendar plansList={plansList} courseId={courseId}/>
    </BS.Panel>

module.exports = TeacherTaskPlans
