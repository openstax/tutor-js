React = require 'react'
moment = require 'moment'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../flux/teacher-task-plan'


TaskPlan = React.createClass
  displayName: 'TeacherTaskPlan'
  propTypes:
     plan: React.PropTypes.object.isRequired
     courseId: React.PropTypes.object.isRequired

  mixins: [Router.Navigation]

  onEditPlan: ->
    {courseId} = @props
    {id} = @props.plan
    @transitionTo('editReading', {courseId, id})

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

  componentDidMount:->
    {courseId} = @getParams()
    TeacherTaskPlanActions.load( courseId )

  componentWillMount: -> TeacherTaskPlanStore.addChangeListener(@update)
  componentWillUnmount: -> TeacherTaskPlanStore.removeChangeListener(@update)

  update: -> @setState({})

  render: ->
    {courseId} = @getParams()
    title = "Task plans for course ID #{courseId}"
    plans = for plan in TeacherTaskPlanStore.getCoursePlans(courseId)
      <TaskPlan key={plan.id} plan={plan}, courseId={courseId} />
    # pull in underscore.inflection ?
    footer = <Router.Link className="btn btn-primary" to="createReading" params={{courseId}}>Add a Reading</Router.Link>
    <BS.Panel header=title
        className="list-courses"
        bsStyle="primary"
        footer=footer>
      <BS.ListGroup id="tasks-list">
          {plans}
      </BS.ListGroup>
    </BS.Panel>

module.exports = TeacherTaskPlanListing
