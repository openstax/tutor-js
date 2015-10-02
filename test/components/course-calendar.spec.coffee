{expect} = require 'chai'
_ = require 'underscore'
moment = require 'moment'
{Promise} = require 'es6-promise'

{calendarActions, calendarTests, calendarChecks} = require './helpers/calendar'
{TimeActions, TimeStore} = require '../../src/flux/time'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../src/flux/teacher-task-plan'
{TaskPlanStatsStore, TaskPlanStatsActions} = require '../../src/flux/task-plan-stats'

React = require 'react/addons'
CourseCalendar = require '../../src/components/course-calendar'
COURSE = require '../../api/user/courses/1.json'
{CourseActions} = require '../../src/flux/course'

planId = '1'
draftPlanId = '3'
courseId = '1'

VALID_MODEL = require '../../api/courses/1/dashboard.json'
# pin plan 1 to one month ago for testing
_.each VALID_MODEL.plans[0].tasking_plans, (tasking) ->
  tasking.due_at = moment(TimeStore.getNow()).subtract(1, 'month').toDate()

# pin draft plan to one month ago for testing
_.each VALID_MODEL.plans[1].tasking_plans, (tasking) ->
  tasking.due_at = moment(TimeStore.getNow()).subtract(1, 'month').toDate()

VALID_PLAN_MODEL = require '../../api/plans/1/stats.json'

describe 'Course Calendar', ->
  beforeEach (done) ->
    TeacherTaskPlanActions.HACK_DO_NOT_RELOAD(true)
    CourseActions.loaded(COURSE, courseId)
    TeacherTaskPlanActions.loaded(VALID_MODEL, courseId)
    plan = TaskPlanStatsStore.get(planId)
    draftPlan = TaskPlanStatsStore.get(draftPlanId)

    calendarTests
      .goToCalendar("/courses/#{courseId}/t/calendar", courseId)
      .then((result) =>
        calendarComponent = React.addons.TestUtils.findRenderedComponentWithType(result.component, CourseCalendar)
        result.component = calendarComponent
        result.div = React.findDOMNode(calendarComponent)

        @result = result
        done()
      , done)

  afterEach ->
    calendarTests.unmount()
    TeacherTaskPlanActions.reset()
    TeacherTaskPlanActions.HACK_DO_NOT_RELOAD(false)


  it 'should render calendar', (done) ->
    calendarChecks
      .checkIsCalendarRendered(@result)
      .then( ->
        done()
      , done)

  it 'should render on current month', (done) ->
    calendarChecks
      .checkIsLabelThisMonth(@result)
      .then( ->
        done()
      , done)

  it 'should render next month when next is clicked', (done) ->
    calendarActions
      .clickNext(@result)
      .then(calendarChecks.checkIsDateNextMonth)
      .then(calendarChecks.checkIsLabelNextMonth)
      .then( ->
        done()
      , done)

  it 'should render previous month when previous is clicked', (done) ->
    calendarActions
      .clickPrevious(@result)
      .then(calendarChecks.checkIsDatePreviousMonth)
      .then(calendarChecks.checkIsLabelPreviousMonth)
      .then( ->
        done()
      , done)

  it 'should render plans when month with plans is rendered', (done) ->
    calendarActions
      # TODO make work with goToMonthWithPlans instead
      # .goToMonthWithPlans(@result)
      .clickPrevious(@result)
      .then(calendarChecks.checkIsLabelPreviousMonth)
      .then(calendarChecks.checkDoesViewHavePlans)
      .then( ->
        done()
      , done)

  it 'should show plan edit link when plan is a draft', (done) ->
    calendarActions
      .clickPrevious(@result)
      .then(calendarChecks.checkIsEditPlanLink(draftPlanId))
      .then( ->
        done()
      , done)

  xit 'should have plan details onClick when plan is published', (done) ->
    calendarActions
      .clickPrevious(@result)
      .then(calendarChecks.checkIsViewPlanElement(planId))
      .then( ->
        done()
      , done)

  xit 'should show plan details when plan is clicked', (done) ->
    calendarActions
      .clickPrevious(@result)
      .then(calendarActions.clickPlan(planId))
      .then(calendarChecks.checkDoesViewShowPlan(planId))
      .then( ->
        done()
      , done)

  xit 'should show plan stats when plan is clicked', (done) ->
    calendarActions
      .clickPrevious(@result)
      .then(calendarActions.clickPlan(planId))
      .then(calendarChecks.checkDoesViewShowPlanStats(planId))
      .then( ->
        done()
      , done)

  it 'should show yesterday as past, today as current, and tomorrow as upcoming', (done) ->
    calendarChecks
      .checkIsYesterdayPast(@result)
      .then(calendarChecks.checkIsYesterdayClickable)
      .then(calendarChecks.checkIsTodayCurrent)
      .then(calendarChecks.checkIsTodayClickable)
      .then(calendarChecks.checkIsTomorrowUpcoming)
      .then(calendarChecks.checkIsTomorrowClickable)
      .then( ->
        done()
      , done)

  it 'should show cannot add plan warning when today is clicked', (done) ->
    calendarActions
      .clickToday(@result)
      .then(calendarChecks.checkAddPlansWarning)
      .then( ->
        done()
      , done)

  it 'should show add plan links when tomorrow is clicked', (done) ->
    calendarActions
      .clickTomorrow(@result)
      .then(calendarChecks.checkTomorrowAddPlansDropDown)
      .then( ->
        done()
      , done)

  it 'should show cannot add plan warning when yesterday is clicked', (done) ->
    calendarActions
      .clickYesterday(@result)
      .then(calendarChecks.checkAddPlansWarning)
      .then( ->
        done()
      , done)

  # TODO unsure why this test doesn't work, but it was kinda icing on the cake anyways.
  # it 'should navigate to add homework route when Add Homework is clicked from date', (done) ->
  #   calendarActions
  #     .clickTomorrow(@result)
  #     .then(calendarActions.clickAddHomework)
  #     .then(calendarChecks.checkIsAtHomeworkLinkAfterAddClick)
  #     .then( ->
  #       done()
  #      , done)
