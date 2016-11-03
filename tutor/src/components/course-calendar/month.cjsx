React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
moment = require 'moment-timezone'
twix = require 'twix'
_ = require 'underscore'
classnames = require 'classnames'
qs = require 'qs'
extend = require 'lodash/extend'
{DropTarget} = require 'react-dnd'
{Calendar, Month, Week, Day} = require 'react-calendar'
{TeacherTaskPlanStore} = require '../../flux/teacher-task-plan'
{TimeStore} = require '../../flux/time'
TimeHelper = require '../../helpers/time'
Router = require '../../helpers/router'

{ItemTypes, TaskDrop, DropInjector} = require './task-dnd'

TaskPlanMiniEditor   = require '../task-plan/mini-editor'
PlanClonePlaceholder = require './plan-clone-placeholder'
CourseCalendarHeader = require './header'
CourseAddMenuMixin   = require './add-menu-mixin'
CourseDuration       = require './duration'
CoursePlan           = require './plan'
CourseAdd            = require './add'

CourseMonth = React.createClass
  displayName: 'CourseMonth'

  mixins: [CourseAddMenuMixin]

  contextTypes:
    router: React.PropTypes.object

  propTypes:
    plansList: React.PropTypes.array
    date: TimeHelper.PropTypes.moment
    hasPeriods: React.PropTypes.bool.isRequired
    courseId: React.PropTypes.string.isRequired

  childContextTypes:
    date: TimeHelper.PropTypes.moment
    dateFormatted: React.PropTypes.string

  getChildContext: ->
    date: @props.date
    dateFormatted: @props.date.format(@props.dateFormat)

  getInitialState: ->
    showingSideBar: false
    activeAddDate: null

  getDefaultProps: ->
    date: moment(TimeStore.getNow())

  setDateParams: (date) ->
    {params} = @props
    params.date = date.format(@props.dateFormat)

    date = date.format(@props.dateFormat)
    @context.router.transitionTo(Router.makePathname('calendarByDate', params))

  setDate: (date) ->
    unless moment(date).isSame(@props.date, 'month')
      @setDateParams(date)

  getMonthMods: (calendarDuration) ->
    date = moment(TimeStore.getNow())
    mods = [
      {
        component: [ 'day' ]
        events:
          onClick: @handleDayClick
          onDragEnter: @onDragHover
      }
    ]

    getClassNameForDate = (dateToModify) ->
      if dateToModify.isBefore(date, 'day')
        'past'
      else if dateToModify.isAfter(date, 'day')
        'upcoming'
      else
        'current'

    makeModForDate = (dateToModify, calendarDate) ->
      # hacking moment instance to bypass naive filter
      # https://github.com/freiksenet/react-calendar/blob/master/src/Month.js#L64-L65
      # TODO make a pr to include mods for month edges in react-calendar
      # Otherwise, outside of month days do not get the mods.
      hackedDate = dateToModify.clone()
      {isSame} = hackedDate
      hackedDate.isSame = (dateToCompare, period) ->
        if dateToCompare.isSame(calendarDate, 'day') and period is 'month'
          true
        else
          isSame.call(hackedDate, dateToCompare, period)

      date: hackedDate
      component: [ 'day' ]
      classNames: [ getClassNameForDate(dateToModify) ]

    daysOfDuration = calendarDuration.iterate('days')

    while daysOfDuration.hasNext()
      mods.push(makeModForDate(daysOfDuration.next(), @props.date))

    mods

  componentDidUpdate: ->
    @setDayHeight(@refs.courseDurations.state.ranges) if @refs.courseDurations?

  setDayHeight: (ranges) ->
    calendar =  ReactDOM.findDOMNode(@)
    nodesWithHeights = calendar.querySelectorAll('.rc-Week')

    # Adjust calendar height for each week to accomodate the number of plans shown on this week
    # CALENDAR_DAY_DYNAMIC_HEIGHT, see less for property that is overwritten.
    Array.prototype.forEach.call(nodesWithHeights, (node, nthRange) ->
      range = _.findWhere(ranges, {nthRange: nthRange})
      node.style.height = range.dayHeight + 'rem'
    )

  getDurationInfo: (date) ->
    startMonthBlock = date.clone().startOf('month').startOf('week')
    # needs to be 12:00 AM the next day
    endMonthBlock = date.clone().endOf('month').endOf('week').add(1, 'millisecond')

    calendarDuration = moment(startMonthBlock).twix(endMonthBlock)
    calendarWeeks = calendarDuration.split(1, 'week')
    {calendarDuration, calendarWeeks}

  handleDayClick: (dayMoment, mouseEvent) ->
    @refs.addOnDay.updateState(dayMoment, mouseEvent.pageX, mouseEvent.pageY)
    @setState({
      activeAddDate: dayMoment
    })

  checkAddOnDay: (componentName, dayMoment, mouseEvent) ->
    unless mouseEvent.relatedTarget is ReactDOM.findDOMNode(@refs.addOnDay)
      @hideAddOnDay(componentName, dayMoment, mouseEvent)

  undoActives: (componentName, dayMoment, mouseEvent) ->
    unless dayMoment? and dayMoment.isSame(@refs.addOnDay.state.addDate, 'day')
      @hideAddOnDay(componentName, dayMoment, mouseEvent)

  hideAddOnDay: (componentName, dayMoment, mouseEvent) ->
    @refs.addOnDay.close()
    @setState({
      activeAddDate: null
    })

  getFullMonthName: ->
    @props.date?.format?('MMMM')

  onDrop: (item, offset) ->
    return unless @state.hoveredDay
    if item.pathname # is a link to create an assignment
      url = item.pathname + "?" + qs.stringify({
        due_at: @state.hoveredDay.format(@props.dateFormat)
      })
      @context.router.transitionTo(url)
    else # is a task plan to clone
      @setState(
        cloningPlan: extend({}, item,
          due_at: @state.hoveredDay
          position: offset
        )
      )

  onCloneLoaded: (newPlanId) ->
    _.defer => # give flux store time to update
      @setState(editingPlanId: newPlanId, cloningPlan: undefined)

  getEditingPlanEl: ->
    return null unless @state.editingPlanId
    ReactDOM.findDOMNode(@).querySelector(
      ".course-plan-#{@state.editingPlanId}"
    )

  onDragHover: (day) ->
    @setState(hoveredDay: day)
  onSidebarToggle: (isOpen) ->
    @setState(showingSideBar: isOpen)
  onEditorHide: ->
    @setState(editingPlanId: null)

  render: ->
    {plansList, courseId, className, date, hasPeriods} = @props
    {calendarDuration, calendarWeeks} = @getDurationInfo(date)

    calendarClassName = classnames 'calendar-container', className

    if plansList?
      plans = <CourseDuration
        referenceDate={moment(TimeStore.getNow())}
        durations={plansList}
        viewingDuration={calendarDuration}
        groupingDurations={calendarWeeks}
        courseId={courseId}
        ref='courseDurations'>
        <CoursePlan courseId={courseId}/>
      </CourseDuration>

    <BS.Grid className={calendarClassName} fluid>


      <CourseAdd ref='addOnDay' hasPeriods={hasPeriods} courseId={@props.courseId} />

      <CourseCalendarHeader
        duration='month'
        date={date}
        onSidebarToggle={@onSidebarToggle}
        courseId={@props.courseId}
        setDate={@setDate}
        hasPeriods={hasPeriods}
        ref='calendarHeader'
      />

      <BS.Row className={classnames('calendar-body', {
        'with-sidebar-open': @state.showingSideBar
      })}>
        <BS.Col xs={12} data-duration-name={@getFullMonthName()}>
          {@props.connectDropTarget(
            <div>
              <Month date={date} monthNames={false}
                weekdayFormat='ddd' mods={@getMonthMods(calendarDuration)} />
              {plans}
            </div>
          )}
        </BS.Col>
      </BS.Row>
      {<PlanClonePlaceholder
        planId={@state.cloningPlan.id}
        planType={@state.cloningPlan.type}
        position={@state.cloningPlan.position}
        onLoad={@onCloneLoaded}
        courseId={@props.courseId}
        due_at={@state.cloningPlan.due_at}
        onLoad={@onCloneLoaded}
      /> if @state.cloningPlan?}
      {<TaskPlanMiniEditor
        planId={@state.editingPlanId}
        courseId={@props.courseId}
        onHide={@onEditorHide}
        findPopOverTarget={@getEditingPlanEl}
      /> if @state.editingPlanId}

    </BS.Grid>



module.exports = DropTarget([ItemTypes.NewTask, ItemTypes.CloneTask], TaskDrop, DropInjector)(CourseMonth)
