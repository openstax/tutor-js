{expect} = require 'chai'
{Promise} = require 'es6-promise'
_ = require 'underscore'
camelCase = require 'camelcase'

moment = require 'moment-timezone'
twix = require 'twix'
React = require 'react/addons'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../../../src/flux/teacher-task-plan'
{TaskPlanStatsStore, TaskPlanStatsActions} = require '../../../../src/flux/task-plan-stats'
{TimeActions, TimeStore} = require '../../../../src/flux/time'
TimeHelper = require '../../../../src/helpers/time'
{CourseStore} = require '../../../../src/flux/course'

Add = require '../../../../src/components/course-calendar/add'
{CoursePlanDisplayEdit, CoursePlanDisplayQuickLook} = require '../../../../src/components/course-calendar/plan-display'

checks =

  _checkAddMenu: (addOnDayDropdown, router, courseId) ->
    routeQuery = {due_at: addOnDayDropdown.state.addDate.format(addOnDayDropdown.props.dateFormat)}
    targetReadingLink = router.makeHref('createReading', {courseId}, routeQuery)
    targetHomeworkLink = router.makeHref('createHomework', {courseId}, routeQuery)
    targetExternalLink = router.makeHref('createExternal', {courseId}, routeQuery)
    targetEventLink = router.makeHref('createEvent', {courseId}, routeQuery)

    expect(addOnDayDropdown.refs.readingLink.getDOMNode().childNodes[0].href).to.contain(targetReadingLink)
    expect(addOnDayDropdown.refs.homeworkLink.getDOMNode().childNodes[0].href).to.contain(targetHomeworkLink)
    expect(addOnDayDropdown.refs.externalLink.getDOMNode().childNodes[0].href).to.contain(targetExternalLink)
    expect(addOnDayDropdown.refs.eventLink.getDOMNode().childNodes[0].href).to.contain(targetEventLink)


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
    endTestDateMonthBox = testMoment.clone().endOf('month').endOf('week').add(1, 'millisecond')
    testMonthBox = firstTestDateMonthBox.twix(endTestDateMonthBox)

    isSameDay = testMoment.isSame(date, 'month')

    expect(isSameDay).to.be.true
    expect(firstCalBox.innerText).to.equal(firstTestDateMonthBox.date().toString())
    expect(testMonthBox.equals(viewingDuration)).to.be.true

    {div, component, state, router, history, courseId}

  _checkIsCalendarRendered: ({div, component, state, router, history, courseId}) ->
    expect(div.querySelector('.rc-Month')).to.not.be.null
    {div, component, state, router, history, courseId}

  _checkIsDateToday: (args...) ->
    checks.doesDateMatchMonthOf(TimeHelper.getMomentPreserveDate(TimeStore.getNow()), args...)

  _checkIsLabelThisMonth: (args...) ->
    checks.doesLabelMatchMonthOf(TimeHelper.getMomentPreserveDate(TimeStore.getNow()), args...)

  _checkIsDateNextMonth: (args...) ->
    checks.doesDateMatchMonthOf(TimeHelper.getMomentPreserveDate(TimeStore.getNow()).add(1, 'month'), args...)

  _checkIsLabelNextMonth: (args...) ->
    checks.doesLabelMatchMonthOf(TimeHelper.getMomentPreserveDate(TimeStore.getNow()).add(1, 'month'), args...)

  _checkIsDatePreviousMonth: (args...) ->
    checks.doesDateMatchMonthOf(TimeHelper.getMomentPreserveDate(TimeStore.getNow()).subtract(1, 'month'), args...)

  _checkIsLabelPreviousMonth: (args...) ->
    checks.doesLabelMatchMonthOf(TimeHelper.getMomentPreserveDate(TimeStore.getNow()).subtract(1, 'month'), args...)

  _checkDoesViewHavePlans: ({div, component, state, router, history, courseId}) ->
    {durations, viewingDuration} = component.refs.calendarHandler.refs.courseDurations.props

    expect(durations).to.be.an('array')
    expect(div.querySelectorAll('.plan').length).to.be.above(0)

    # TODO: Commented_because_in_alpha_plans_in_the_calendar_do_not_have_ranges
    # _.each(durations, (plan) ->
    #   fullDuration = moment(plan.opens_at).startOf('day').twix(moment(plan.due_at).endOf('day'), {allDay: true})
    #   if fullDuration.overlaps(viewingDuration)
    #     expect(div.querySelectorAll(".course-plan-#{plan.id}").length).to.be.above(0)
    # )

    {div, component, state, router, history, courseId}

  _checkDoesAddDropDownShow: ({div, component, state, router, history, courseId}) ->
    expect(div.querySelector('.open .dropdown-menu')).to.not.be.null

    {div, component, state, router, history, courseId}

  _checkDoesAddMenuLinkCorrectly: ({div, component, state, router, history, courseId}) ->
    React.Children.forEach(component.refs.calendarHandler.refs.addButtonGroup.refs.menu.props.children, (link) ->
      routeName = camelCase("create-#{link.key}")
      expectedLink = router.makeHref(routeName, {courseId})

      expect(link._store.props.href).to.equal(expectedLink)
    )

    {div, component, state, router, history, courseId}

  _checkIsYesterdayPast: ({div, component, state, router, history, courseId}) ->
    past = React.addons.TestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--past')
    shouldBeYesterday = _.last(past)

    isYesterday = shouldBeYesterday._reactInternalInstance._context.date
      .isSame(moment(TimeStore.getNow()).subtract(1, 'day'), 'day')
    expect(isYesterday).to.be.true
    {div, component, state, router, history, courseId}

  _checkIsTodayCurrent: ({div, component, state, router, history, courseId}) ->
    currents = React.addons.TestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--current')
    shouldBeToday = _.first(currents)

    isToday = shouldBeToday._reactInternalInstance._context.date.isSame(moment(TimeStore.getNow()), 'day')
    expect(isToday).to.be.true
    {div, component, state, router, history, courseId}

  _checkIsTomorrowUpcoming: ({div, component, state, router, history, courseId}) ->
    upcomings = React.addons.TestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--upcoming')
    shouldBeTomorrow = _.first(upcomings)
    isTomorrow = shouldBeTomorrow._reactInternalInstance._context.date.isSame(moment(TimeStore.getNow()).add(1, 'day'), 'day')
    expect(isTomorrow).to.be.true
    {div, component, state, router, history, courseId}

  _checkIsYesterdayClickable: ({div, component, state, router, history, courseId}) ->
    past = React.addons.TestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--past')
    shouldBeYesterday = _.last(past)
    expect(shouldBeYesterday.props.onClick).to.be.a('function')

    {div, component, state, router, history, courseId}

  _checkAddPlansWarning: ({div, component, state, router, history, courseId}) ->
    addOnDayDropdown = React.addons.TestUtils.findRenderedComponentWithType(component, Add)
    expect(addOnDayDropdown.getDOMNode().style.display).to.not.equal('none')
    expect(addOnDayDropdown.getDOMNode().innerText).to.contain('Cannot assign')

    {div, component, state, router, history, courseId}

  _checkNoPeriodsWarning: ({div, component, state, router, history, courseId}) ->
    addDropdown = React.addons.TestUtils.findRenderedComponentWithType(component, Add).getDOMNode()

    expect(addDropdown.style.display).to.not.equal('none')
    expect(addDropdown.innerText).to.contain('Please add')
      .and.to.contain('in \nCourse Settings before\nadding assignments.')

    {div, component, state, router, history, courseId}

  _checkNoPeriodsOnAddAssignmentWarning: ({div, component, state, router, history, courseId}) ->
    addDropdown = div.querySelector('.add-assignment .dropdown-menu')

    expect(addDropdown.style.display).to.not.equal('none')
    expect(addDropdown.innerText).to.contain('Please add')
      .and.to.contain('in \nCourse Settings before\nadding assignments.')

    {div, component, state, router, history, courseId}

  _checkIsTodayClickable: ({div, component, state, router, history, courseId}) ->
    currents = React.addons.TestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--current')
    shouldBeToday = _.first(currents)
    expect(shouldBeToday.props.onClick).to.be.a('function')

    {div, component, state, router, history, courseId}

  _checkIsTomorrowClickable: ({div, component, state, router, history, courseId}) ->
    upcomings = React.addons.TestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--upcoming')
    shouldBeTomorrow = _.first(upcomings)
    expect(shouldBeTomorrow.props.onClick).to.be.a('function')

    {div, component, state, router, history, courseId}

  _checkTodayAddPlansDropDown: ({div, component, state, router, history, courseId}) ->
    currents = React.addons.TestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--current')
    shouldBeToday = _.first(currents)
    expect(shouldBeToday.getDOMNode().classList.contains('active')).to.be.true

    addOnDayDropdown = React.addons.TestUtils.findRenderedComponentWithType(component, Add)
    expect(addOnDayDropdown.getDOMNode().style.display).to.not.equal('none')

    isToday = addOnDayDropdown.state.addDate.isSame(moment(TimeStore.getNow()), 'day')
    # add date for drop down should be Today
    expect(isToday).to.be.true
    checks._checkAddMenu(addOnDayDropdown, router, courseId)

    {div, component, state, router, history, courseId}

  _checkTomorrowAddPlansDropDown: ({div, component, state, router, history, courseId}) ->
    upcomings = React.addons.TestUtils.scryRenderedDOMComponentsWithClass(component, 'rc-Day--upcoming')
    shouldBeTomorrow = _.first(upcomings)
    expect(shouldBeTomorrow.getDOMNode().classList.contains('active')).to.be.true

    addOnDayDropdown = React.addons.TestUtils.findRenderedComponentWithType(component, Add)
    expect(addOnDayDropdown.getDOMNode().style.display).to.not.equal('none')

    isTomorrow = addOnDayDropdown.state.addDate.isSame(moment(TimeStore.getNow()).add(1, 'day'), 'day')
    # add date for drop down should be Tomorrow
    expect(isTomorrow).to.be.true
    checks._checkAddMenu(addOnDayDropdown, router, courseId)

    {div, component, state, router, history, courseId}

  _checkIsAtHomeworkLinkAfterAddClick: ({div, component, state, router, history, courseId}) ->
    addOnDayDropdown = React.addons.TestUtils.findRenderedComponentWithType(component, Add)

    routeQuery = {due_at: addOnDayDropdown.state.addDate.format(addOnDayDropdown.props.dateFormat)}
    targetHomeworkLink = router.makeHref('createHomework', {courseId}, routeQuery)
    expect(state.path).to.equal(targetHomeworkLink)
    {div, component, state, router, history, courseId}

  _checkDoesTimezoneMatchCourse: ({div, component, state, router, history, courseId}) ->
    expect([undefined, CourseStore.getTimezone(courseId)]).to.contain(moment().tz())

    {div, component, state, router, history, courseId}


# promisify for chainability in specs
_.each(checks, (check, checkName) ->
  # rename without _ in front
  promiseName = checkName.slice(1)

  checks[promiseName] = (args...) ->
    Promise.resolve(check(args...))
)

checks._checkDoesViewShowPlan = (planId, {div, component, state, router, history, courseId}) ->
  plansList = TeacherTaskPlanStore.getActiveCoursePlans(courseId)
  plan = _.findWhere(plansList, {id: planId})

  expect(document.querySelector(".modal-title").innerText).to.equal(plan.title)

checks.checkDoesViewShowPlan = (planId) ->
  (args...) ->
    Promise.resolve(checks._checkDoesViewShowPlan(planId, args...))

checks._checkIsEditPlanLink = (planId, {div, component, state, router, history, courseId}) ->
  plansList = TeacherTaskPlanStore.getActiveCoursePlans(courseId)
  plan = _.findWhere(plansList, {id: planId})

  planEditRoute = "edit-#{plan.type}"

  targetEditLink = router.makeHref(camelCase(planEditRoute), {courseId, id: planId})
  planEdits = React.addons.TestUtils.scryRenderedComponentsWithType(component, CoursePlanDisplayEdit)
  thisPlanEdit = _.find(planEdits, (planEdit) ->
    planEdit.props.plan.id is planId
  )

  # checks that there's a link, and that the href matches
  expect(div.querySelector(".course-plan-#{planId} a").href).to.contain(targetEditLink)
  # checks that a CoursePlanDisplayEdit component was rendered for this plan
  expect(thisPlanEdit).to.not.be.null

checks.checkIsEditPlanLink = (planId) ->
  (args...) ->
    Promise.resolve(checks._checkIsEditPlanLink(planId, args...))

checks._checkIsViewPlanElement = (planId, {div, component, state, router, history, courseId}) ->
  planQuickLooks = React.addons.TestUtils.scryRenderedComponentsWithType(component, CoursePlanDisplayQuickLook)
  thisPlanQuickLook = _.find(planQuickLooks, (planQuickLook) ->
    planQuickLook.props.plan.id is planId
  )

  # checks that there's not a link.
  expect(div.querySelector(".course-plan-#{planId} a")).to.be.null
  # checks that a CoursePlanDisplayQuickLook component was rendered for this plan
  expect(thisPlanQuickLook).to.not.be.null

checks.checkIsViewPlanElement = (planId) ->
  (args...) ->
    Promise.resolve(checks._checkIsViewPlanElement(planId, args...))

checks._checkDoesViewShowPlanStats = (planId, {div, component, state, router, history, courseId}) ->
  plan = TaskPlanStatsStore.get(planId)

  expect(document.querySelector(".text-complete").innerText).to.equal(plan.stats[0].complete_count.toString())

checks.checkDoesViewShowPlanStats = (planId) ->
  (args...) ->
    Promise.resolve(checks._checkDoesViewShowPlanStats(planId, args...))

module.exports = checks
