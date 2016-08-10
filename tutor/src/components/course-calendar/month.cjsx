moment = require 'moment-timezone'
twix = require 'twix'
_ = require 'underscore'
classnames = require 'classnames'

React = require 'react'
BS = require 'react-bootstrap'

{Calendar, Month, Week, Day} = require 'react-calendar'
{TimeStore} = require '../../flux/time'
TimeHelper = require '../../helpers/time'

CourseCalendarHeader = require './header'
CourseDuration = require './duration'
CoursePlan = require './plan'
CourseAdd = require './add'
CourseAddMenuMixin = require './add-menu-mixin'

CourseMonth = React.createClass
  displayName: 'CourseMonth'

  mixins: [CourseAddMenuMixin]

  contextTypes:
    router: React.PropTypes.func

  propTypes:
    plansList: React.PropTypes.array
    date: TimeHelper.PropTypes.moment
    hasPeriods: React.PropTypes.bool.isRequired

  childContextTypes:
    date: TimeHelper.PropTypes.moment

  getChildContext: ->
    date: @props.date

  getInitialState: ->
    activeAddDate: null

  getDefaultProps: ->
    date: moment(TimeStore.getNow())

  setDateParams: (date) ->
    params = @context.router.getCurrentParams()
    params.date = date.format(@props.dateFormat)
    @context.router.transitionTo('calendarByDate', params)

  setDate: (date) ->
    unless moment(date).isSame(@props.date, 'month')
      @setDateParams(date)

  componentDidUpdate: ->
    @setDayHeight(@refs.courseDurations.state.ranges) if @refs.courseDurations?

  setDayHeight: (ranges) ->
    calendar = React.findDOMNode(@refs.calendar)
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

  handleClick: (componentName, dayMoment, mouseEvent) ->
    @refs.addOnDay.updateState(dayMoment, mouseEvent.pageX, mouseEvent.pageY)
    @setState({
      activeAddDate: dayMoment
    })

  checkAddOnDay: (componentName, dayMoment, mouseEvent) ->
    unless mouseEvent.relatedTarget is React.findDOMNode(@refs.addOnDay)
      @hideAddOnDay(componentName, dayMoment, mouseEvent)

  undoActives: (componentName, dayMoment, mouseEvent) ->
    unless dayMoment? and dayMoment.isSame(@refs.addOnDay.state.addDate, 'day')
      @hideAddOnDay(componentName, dayMoment, mouseEvent)

  hideAddOnDay: (componentName, dayMoment, mouseEvent) ->
    @refs.addOnDay.close()
    @setState({
      activeAddDate: null
    })


  # render days based on whether they are past or upcoming
  # past days do not allow adding of plans
  renderDays: (calendarDuration, referenceDate) ->
    referenceDate ?= moment(TimeStore.getNow())

    durationDays = calendarDuration.iterateInner('days')
    days = []
    hasActiveAddDate =  @state.activeAddDate?

    while durationDays.hasNext()
      dayIter = durationDays.next()
      modifiers = {}

      if dayIter.isBefore(referenceDate, 'day')
        modifiers.past = true
      else if dayIter.isSame(referenceDate, 'day')
        modifiers.current = true
      else
        modifiers.upcoming = true

      otherProps =
        onClick: @handleClick

      if hasActiveAddDate
        # Only attach hover event check when there is an active date.
        # Otherwise, we would be re-rendering way too often.
        otherProps.onMouseLeave = @checkAddOnDay
        otherProps.onMouseEnter = @undoActives

        if @state.activeAddDate.isSame(dayIter, 'day')
          otherProps.classes =
            active: true

      key = "day-#{dayIter.format(@props.dateFormat)}"
      day = <Day date={dayIter} modifiers={modifiers} key={key} {...otherProps}/>
      days.push(day)

    days

  render: ->
    {plansList, courseId, className, date, hasPeriods} = @props
    {calendarDuration, calendarWeeks} = @getDurationInfo(date)

    days = @renderDays(calendarDuration)

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
      <CourseAdd
        hasPeriods={hasPeriods}
        ref='addOnDay'/>
      <CourseCalendarHeader
        duration='month'
        date={date}
        setDate={@setDate}
        hasPeriods={hasPeriods}
        ref='calendarHeader'/>

      <BS.Row className='calendar-body'>
        <BS.Col xs={12}>

          <Month date={date} monthNames={false} weekdayFormat='ddd' ref='calendar'>
            {days}
          </Month>

          {plans}

        </BS.Col>
      </BS.Row>
    </BS.Grid>

module.exports = CourseMonth
