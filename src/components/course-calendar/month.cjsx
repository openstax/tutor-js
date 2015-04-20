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

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../flux/teacher-task-plan'

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

  handleClick: (componentName, dayMoment, mouseEvent) ->
    # check that moment is after today -- cannot add to past day.
    unless dayMoment.isBefore(moment()) or mouseEvent.currentTarget.className.includes('--outside')
      @refs.addOnDay.updateState(dayMoment, mouseEvent.pageX, mouseEvent.pageY)
      mouseEvent.currentTarget.classList.add('active')

  checkAddOnDay: (componentName, dayMoment, mouseEvent) ->
    unless mouseEvent.relatedTarget is React.findDOMNode(@refs.addOnDay)
      @hideAddOnDay(componentName, dayMoment, mouseEvent)

  undoActives: (componentName, dayMoment, mouseEvent) ->
    unless dayMoment? and dayMoment.isSame(@refs.addOnDay.state.date, 'day')
      @hideAddOnDay(componentName, dayMoment, mouseEvent)

  hideAddOnDay: (componentName, dayMoment, mouseEvent) ->
    @refs.addOnDay.close()
    document.querySelector('.active.rc-Day')?.classList.remove('active')

  render: ->
    {plansList} = @props
    {date} = @state
    {calendarDuration, calendarWeeks} = @getDurationInfo(date)

    <BS.Grid>
      <CourseAdd ref='addOnDay'/>
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
            <Day onClick={@handleClick} onMouseLeave={@checkAddOnDay} onMouseEnter={@undoActives}/>
          </Month>

          <CourseDuration durations={plansList} viewingDuration={calendarDuration} groupingDurations={calendarWeeks} ref='courseDurations'>
            <CoursePlansByWeek/>
          </CourseDuration>

        </BS.Col>
      </BS.Row>
    </BS.Grid>

module.exports = CourseMonth
