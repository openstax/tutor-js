moment = require 'moment-timezone'
twix = require 'twix'
_ = require 'underscore'
classnames = require 'classnames'

React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
Joyride = require('react-joyride').default

{Calendar, Month, Week, Day} = require 'react-calendar'
{TimeStore} = require '../../flux/time'
TimeHelper = require '../../helpers/time'

CourseCalendarHeader = require './header'
CourseDuration = require './duration'
CoursePlan = require './plan'
CourseAdd = require './add'
CourseAddMenuMixin = require './add-menu-mixin'

STEPS = [
  {
     position: 'right', selector: '.calendar-header-navigation #add-assignment'
     title: 'Add Assignment'
     text: 'Add an assignment by clicking here or calendar'
  }, {
    position: 'top', selector: '.plan[data-assignment-type="homework"]'
    title: 'Homework'
    text:
      <p>
        Homework assignments are <span className="homework-color-bg">light blue</span>.
        You can click them to review how well students are doing
      </p>
  }, {
    position: 'top', selector: '.plan[data-assignment-type="reading"]'
    title: 'Reading'
    text:
      <p>
        Homework assignments are <span className="reading-color-bg">light yellow</span>.
        You can click them to review how well students are doing
      </p>
  }, {
    position: 'bottom', selector: '.view-reference-guide'
    title: 'View reference book'
    text: "Views the complete online version of the book that this course uses"
  }
]

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

  getChildContext: ->
    date: @props.date

  getInitialState: ->
    activeAddDate: null

  getDefaultProps: ->
    date: moment(TimeStore.getNow())

  setDateParams: (date) ->
    date = date.format(@props.dateFormat)
    @context.router.transitionTo("/course/#{@props.courseId}/t/month/#{date}")

    # pathname: @props.windowImpl.location.pathname, query: query)
    # @context.router.transitionTo(@context.router.getCurrentPathname(), {},
    # @context.router.transitionTo('calendarByDate', params)

  setDate: (date) ->
    unless moment(date).isSame(@props.date, 'month')
      @setDateParams(date)

  componentDidUpdate: ->
    @refs.joyride.start()
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

  handleClick: (componentName, dayMoment, mouseEvent) ->
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
      <Joyride ref="joyride"
        debug={true}
        steps={STEPS} type='continuous'
        showStepsProgress={true} />
      <CourseAdd
        hasPeriods={hasPeriods}
        ref='addOnDay'/>
      <CourseCalendarHeader
        duration='month'
        date={date}
        courseId={@props.courseId}
        setDate={@setDate}
        hasPeriods={hasPeriods}
        ref='calendarHeader'/>

      <BS.Row className='calendar-body'>
        <BS.Col xs={12} data-duration-name={@getFullMonthName()}>

          <Month date={date} monthNames={false} weekdayFormat='ddd'>
            {days}
          </Month>

          {plans}

        </BS.Col>
      </BS.Row>
    </BS.Grid>

module.exports = CourseMonth
