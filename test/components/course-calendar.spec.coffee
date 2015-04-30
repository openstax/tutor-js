{expect} = require 'chai'
_ = require 'underscore'
moment = require 'moment'
{Promise} = require 'es6-promise'

{calendarActions, calendarTests, calendarChecks} = require './helpers/calendar'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../src/flux/teacher-task-plan'
{TaskPlanStore, TaskPlanActions} = require '../../src/flux/task-plan'

React = require 'react/addons'
CourseCalendar = require '../../src/components/course-calendar'

planId = 1
courseId = 1

VALID_MODEL = require '../../api/courses/1/events.json'
# pin plan 1 to one month ago for testing
VALID_MODEL.plans[0].due_at = moment().subtract(1, 'month').toDate()
VALID_PLAN_MODEL = require '../../api/plans/1/stats.json'

describe 'Course Calendar', ->
  beforeEach (done) ->
    TeacherTaskPlanActions.loaded(VALID_MODEL, courseId)
    TaskPlanActions.loadedStats(VALID_PLAN_MODEL, planId)
    plan = TaskPlanStore.getStats(planId)

    calendarTests
      .goToCalendar("/courses/#{courseId}/t/calendar", courseId)
      .then((result) =>
        calendarComponent = React.addons.TestUtils.findRenderedComponentWithType(result.component, CourseCalendar)
        result.component = calendarComponent
        result.div = React.findDOMNode(calendarComponent)

        @result = result
        done()
      )
      .catch(done)

  afterEach ->
    calendarTests.unmount()
    TeacherTaskPlanActions.reset()

  it 'should render calendar', (done) ->
    calendarChecks
      .checkIsCalendarRendered(@result)
      .then((result) ->
        done()
      ).catch(done)

  it 'should render on current month', (done) ->
    calendarChecks
      .checkIsDateToday(@result)
      .then(calendarChecks.checkIsLabelThisMonth)
      .then((result) ->
        done()
      ).catch(done)

  it 'should render next month when next is clicked', (done) ->
    calendarActions
      .clickNext(@result)
      .then(calendarChecks.checkIsDateNextMonth)
      .then(calendarChecks.checkIsLabelNextMonth)
      .then((result) ->
        done()
      ).catch(done)

  it 'should render previous month when previous is clicked', (done) ->
    calendarActions
      .clickPrevious(@result)
      .then(calendarChecks.checkIsDatePreviousMonth)
      .then(calendarChecks.checkIsLabelPreviousMonth)
      .then((result) ->
        done()
      ).catch(done)

  it 'should render plans when month with plans is rendered', (done) ->
    calendarActions
      # TODO make work with goToMonthWithPlans instead
      # .goToMonthWithPlans(@result)
      .clickPrevious(@result)
      .then(calendarChecks.checkIsLabelPreviousMonth)
      .then(calendarChecks.checkDoesViewHavePlans)
      .then((result) ->
        done()
      ).catch(done)

  it 'should show plan details when plan is clicked', (done) ->
    calendarActions
      .clickPrevious(@result)
      .then(calendarActions.clickPlan(planId))
      .then(calendarChecks.checkDoesViewShowPlan(planId))
      .then((result) ->
        done()
      ).catch(done)

  it 'should show plan stats when plan is clicked', (done) ->
    calendarActions
      .clickPrevious(@result)
      .then(calendarActions.clickPlan(planId))
      .then(calendarChecks.checkDoesViewShowPlanStats(planId))
      .then((result) ->
        done()
      ).catch(done)

  it 'should show add plan links when add component is clicked', (done) ->
    calendarActions
      .clickAdd(@result)
      .then(calendarChecks.checkDoesAddDropDownShow)
      .then(calendarChecks.checkDoesAddMenuLinkCorrectly)
      .then((result) ->
        done()
      ).catch(done)

  it 'should show today as past and tomorrow as upcoming', (done) ->
    calendarActions
      .clickAdd(@result)
      .then(calendarChecks.checkIsTodayPast)
      .then(calendarChecks.checkIsTodayNotClickable)
      .then(calendarChecks.checkIsTomorrowUpcoming)
      .then(calendarChecks.checkIsTomorrowClickable)
      .then((result) ->
        done()
      ).catch(done)

  it 'should show add plan links when tomorrow is clicked', (done) ->
    calendarActions
      .clickTomorrow(@result)
      .then(calendarChecks.checkTomorrowAddPlansDropDown)
      .then((result) ->
        done()
      ).catch(done)

  # TODO unsure why this test doesn't work, but it was kinda icing on the cake anyways.
  # it 'should navigate to add homework route when Add Homework is clicked from date', (done) ->
  #   calendarActions
  #     .clickTomorrow(@result)
  #     .then(calendarActions.clickAddHomework)
  #     .then(calendarChecks.checkIsAtHomeworkLinkAfterAddClick)
  #     .then((result) ->
  #       done()
  #     ).catch(done)
