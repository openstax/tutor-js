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

  onEditPlan: ->
    {courseId, plan} = @props
    {id, type} = plan
    if type is 'reading'
      @context.router.transitionTo('editReading', {courseId, id})
    else if type is 'homework'
      @context.router.transitionTo('editHomework', {courseId, id})

  onViewStats: ->
    {courseId, plan} = @props
    {id} = @props.plan
    @context.router.transitionTo('viewStats', {courseId, id})

  render: ->
    {plan} = @props
    start  = moment(plan.opens_at)
    ending = moment(plan.due_at)
    duration = moment.duration( ending.diff(start) ).humanize()

    <div className='-list-item'>
      <BS.ListGroupItem header={plan.title} onClick={@onEditPlan}>
        {start.fromNow()} ({duration})
      </BS.ListGroupItem>
      <BS.Button
        bsStyle='link'
        className='-tasks-list-stats-button'
        onClick={@onViewStats}>View Stats</BS.Button>
    </div>


TeacherTaskPlanListing = React.createClass

  contextTypes:
    router: React.PropTypes.func

  displayName: 'TeacherTaskPlanListing'

  componentDidMount: ->
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

    plans = for plan in plansList
      <TeacherTaskPlans key={plan.id} plan={plan}, courseId={courseId} />

    <BS.Panel header={title}
        className='list-courses'
        bsStyle='primary'>

      <Loadable
        store={TeacherTaskPlanStore}
        isLoading={-> TeacherTaskPlanStore.isLoading(courseId)}
        isLoaded={-> TeacherTaskPlanStore.isLoaded(courseId)}
        isFailed={-> TeacherTaskPlanStore.isFailed(courseId)}
        render={-> <CourseCalendar plansList={plansList} courseId={courseId}/>}
        update={@update}
      />

    </BS.Panel>

module.exports = TeacherTaskPlanListing
