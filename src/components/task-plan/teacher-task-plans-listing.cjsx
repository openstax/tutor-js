React = require 'react'
moment = require 'moment-timezone'
BS = require 'react-bootstrap'
_ = require 'underscore'

LoadableItem = require '../loadable-item'
{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../flux/teacher-task-plan'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{CourseStore} = require '../../flux/course'
{TimeStore} = require '../../flux/time'
TimeHelper = require '../../helpers/time'

DATE_FORMAT = 'YYYY-MM-DD'

CourseCalendar = require '../course-calendar'
CourseDataMixin = require '../course-data-mixin'

TeacherTaskPlans = React.createClass

  contextTypes:
    router: React.PropTypes.func
    params: React.PropTypes.object

  onEditPlan: ->
    {courseId, plan} = @props
    {id, type} = plan
    if type is 'reading'
      @context.router.push("/courses/#{courseId}/t/readings/#{id}")
    else if type is 'homework'
      @context.router.push("/courses/#{courseId}/t/homeworks/#{id}")

  onViewStats: ->
    {courseId, plan} = @props
    {id} = @props.plan
    @context.router.push("/courses/#{courseId}/t/plans/#{id}/stats")

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

TaskPlanListingOnEnter = (nextState, replace, callback) ->
  {date, planId, courseId} = nextState.params
  course = CourseStore.get(courseId)
  if course.is_concept_coach
    replace("/course/#{courseId}/t/cc-dashboard")
    return callback()

  unless date? and moment(date, DATE_FORMAT).isValid()
    date = moment(TimeStore.getNow())
    params.date = date.format(DATE_FORMAT)
    replace("/courses/#{courseId}/t/calendar/months/#{params.date}")
    return callback()

  if planId? and TaskPlanStore.isDeleteRequested(planId)
    replace("/courses/#{courseId}/t/calendar/months/#{date}")
    return callback()

  callback()

TeacherTaskPlanListing = React.createClass

  displayName: 'TeacherTaskPlanListing'

  contextTypes:
    router: React.PropTypes.func
    params: React.PropTypes.object

  propTypes:
    dateFormat: React.PropTypes.string

  getDefaultProps: ->
    dateFormat: DATE_FORMAT

  mixins: [CourseDataMixin]

  componentWillMount: ->
    {courseId} = @context.params
    TimeHelper.syncCourseTimezone(courseId)

  componentWillUnmount: ->
    {courseId} = @context.params
    TimeHelper.unsyncCourseTimezone(courseId)

  getDateFromParams: ->
    {date} = @context.params
    if date?
      date = TimeHelper.getMomentPreserveDate(date, @props.dateFormat)
    date

  render: ->
    {courseId} = @context.params
    courseDataProps = @getCourseDataProps(courseId)

    date = @getDateFromParams()

    loadPlansList = _.partial(TeacherTaskPlanStore.getActiveCoursePlans, courseId)

    loadedCalendarProps = {loadPlansList, courseId, date}

    <div {...courseDataProps} className="tutor-booksplash-background">

      <BS.Panel
          className='list-courses'
          bsStyle='primary'>

        <LoadableItem
          store={TeacherTaskPlanStore}
          actions={TeacherTaskPlanActions}
          id={courseId}
          renderItem={-> <CourseCalendar {...loadedCalendarProps}/>}
          renderLoading={-> <CourseCalendar className='calendar-loading'/>}
        />

      </BS.Panel>
    </div>

module.exports = {TeacherTaskPlanListing, TaskPlanListingOnEnter}
