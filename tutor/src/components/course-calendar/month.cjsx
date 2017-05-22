React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
moment = require 'moment-timezone'
twix = require 'twix'
_ = require 'underscore'
classnames = require 'classnames'
qs = require 'qs'
extend = require 'lodash/extend'
find = require 'lodash/find'
{DropTarget} = require 'react-dnd'
{Calendar, Month, Week, Day} = require 'react-calendar'
{ default: TourRegion } = require '../tours/region'
{ default: TeacherTaskPlans } = require '../../models/teacher-task-plans'
{TimeStore} = require '../../flux/time'
TimeHelper = require '../../helpers/time'
TutorRouter = require '../../helpers/router'

{ItemTypes, TaskDrop, DropInjector} = require './task-dnd'

TaskPlanMiniEditor   = require '../task-plan/mini-editor'
PlanClonePlaceholder = require './plan-clone-placeholder'
AddAssignmentSidebar = require './add-assignment-sidebar'
CourseCalendarHeader = require './header'
CourseAddMenuMixin   = require './add-menu-mixin'
CourseDuration       = require './duration'
MonthTitleNav        = require './month-title-nav'
CoursePlan           = require './plan'
CourseAdd            = require './add'


CourseMonth = React.createClass
  displayName: 'CourseMonth'

  mixins: [CourseAddMenuMixin]

  contextTypes:
    router: React.PropTypes.object

  propTypes:
    date:       TimeHelper.PropTypes.moment
    termStart:  TimeHelper.PropTypes.moment
    termEnd:    TimeHelper.PropTypes.moment
    hasPeriods: React.PropTypes.bool.isRequired
    courseId:   React.PropTypes.string.isRequired

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
    @context.router.transitionTo(TutorRouter.makePathname('calendarByDate', params))

  setDate: (date) ->
    unless moment(date).isSame(@props.date, 'month')
      @setDateParams(date)

  getMonthMods: (calendarDuration) ->
    date = moment(TimeStore.getNow())
    {termStart, termEnd} = @props

    mods = [
      {
        component: [ 'day' ]
        events:
          onClick: @handleDayClick
          onDragEnter: @onDragHover
      }
    ]
    {hoveredDay} = @state
    getClassNameForDate = (dateToModify) ->
      className =
        if dateToModify.isBefore(date, 'day')
          'past'
        else if dateToModify.isAfter(date, 'day')
          'upcoming'
        else
          'current'

      termClasses =
        if dateToModify.isBefore(termStart, 'day')
          'before-term'
        else if dateToModify.isAfter(termEnd, 'day')
          'after-term'

      classnames(className, termClasses,
        hovered: hoveredDay and dateToModify.isSame(hoveredDay, 'day')
      )

    hackMoment = (dateToModify, calendarDate) ->
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
      hackedDate

    makeModForDate = (dateToModify, calendarDate) ->
      date: hackMoment(dateToModify, calendarDate)
      component: [ 'day' ]
      classNames: [ getClassNameForDate(dateToModify) ]

    daysOfDuration = calendarDuration.iterate('days')

    while daysOfDuration.hasNext()
      mods.push(makeModForDate(daysOfDuration.next(), @props.date, @state))

    mods

  componentDidUpdate: ->
    @setDayHeight(@refs.courseDurations.state.ranges) if @refs.courseDurations?

  componentWillMount: ->
    document.addEventListener('click', @shouldHideAddOnDay, true)

  componentWillUnmount: ->
    document.removeEventListener('click', @shouldHideAddOnDay, true)

  shouldHideAddOnDay: (clickEvent) ->
    return if _.isEmpty(@state.activeAddDate)

    unless clickEvent.target.classList.contains('rc-Day') or
      (clickEvent.target.tagName is 'A' and clickEvent.target.parentNode?.dataset?.assignmentType?)
        @hideAddOnDay()
        clickEvent.preventDefault()
        clickEvent.stopImmediatePropagation()

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
    {termStart, termEnd} = @props
    return unless @state.hoveredDay and
      @state.hoveredDay.isBetween(termStart, termEnd, 'day', '[]') and
      @state.hoveredDay.isSameOrAfter(TimeStore.getNow(), 'day')

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
      @setState(
        editingPlanId: newPlanId,
        cloningPlanId: @state.cloningPlan.id
        editingPosition: @state.cloningPlan.position
        cloningPlan: undefined
      )

  getEditingPlanEl: ->
    return null unless @state.editingPlanId
    ReactDOM.findDOMNode(@).querySelector(
      ".course-plan-#{@state.editingPlanId}"
    )

  onDragHover: (day) ->
    @setState(hoveredDay: TimeHelper.getMomentPreserveDate(day))
  onSidebarToggle: (isOpen) ->
    @setState(showingSideBar: isOpen)
  onEditorHide: ->
    @setState(editingPlanId: null, cloningPlanId: null)
  onIfIsEditing: (plan) ->
    if plan.id is @state.editingPlanId or
      plan.cloned_from_id is @state.cloningPlan?.id
        @setState(showMiniEditor: true)
  offIfIsEditing: (plan) ->
    @setState(showMiniEditor: false) if plan.id is @state.editingPlanId

  render: ->
    {courseId, className, date, hasPeriods, termStart, termEnd} = @props
    {calendarDuration, calendarWeeks} = @getDurationInfo(date)

    calendarClassName = classnames('calendar-container', 'container', className,
      'with-sidebar-open': @state.showingSideBar
    )

    plansList = TeacherTaskPlans.forCourseId(courseId).array
    if plansList?
      plans = <CourseDuration
        referenceDate={moment(TimeStore.getNow())}
        durations={plansList}
        viewingDuration={calendarDuration}
        groupingDurations={calendarWeeks}
        courseId={courseId}
        ref='courseDurations'>
        <CoursePlan courseId={courseId} onShow={@onIfIsEditing} onHide={@offIfIsEditing}/>
      </CourseDuration>

    <TourRegion
      className={calendarClassName}
      id="teacher-calendar"
      courseId={courseId}
    >

      <CourseAdd
        ref='addOnDay'
        hasPeriods={hasPeriods}
        courseId={courseId}
        termStart={termStart}
        termEnd={termEnd}
      />

      <CourseCalendarHeader
        defaultOpen={@state.showingSideBar}
        onSidebarToggle={@onSidebarToggle}
        courseId={courseId}
        hasPeriods={hasPeriods}
      />

      <div className='calendar-body'>

        <AddAssignmentSidebar
          isOpen={@state.showingSideBar}
          courseId={@props.courseId}
          hasPeriods={hasPeriods}
          cloningPlanId={@state.cloningPlanId or @state.cloningPlan?.id}
        />

        <div className="month-body" data-duration-name={@getFullMonthName()}>
          <MonthTitleNav
            courseId={@props.courseId}
            duration='month'
            date={date}
            setDate={@setDate}
          />
          {@props.connectDropTarget(
            <div className={classnames("month-wrapper", 'is-dragging': @props.isDragging)}>
              <Month date={date} monthNames={false}
                weekdayFormat='ddd' mods={@getMonthMods(calendarDuration)} />
              {plans}
            </div>
          )}
        </div>
      </div>

      {<PlanClonePlaceholder
        planId={@state.cloningPlan.id}
        planType={@state.cloningPlan.type}
        position={@state.cloningPlan.position}
        courseId={@props.courseId}
        due_at={@state.cloningPlan.due_at}
        onLoad={@onCloneLoaded}
      /> if @state.cloningPlan?}
      {<TaskPlanMiniEditor
        planId={@state.editingPlanId}
        position={@state.editingPosition}
        courseId={courseId}
        termStart={termStart}
        termEnd={termEnd}
        onHide={@onEditorHide}
        findPopOverTarget={@getEditingPlanEl}
      /> if @state.editingPlanId and @state.showMiniEditor}

    </TourRegion>



module.exports = DropTarget([ItemTypes.NewTask, ItemTypes.CloneTask], TaskDrop, DropInjector)(CourseMonth)
