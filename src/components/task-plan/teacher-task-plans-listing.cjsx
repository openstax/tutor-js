React = require 'react'
moment = require 'moment'
BS = require 'react-bootstrap'
Router = require 'react-router'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../flux/teacher-task-plan'


TaskPlan = React.createClass
  displayName: 'TeacherTaskPlan'
  propTypes:
     plan: React.PropTypes.object.isRequired
     courseId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  onEditPlan: ->
    {courseId} = @props
    {id, type} = @props.plan
    if type is 'reading'
      @context.router.transitionTo('editReading', {courseId, id})
    else if type is 'homework'
      @context.router.transitionTo('editHomework', {courseId, id})

  onViewStats: ->
    {courseId} = @props
    {id} = @props.plan
    @context.router.transitionTo('viewStats', {courseId, id})

  render: ->
    {plan} = @props
    start  = moment(plan.opens_at)
    ending = moment(plan.due_at)
    duration = moment.duration( ending.diff(start) ).humanize()

    <div className="-list-item">
      <BS.ListGroupItem header={plan.title} onClick={@onEditPlan}>
        {start.fromNow()} ({duration})
      </BS.ListGroupItem>
      <BS.Button bsStyle="link" className="-tasks-list-stats-button" onClick={@onViewStats}>View Stats</BS.Button>
    </div>


TeacherTaskPlanListing = React.createClass

  contextTypes:
    router: React.PropTypes.func

  displayName: 'TeacherTaskPlanListing'

  componentDidMount:->
    {courseId} = @context.router.getCurrentParams()
    TeacherTaskPlanActions.load( courseId )

  componentWillMount: -> TeacherTaskPlanStore.addChangeListener(@update)
  componentWillUnmount: -> TeacherTaskPlanStore.removeChangeListener(@update)

  update: -> @setState({})

  render: ->
    {courseId} = @context.router.getCurrentParams()
    title = "Task plans for course ID #{courseId}"
    plans = for plan in TeacherTaskPlanStore.getCoursePlans(courseId)
      <TaskPlan key={plan.id} plan={plan} courseId={courseId} />
    # pull in underscore.inflection ?
    footer = <span>
      <Router.Link className="btn btn-primary" to="createReading" params={courseId: courseId}>Add a Reading</Router.Link>
      <Router.Link className="btn btn-primary" to="createHomework" params={courseId: courseId}>Add a Homework</Router.Link>
    </span>
    <BS.Panel header=title
        className="list-courses"
        bsStyle="primary"
        footer=footer>
      <BS.ListGroup id="tasks-list">
          {plans}
      </BS.ListGroup>
    </BS.Panel>

module.exports = TeacherTaskPlanListing
