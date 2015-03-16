React = require 'react'
moment = require 'moment'
BS = require 'react-bootstrap'
Router = require 'react-router'

TESTING_COURSE_ID=1

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../flux/teacher-task-plan'


TaskPlan = React.createClass
  displayName: 'TeacherTaskPlan'
  propTypes:
     plan: React.PropTypes.object.isRequired

  mixins: [Router.Navigation]

  onEditPlan: ->
    @transitionTo('editReading', {id:@props.plan.id})

  render: ->
    start  = moment(@props.plan.opens_at)
    ending = moment(@props.plan.due_at)
    duration = moment.duration( ending.diff(start) ).humanize()
    <BS.ListGroupItem header={@props.plan.title} onClick={@onEditPlan}>
      {start.fromNow()} ({duration})
    </BS.ListGroupItem>


TeacherTaskPlanListing = React.createClass
  mixins: [Router.State, Router.Navigation]
  displayName: 'TeacherTaskPlanListing'

  propTypes:
     courseId: React.PropTypes.number

  getDefaultProps: ->
      courseId: TESTING_COURSE_ID

  componentDidMount:->
    TeacherTaskPlanActions.load( @props.courseId )

  componentWillMount: -> TeacherTaskPlanStore.addChangeListener(@update)
  componentWillUnmount: -> TeacherTaskPlanStore.removeChangeListener(@update)

  update: -> @setState({})

  render: ->
    title = "Task plans for course ID #{@props.courseId}"
    plans = for plan in TeacherTaskPlanStore.getCoursePlans(@props.courseId)
      <TaskPlan key={plan.id} plan={plan} />
    # pull in underscore.inflection ?
    footer = <Router.Link className="btn btn-primary" to='createReading'>Add a Reading</Router.Link>
    <BS.Panel header=title
        className="list-courses"
        bsStyle="primary"
        footer=footer>
      <BS.ListGroup id="tasks-list">
          {plans}
      </BS.ListGroup>
    </BS.Panel>

module.exports = TeacherTaskPlanListing
