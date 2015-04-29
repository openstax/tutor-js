moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

{Calendar, Month, Week, Day} = require 'react-calendar'

CourseCalendarHeader = require './header'
CourseDuration = require './duration'
CoursePlansByWeek = require './plans-by-week'
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
    date: @props.startDate or moment()
    activeAddDate: null

  setDate: (date) ->
    unless moment(date).isSame(@state.date, 'month')
      @setState(
        date: date
      )

  componentDidUpdate: ->
    @setDayHeight(@refs.courseDurations.state.groupedDurations)

  setDayHeight: (groupedDurations) ->
    calendar = React.findDOMNode(@refs.calendar)
    nodesWithHeights = calendar.querySelectorAll('.rc-Week')

    # Adjust calendar height for each week to accomodate the number of plans shown on this week
    # CALENDAR_DAY_DYNAMIC_HEIGHT, see less for property that is overwritten.
    Array.prototype.forEach.call(nodesWithHeights, (node, nthRange) ->
      range = _.findWhere(groupedDurations, {nthRange: nthRange})
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
    unless dayMoment? and dayMoment.isSame(@refs.addOnDay.state.date, 'day')
      @hideAddOnDay(componentName, dayMoment, mouseEvent)

  hideAddOnDay: (componentName, dayMoment, mouseEvent) ->
    @refs.addOnDay.close()
    @setState({
      activeAddDate: null
    })


  # render days based on whether they are past or upcoming
  # past days do not allow adding of plans
  renderDays: (calendarDuration, referenceDay) ->
    referenceDay ?= moment()

    durationDays = calendarDuration.iterate('days')
    days = []
    hasActiveAddDate =  @state.activeAddDate?

    while durationDays.hasNext()
      dayIter = durationDays.next()

      if dayIter.isAfter(referenceDay, 'day')

        day = <Day
          date={dayIter}
          onClick={@handleClick}
          modifiers={{upcoming: true}}/>

        if hasActiveAddDate
          # Only attach hover event check when there is an active date.
          # Otherwise, we would be rendering way too often.
          day.props.onMouseLeave = @checkAddOnDay
          day.props.onMouseEnter = @undoActives

          if @state.activeAddDate.isSame(dayIter, 'day')
            day.props.classes =
              active: true

      else
        day = <Day date={dayIter} modifiers={{past: true}}/>

      days.push(day)

    days

  render: ->
    {plansList, courseId} = @props
    {date} = @state
    {calendarDuration, calendarWeeks} = @getDurationInfo(date)

    days = @renderDays(calendarDuration)

    <BS.Grid className='calendar-container'>
      <CourseAdd ref='addOnDay'/>
      <BS.Row>
        <BS.Col xs={1}>
          <BS.DropdownButton
            ref='addButtonGroup'
            title={<i className="fa fa-plus"></i>}
            noCaret>
            {@renderAddActions()}
          </BS.DropdownButton>
        </BS.Col>
      </BS.Row>

      <CourseCalendarHeader duration='month' date={date} setDate={@setDate} ref='calendarHeader'/>

      <BS.Row>
        <BS.Col xs={12}>

          <Month date={date} monthNames={false} ref='calendar'>
            {days}
          </Month>

          <CourseDuration
            durations={plansList}
            viewingDuration={calendarDuration}
            groupingDurations={calendarWeeks}
            courseId={courseId}
            ref='courseDurations'>
            <CoursePlansByWeek/>
          </CourseDuration>

        </BS.Col>
      </BS.Row>
    </BS.Grid>

module.exports = CourseMonth
