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
PH = require '../../helpers/period'
CourseTitleBanner = require '../course-title-banner'
CourseCalendar = require '../course-calendar'

getDisplayBounds =
  month: (date) ->
    startAt: TimeHelper.toISO(
      date.clone().startOf('month').startOf('week').subtract(1, 'day')
    )
    endAt: TimeHelper.toISO(
      date.clone().endOf('month').endOf('week').add(1, 'day')
    )

TeacherTaskPlans = React.createClass

  contextTypes:
    router: React.PropTypes.object

  propTypes:
    params: React.PropTypes.shape(
      courseId: React.PropTypes.string.isRequired
      date:     React.PropTypes.string
    ).isRequired

  onEditPlan: ->
    courseId = @props.params.courseId
    {plan} = @props
    {id, type} = plan
    if type is 'reading'
      @context.router.transitionTo("/courses/#{courseId}/editReading")
    else if type is 'homework'
      @context.router.transitionTo('editHomework', {courseId, id})

  onViewStats: ->
    courseId = @props.params.courseId
    {plan} = @props
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

  displayName: 'TeacherTaskPlanListing'

  propTypes:
    dateFormat: React.PropTypes.string
    date: React.PropTypes.string

  getDefaultProps: ->
    dateFormat: TimeHelper.ISO_DATE_FORMAT

  getInitialState: ->
    startingState =
      displayAs: 'month'

  getDateStates: (state) ->
    date = @getDateFromParams()

    bounds = @getBoundsForDate(date, state)
    _.extend({date}, bounds)

  getBoundsForDate: (date, state) ->
    state ?= @state

    {displayAs} = state

    getDisplayBounds[displayAs](date)

  componentWillMount: ->
    courseId = @props.params.courseId
    courseTimezone = CourseStore.getTimezone(courseId)
    TimeHelper.syncCourseTimezone(courseTimezone)

  componentWillUnmount: ->
    TimeHelper.unsyncCourseTimezone()

  getDateFromParams: ->
    {date} = @props.params
    TimeHelper.getMomentPreserveDate(date or new Date, @props.dateFormat)

  isLoadingOrLoad: ->
    courseId = @props.params.courseId
    {startAt, endAt} = @getDateStates()

    TeacherTaskPlanStore.isLoadingRange(courseId, startAt, endAt)

  loadRange: ->
    courseId = @props.params.courseId
    {startAt, endAt} = @getDateStates()

    TeacherTaskPlanActions.load(courseId, startAt, endAt)

  render: ->
    {params} = @props

    {courseId} = params

    {displayAs} = @state
    {date, startAt, endAt} = @getDateStates()

    course  = CourseStore.get(courseId)
    hasPeriods = PH.hasPeriods(course)

    loadPlansList = _.partial(TeacherTaskPlanStore.getActiveCoursePlans, courseId)
    loadedCalendarProps = {loadPlansList, courseId, date, displayAs, hasPeriods, params}
    loadingCalendarProps = if hasPeriods
      {
        loadPlansList,
        courseId,
        date,
        displayAs,
        hasPeriods,
        params,
        className: 'calendar-loading'
      }
    else
      loadedCalendarProps

    <div className="list-task-plans">

      <CourseTitleBanner courseId={courseId} />

      <LoadableItem
        store={TeacherTaskPlanStore}
        actions={TeacherTaskPlanActions}
        load={@loadRange}
        options={{startAt, endAt}}
        id={courseId}
        isLoadingOrLoad={@isLoadingOrLoad}
        renderItem={-> <CourseCalendar {...loadedCalendarProps}/>}
        renderLoading={-> <CourseCalendar {...loadingCalendarProps}/>}
      />

    </div>

module.exports = TeacherTaskPlanListing
