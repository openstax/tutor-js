{expect} = require 'chai'
_ = require 'underscore'
{Promise} = require 'es6-promise'

{calendarActions, calendarTests, calendarChecks} = require './helpers/calendar'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../../src/flux/teacher-task-plan'
{TaskPlanStore, TaskPlanActions} = require '../../src/flux/task-plan'

React = require 'react/addons'
CourseCalendar = require '../../src/components/course-calendar'

planId = 1
courseId = 1

VALID_MODEL = require '../../api/courses/1/plans.json'
VALID_PLAN_MODEL = require '../../api/plans/1.json'

describe 'Course Calendar', ->
  beforeEach (done) ->
    TeacherTaskPlanActions.loaded(VALID_MODEL, courseId)
    TaskPlanActions.loaded(VALID_PLAN_MODEL, planId)

    calendarTests
      .goToCalendar("/courses/#{courseId}/readings", courseId)
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

