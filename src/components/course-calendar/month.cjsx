moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

{Calendar, Month, Week, Day} = require 'react-calendar'
{TimeStore} = require '../../flux/time'

CourseCalendarHeader = require './header'
CourseDuration = require './duration'
CoursePlan = require './plan'
CourseAdd = require './add'
CourseAddMenuMixin = require './add-menu-mixin'


CourseMonth = React.createClass
  displayName: 'CourseMonth'

  mixins: [CourseAddMenuMixin]

  propTypes:
    plansList: React.PropTypes.array.isRequired
    startDate: (props, propName, componentName) ->
      unless moment.isMoment(props[propName])
        new Error("#{propName} should be a moment for #{componentName}")

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    date: @props.startDate or moment(TimeStore.getNow())
    activeAddDate: null

  setDate: (date) ->
    unless moment(date).isSame(@state.date, 'month')
      @setState(
        date: date
      )

  componentDidUpdate: ->
    @setDayHeight(@refs.courseDurations.state.ranges)

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
    calendarWeeks = calendarDuration.split(moment.duration(1, 'week'))

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

    durationDays = calendarDuration.iterate('days')
    days = []
    hasActiveAddDate =  @state.activeAddDate?

    while durationDays.hasNext()
      dayIter = durationDays.next()

      if dayIter.isBefore(referenceDate, 'day')
        modifiers =
          past: true

      else
        modifiers =
          upcoming: true

        if dayIter.isSame(referenceDate, 'day')
          modifiers.current = true

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

      day = <Day date={dayIter} modifiers={modifiers} {...otherProps}/>
      days.push(day)

    days

  render: ->
    {plansList, courseId, className} = @props
    {date} = @state
    {calendarDuration, calendarWeeks} = @getDurationInfo(date)

    days = @renderDays(calendarDuration)

    calendarClassName = 'calendar-container'
    calendarClassName = calendarClassName + " #{className}" if className

    <BS.Grid className={calendarClassName} fluid>
      <CourseAdd ref='addOnDay'/>
      <CourseCalendarHeader duration='month' date={date} setDate={@setDate} ref='calendarHeader'/>

      <BS.Row className='calendar-body'>
        <BS.Col xs={12}>

          <Month date={date} monthNames={false} weekdayFormat='ddd' ref='calendar'>
            {days}
          </Month>

          <CourseDuration
            durations={plansList}
            viewingDuration={calendarDuration}
            groupingDurations={calendarWeeks}
            courseId={courseId}
            ref='courseDurations'>
            <CoursePlan/>
          </CourseDuration>

        </BS.Col>
      </BS.Row>
    </BS.Grid>

module.exports = CourseMonth
