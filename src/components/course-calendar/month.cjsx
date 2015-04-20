moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

{Calendar, Month, Week, Day} = require 'react-calendar'

CourseCalendarHeader = require './header'
CourseDuration = require './duration'
CoursePlansByWeek = require './plans-by-week'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../flux/teacher-task-plan'

CourseMonth = React.createClass
  displayName: 'CourseMonth'

  propTypes:
    plansList: React.PropTypes.array.isRequired
    startDate: (props, propName, componentName) ->
      unless moment.isMoment(props[propName])
        new Error("#{propName} should be a moment for #{componentName}")

  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    date: @props.startDate or moment()

  setDate: (date) ->
    unless moment(date).isSame(@state.date, 'month')
      @setState(
        date: date
      )

  getDurationInfo: (date) ->
    startMonthBlock = date.clone().startOf('month').startOf('week')
    endMonthBlock = date.clone().endOf('month').endOf('week')

    calendarDuration = moment(startMonthBlock).twix(endMonthBlock)
    calendarWeeks = calendarDuration.split(moment.duration(1, 'week'))

    {calendarDuration, calendarWeeks}

  handleClick: (clickedOn, moment, mouseEvent) ->
    addOnDayMenu = React.findDOMNode(@refs.addOnDay)

    addOnDayMenu.style.left = mouseEvent.pageX + 'px'
    addOnDayMenu.style.top = mouseEvent.pageY + 'px'
    addOnDayMenu.style.display = 'block'

  renderAddActions: ->
    {courseId} = @context.router.getCurrentParams()

    links = [
      {
        text: 'Add iReading'
        to: 'createPlan'
        params:
          courseId: courseId
          type: 'reading'
      }, {
        text: 'Add Homework'
        to: 'createPlan'
        params:
          courseId: courseId
          type: 'homework'
      }
    ]

    _.map(links, (link) ->
        href = @context.router.makeHref(link.to, link.params)
        <BS.MenuItem href = {href}>{link.text}</BS.MenuItem>
    , @)


  render: ->
    {plansList} = @props
    {date} = @state
    {calendarDuration, calendarWeeks} = @getDurationInfo(date)

    <BS.Grid>
      <BS.DropdownMenu ref='addOnDay'>
        {@renderAddActions()}
      </BS.DropdownMenu>
      <BS.Row>
        <BS.Col xs={1}>
          <BS.DropdownButton title={<i className="fa fa-plus"></i>} noCaret>
            {@renderAddActions()}
          </BS.DropdownButton>
        </BS.Col>
      </BS.Row>

      <CourseCalendarHeader duration='month' date={date} setDate={@setDate} ref='calendarHeader'/>

      <BS.Row>
        <BS.Col xs={12}>

          <Month date={date} monthNames={false} ref='calendar'>
            <Day onClick={@handleClick}/>
          </Month>

          <CourseDuration durations={plansList} viewingDuration={calendarDuration} groupingDurations={calendarWeeks} ref='courseDurations'>
            <CoursePlansByWeek/>
          </CourseDuration>

        </BS.Col>
      </BS.Row>
    </BS.Grid>

module.exports = CourseMonth
