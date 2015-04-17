{expect} = require 'chai'
_ = require 'underscore'
{Promise} = require 'es6-promise'

{calendarActions, calendarTests, calendarChecks} = require './helpers/calendar'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../src/flux/teacher-task-plan'


courseId = 1

VALID_MODEL = require '../../api/courses/1/plans.json'

describe 'Course Calendar', ->
  beforeEach (done)->
    TeacherTaskPlanActions.loaded(VALID_MODEL, courseId)
    calendarTests
      .renderCalendar(courseId)
      .then((result) =>
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

  it 'should show plan detail when plan is clicked', (done) ->
    calendarActions
      .clickPrevious(@result)
      .then(calendarActions.clickPlan(1))
      .then(calendarChecks.checkDoesViewShowPlan(1))
      .then((result) ->
        done()
      ).catch(done)

