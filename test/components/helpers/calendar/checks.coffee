{expect} = require 'chai'
{Promise} = require 'es6-promise'
_ = require 'underscore'
moment = require 'moment'
twix = require 'twix'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../../../src/flux/teacher-task-plan'

checks =

  _doesLabelMatchMonthOf: (testMoment, {div, component, state, router, history, courseId}) ->
    monthLabel = div.querySelector('.calendar-header-label')
    monthFormat = component.refs.calendarHandler.refs.calendarHeader.props.format

    expectedMonthLabel = testMoment.format(monthFormat)

    expect(monthLabel).to.not.be.null
    expect(monthLabel.innerText).to.equal(expectedMonthLabel)

    {div, component, state, router, history, courseId}

  _doesDateMatchMonthOf: (testMoment, {div, component, state, router, history, courseId}) ->
    {date} = component.refs.calendarHandler.refs.calendar.props
    {viewingDuration} = component.refs.calendarHandler.refs.courseDurations.props

    firstCalBox = div.querySelector('.rc-Day')
    firstTestDateMonthBox = testMoment.clone().startOf('month').startOf('week')
    endTestDateMonthBox = testMoment.clone().endOf('month').endOf('week')
    testMonthBox = firstTestDateMonthBox.twix(endTestDateMonthBox)

    isSameDay = testMoment.isSame(date,'month')

    expect(isSameDay).to.be.true
    expect(firstCalBox.innerText).to.equal(firstTestDateMonthBox.date().toString())
    expect(testMonthBox.equals(viewingDuration)).to.be.true

    {div, component, state, router, history, courseId}

  _checkIsCalendarRendered: ({div, component, state, router, history, courseId}) ->
    expect(div.querySelector('.rc-Month')).to.not.be.null
    {div, component, state, router, history, courseId}

  _checkIsDateToday: (args...) ->
    checks.doesDateMatchMonthOf(moment(), args...)

  _checkIsLabelThisMonth: (args...) ->
    checks.doesLabelMatchMonthOf(moment(), args...)

  _checkIsDateNextMonth: (args...) ->
    checks.doesDateMatchMonthOf(moment().add(1, 'month'), args...)

  _checkIsLabelNextMonth: (args...) ->
    checks.doesLabelMatchMonthOf(moment().add(1, 'month'), args...)

  _checkIsDatePreviousMonth: (args...) ->
    checks.doesDateMatchMonthOf(moment().subtract(1, 'month'), args...)

  _checkIsLabelPreviousMonth: (args...) ->
    checks.doesLabelMatchMonthOf(moment().subtract(1, 'month'), args...)

  _checkDoesViewHavePlans: ({div, component, state, router, history, courseId}) ->
    {durations, viewingDuration} = component.refs.calendarHandler.refs.courseDurations.props

    expect(durations).to.be.an('array')
    expect(div.querySelectorAll('.plan').length).to.be.above(0)

    _.each(durations, (plan) ->
        fullDuration = moment(plan.opens_at).twix(moment(plan.due_at).add(1, 'day').endOf('day'), {allDay: true})
        if fullDuration.overlaps(viewingDuration)
          expect(div.querySelectorAll(".course-plan-#{plan.id}").length).to.be.above(0)
    )

    {div, component, state, router, history, courseId}

# promisify for chainability in specs
_.each(checks, (check, checkName) ->
  # rename without _ in front
  promiseName = checkName.slice(1)

  checks[promiseName] = (args...) ->
    Promise.resolve(check(args...))
)

checks._checkDoesViewShowPlan = (planId, {div, component, state, router, history, courseId}) ->
  plansList = TeacherTaskPlanStore.getCoursePlans(courseId)
  plan = _.findWhere(plansList, {id: planId})

  expect(JSON.parse(div.querySelector(".course-plan-#{plan.id}").innerText).title).to.equal(plan.title)

checks.checkDoesViewShowPlan = (planId) ->
  (args...) ->
    Promise.resolve(checks._checkDoesViewShowPlan(planId, args...))

module.exports = checks
