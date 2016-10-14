moment = require 'moment-timezone'
twix = require 'twix'
_ = require 'underscore'
classnames = require 'classnames'

React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
{Droppable} = require 'react-drag-and-drop'
{Calendar, Month, Week, Day} = require 'react-calendar'
{TeacherTaskPlanStore} = require '../../flux/teacher-task-plan'
{TimeStore} = require '../../flux/time'
TimeHelper = require '../../helpers/time'
Router = require '../../helpers/router'

CourseCalendarHeader = require './header'
CourseAddMenuMixin   = require './add-menu-mixin'
CourseDuration       = require './duration'
CoursePlan           = require './plan'
CourseAdd            = require './add'
Sidebar              = require './sidebar'


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

  handleClick: (dayMoment, mouseEvent) ->
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

  onTaskDrop: (planId, ev) ->
    plan = TeacherTaskPlanStore.get(planId)
    day = ev.target.textContent

  onTaskDrop: (planId, ev) ->
    plan = TeacherTaskPlanStore.get(planId)
    day = ev.target.textContent


  onToggleSidebar: ->
    @setState(showingSideBar: not @state.showingSideBar)

  render: ->
    {plansList, courseId, className, date, hasPeriods} = @props
    {calendarDuration, calendarWeeks} = @getDurationInfo(date)

    calendarClassName = classnames 'calendar-container', className

    mods = [
      {
        component: [ 'day' ],
        events:
          onClick: @handleClick

      }
    ]

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
      <Sidebar isOpen={@state.showingSideBar} onHide={@onToggleSidebar} courseId={courseId} />


      <CourseCalendarHeader
        duration='month'
        date={date}
        courseId={@props.courseId}
        setDate={@setDate}
        hasPeriods={hasPeriods}
        ref='calendarHeader'
        onCopyPreviousAssignment={@onToggleSidebar}
      />

      <BS.Row className='calendar-body'>
        <BS.Col xs={12} data-duration-name={@getFullMonthName()}>
          <Droppable
            types={['task']} onDrop={@onTaskDrop}
          >
            <Month date={date} monthNames={false} weekdayFormat='ddd'
              mods={mods}
            >
              {days}
            </Month>
          </Droppable>

          {plans}

        </BS.Col>
      </BS.Row>
    </BS.Grid>

module.exports = CourseMonth
