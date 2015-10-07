React = require 'react'
moment = require 'moment-timezone'
BS = require 'react-bootstrap'
Router = require 'react-router'
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

  displayName: 'TeacherTaskPlanListing'

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    dateFormat: React.PropTypes.string

  getDefaultProps: ->
    dateFormat: DATE_FORMAT

  mixins: [CourseDataMixin]

  statics:
    willTransitionTo: (transition, params, query, callback) ->
      {date, planId} = params
      unless date? and moment(date, DATE_FORMAT).isValid()
        date = moment(TimeStore.getNow())
        params.date = date.format(DATE_FORMAT)
        transition.redirect('calendarByDate', params)
        return callback()

      if planId? and TaskPlanStore.isDeleteRequested(planId)
        transition.redirect('calendarByDate', _.omit(params, 'planId'))
        return callback()

      callback()

  componentWillMount: ->
    {courseId} = @context.router.getCurrentParams()
    TimeHelper.syncCourseTimezone(courseId)

  componentWillUnmount: ->
    {courseId} = @context.router.getCurrentParams()
    TimeHelper.unsyncCourseTimezone(courseId)

  getDateFromParams: ->
    {date} = @context.router.getCurrentParams()
    if date?
      date = moment(date, @props.dateFormat)
    date

  render: ->
    {courseId} = @context.router.getCurrentParams()
    courseDataProps = @getCourseDataProps(courseId)

    date = @getDateFromParams()

    loadPlansList = TeacherTaskPlanStore.getActiveCoursePlans.bind(TeacherTaskPlanStore, courseId)

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
          update={@update}
        />

      </BS.Panel>
    </div>

module.exports = TeacherTaskPlanListing
