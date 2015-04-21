React = require 'react'
moment = require 'moment'
BS = require 'react-bootstrap'
Router = require 'react-router'

Loadable = require '../loadable'
{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../flux/teacher-task-plan'
CourseCalendar = require '../course-calendar'

TeacherTaskPlans = React.createClass

  contextTypes:
    router: React.PropTypes.func

  displayName: 'TeacherTaskPlans'

  componentDidMount:->
    {courseId} = @context.router.getCurrentParams()

    # Bypass loading if plan is already loaded, as is the case in testing.
    if not TeacherTaskPlanStore.isLoaded(courseId)
      TeacherTaskPlanActions.load( courseId )

  componentWillMount: -> TeacherTaskPlanStore.addChangeListener(@update)
  componentWillUnmount: -> TeacherTaskPlanStore.removeChangeListener(@update)

  update: -> @setState({})

  render: ->
    {courseId} = @context.router.getCurrentParams()
    title = "Task plans for course ID #{courseId}"
    plansList = TeacherTaskPlanStore.getCoursePlans(courseId)

    footer = <span className="-footer">
      <Router.Link className="btn btn-primary" to="createPlan" params={courseId: courseId, type: 'reading'}>Add a Reading</Router.Link>
      <Router.Link className="btn btn-primary" to="createPlan" params={courseId: courseId, type: 'homework'}>Add a Homework</Router.Link>
    </span>
    <BS.Panel header={title}
        className="list-courses"
        bsStyle="primary"
        footer={footer}>

      <Loadable
        store={TeacherTaskPlanStore}
        isLoading={-> TeacherTaskPlanStore.isLoading(courseId)}
        isLoaded={-> TeacherTaskPlanStore.isLoaded(courseId)}
        isFailed={-> TeacherTaskPlanStore.isFailed(courseId)}
        render={-> <CourseCalendar plansList={plansList} courseId={courseId}/>}
        update={@update}
      />

    </BS.Panel>

module.exports = TeacherTaskPlans
