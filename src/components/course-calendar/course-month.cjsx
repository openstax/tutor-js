moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

{Calendar, Month, Week, Day} = require 'react-calendar'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../flux/teacher-task-plan'

CourseMonth = React.createClass
  displayName: 'CourseMonth'

  getInitialState: ->
    date: @props.startDate or moment()
    calendarWidth: '100%'

  componentDidMount: ->
    # External links should open in a new window
    @setState({
      calendarWidth: React.findDOMNode(@refs.calendar).clientWidth
    })

  componentDidUpdate: ->
    React.findDOMNode(@refs.plans).style.width = @state.calendarWidth

  handleNextMonth: (clickEvent) ->
    clickEvent.preventDefault()
    @setState(
      date: @state.date.clone().add(1, 'month')
    )

  handlePreviousMonth: (clickEvent) ->
    clickEvent.preventDefault()
    @setState(
      date: @state.date.clone().subtract(1, 'month')
    )

  setPlanDuration: (plan) ->
    duration = moment(plan.opens_at).twix(plan.due_at)
    plan.duration = duration

  isPlanInDuration: (duration) ->
    (plan) ->
      plan.duration = plan.duration.intersection(duration)
      plan.duration.length('hours') > 0

  groupByRanges: (plansInMonth) ->
    (range, nthRange) ->
      rangeData =
        nthRange: nthRange
        plans: []

      _.each(plansInMonth, (plan) ->
          if plan.duration.overlaps(range)
            planForRange =
              rangeDuration: plan.duration.intersection(range)
              offset: moment(range.start).twix(plan.duration.start).length('days')
              duration: plan.duration
              plan: _.omit(plan, 'days', 'due_at', 'opens_at', 'duration', 'durationAsWeeks')

            rangeData.plans.push(planForRange)
      )

      rangeData

  renderPlanDays:(range) ->
    plans = _.map(range.plans, (item) ->
        durationLength = if item.duration.length('days') < 7 then item.duration.length('days') + 1 else item.duration.length('days')
        planStyle = {
          width: durationLength * 100 / 7 + '%'
          left: item.offset * 100 / 7 + '%'
        }

        planClasses = "plan #{item.plan.type}"
        <span style={planStyle} className={planClasses} onClick={-> alert("Clicked #{item.plan.title}")} key={item.plan.id}>{item.plan.title}</span>
    )

    plansStyle = {
        top: (range.nthRange * 10 + 13.5 - range.plans.length*2.75) + 'rem'
        width: @state.calendarWidth
        left: '15px'
    }

    <div className='plans' style={plansStyle} ref='plans'>
      {plans}
    </div>

  getDurationInfo: (date) ->
    startMonthBlock = date.clone().startOf('month').startOf('week')
    endMonthBlock = date.clone().endOf('month').endOf('week')

    calendarDuration = moment(startMonthBlock).twix(endMonthBlock)
    calendarWeeks = calendarDuration.split(moment.duration(1, 'week'))

    {calendarDuration, calendarWeeks}

  renderPlans: ->
    {calendarDuration, calendarWeeks} = @getDurationInfo(@state.date)

    plansInMonth = _.chain(@props.plansList)
      .each(@setPlanDuration)
      .filter(@isPlanInDuration(calendarDuration))
      .value()

    plans = _.chain(calendarWeeks)
      .map(@groupByRanges(plansInMonth))
      .map(@renderPlanDays)
      .value()

  render: ->

    plansDays = @renderPlans()

    # TODO see about doing a PR to the library after their react update to enable
    # modifying MonthHeader as a feature
    MonthHeader =
      <BS.Row className='month-header'>
        <BS.Col xs={4}>
          <a href="#" className='month-header-control previous' onClick={@handlePreviousMonth}>&lt;</a>
        </BS.Col>
        <BS.Col xs={4} className='month-header-label'>{@state.date.format('MMMM YYYY')}</BS.Col>
        <BS.Col xs={4}>
          <a href="#" className='month-header-control next' onClick={@handleNextMonth}>&gt;</a>
        </BS.Col>
      </BS.Row>


    <BS.Grid>
      {MonthHeader}
      <BS.Row>
        <BS.Col xs={12}>
          <Month date={@state.date} monthNames={false} ref='calendar'/>
          {plansDays}
        </BS.Col>
      </BS.Row>
    </BS.Grid>

module.exports = CourseMonth
