{expect} = require 'chai'

React = require 'react'
_ = require 'underscore'
moment = require 'moment'

{CourseActions, CourseStore} = require '../../../src/flux/course'
{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{TimeActions, TimeStore} = require '../../../src/flux/time'

Builder = require '../../../src/components/task-plan/builder'
{Testing, sinon, expect, _, React} = require '../helpers/component-testing'

# we should gather things somewhere nice.
DATE_STRING_FORMAT = 'YYYY-MM-DD'

two_days_ago = (new Date(Date.now() - 1000 * 3600 * 24 * 2)).toString()
yesterday = (new Date(Date.now() - 1000 * 3600 * 24)).toString()
tomorrow = (new Date(Date.now() + 1000 * 3600 * 24)).toString()
dayAfter = (new Date(Date.now() + 1000 * 3600 * 48)).toString()

twoDaysAfter = moment(TimeStore.getNow()).add(2, 'days')
threeDaysAfter = moment(TimeStore.getNow()).add(3, 'days')

COURSE_TEST_ID = '4-only'
COURSE_TEST_DATA = require '../../../api/courses/4-only.json'

PLAN_TEST_ID = '111'
PLAN_NEW_TEST_ID = '_CREATING_1'

CourseActions.loaded(COURSE_TEST_DATA, COURSE_TEST_ID)

extendBasePlan = (props, taskingProps) ->
  baseModel =
    id: PLAN_TEST_ID
    title: 'Test Title'
    settings:
      page_ids: ['1']

  baseTaskingPlan =
    opens_at: tomorrow
    due_at: dayAfter

  baseModel = _.extend({}, baseModel, props)

  if taskingProps?
    baseTaskingPlan = _.extend({}, baseTaskingPlan, taskingProps)
    baseModel.tasking_plans = []
    {periods} = CourseStore.get(COURSE_TEST_ID)

    _.each(periods, (period) ->
      taskingPeriod =
        target_id: period.id
        target_type: 'period'

      periodTaskingPlan = _.extend({}, baseTaskingPlan, taskingPeriod)
      baseModel.tasking_plans.push(periodTaskingPlan)
    )

  baseModel

NEW_READING = extendBasePlan({type: 'reading', id: PLAN_NEW_TEST_ID})
UNPUBLISHED_READING = extendBasePlan({type: 'reading'}, {})
PUBLISHED_READING = extendBasePlan({type: 'reading', published_at: yesterday}, {})
PAST_DUE_PUBLISHED_READING = extendBasePlan({type: 'reading', published_at: two_days_ago}, {opens_at: two_days_ago, due_at: yesterday})
VISIBLE_READING = extendBasePlan({type: 'reading', published_at: yesterday}, {opens_at: yesterday})


helper = (model, options) ->
  {id} = model
  options = _.extend({}, {props: {id, courseId: COURSE_TEST_ID}}, options)
  # Load the plan into the store
  TaskPlanActions.loaded(model, id)
  Testing.renderComponent( Builder, options )


getInputDateValue = (tutorDateInputComponent) ->
  pickerDOM = tutorDateInputComponent.refs.picker.getDOMNode()
  pickerDateInput = pickerDOM.querySelector('.datepicker__input')
  tutorDateInputComponent.getValue()

pickDateValue = (tutorDateInputComponent, date) ->
  tutorDateInputComponent.dateSelected(date)

describe 'Task Plan Builder, new reading', ->
  beforeEach ->
    TaskPlanActions.HACK_DO_NOT_RELOAD(true)
    CourseActions.HACK_DO_NOT_RELOAD(true)

    TaskPlanActions.reset()
    CourseActions.loaded(COURSE_TEST_DATA, COURSE_TEST_ID)

  it 'should be hiding all periods on default', ->
    helper(NEW_READING).then ({dom, element}) ->
      checkedPeriodsToggle = dom.querySelector('input[name=toggle-periods-radio]:checked')
      expect(checkedPeriodsToggle.id).to.contain('hide')
      expect(element.state.showingPeriods).to.be.false

  it 'should change state when periods toggle is changed', ->
    helper(NEW_READING).then ({dom, element}) ->
      uncheckedPeriodsToggle = dom.querySelector('input[name=toggle-periods-radio]:not(:checked)')
      Testing.actions.change(uncheckedPeriodsToggle)
      expect(element.state.showingPeriods).to.be.true

  it 'should use query params as default due at date', ->
    routerQuery =
      due_at: moment(threeDaysAfter).format(DATE_STRING_FORMAT)

    tomorrow = moment(TimeStore.getNow()).add(1, 'day')

    helper(NEW_READING, {routerQuery}).then ({dom, element}) ->
      {taskingOpensAt, taskingDueAt} = element.getDefaultPlanDates()

      openDateValue = getInputDateValue(element.refs.openDate)
      dueDateValue = getInputDateValue(element.refs.dueDate)

      expect(moment(routerQuery.due_at).isSame(dueDateValue, 'day')).to.be.true
      expect(moment(tomorrow).isSame(openDateValue, 'day')).to.be.true

      expect(moment(taskingDueAt).isSame(dueDateValue, 'day')).to.be.true
      expect(moment(taskingOpensAt).isSame(openDateValue, 'day')).to.be.true


  it 'should use query params as default opens at date', ->
    routerQuery =
      opens_at: moment(twoDaysAfter).format(DATE_STRING_FORMAT)

    helper(NEW_READING, {routerQuery}).then ({dom, element}) ->
      {taskingOpensAt, taskingDueAt} = element.getDefaultPlanDates()

      openDateValue = getInputDateValue(element.refs.openDate)
      dueDateValue = getInputDateValue(element.refs.dueDate)

      expect(dueDateValue).to.be.falsy
      expect(moment(routerQuery.opens_at).isSame(openDateValue, 'day')).to.be.true

      expect(taskingDueAt).to.be.falsy
      expect(moment(taskingOpensAt).isSame(openDateValue, 'day')).to.be.true


  it 'should use query params as default dates', ->
    routerQuery =
      due_at: moment(threeDaysAfter).format(DATE_STRING_FORMAT)
      opens_at: moment(twoDaysAfter).format(DATE_STRING_FORMAT)

    helper(NEW_READING, {routerQuery}).then ({dom, element}) ->
      {taskingOpensAt, taskingDueAt} = element.getDefaultPlanDates()

      openDateValue = getInputDateValue(element.refs.openDate)
      dueDateValue = getInputDateValue(element.refs.dueDate)

      expect(moment(routerQuery.due_at).isSame(dueDateValue, 'day')).to.be.true
      expect(moment(routerQuery.opens_at).isSame(openDateValue, 'day')).to.be.true

      expect(moment(taskingDueAt).isSame(dueDateValue, 'day')).to.be.true
      expect(moment(taskingOpensAt).isSame(openDateValue, 'day')).to.be.true


  it 'should autofill due dates for periods first switching to periods', ->
    helper(NEW_READING).then ({dom, element}) ->
      pickDateValue(element.refs.dueDate, moment(threeDaysAfter))

      commonOpenDate = getInputDateValue(element.refs.openDate)
      commonDueDate = getInputDateValue(element.refs.dueDate)

      uncheckedPeriodsToggle = dom.querySelector('input[name=toggle-periods-radio]:not(:checked)')
      Testing.actions.change(uncheckedPeriodsToggle)

      {tasking_plans} = TaskPlanStore.get(PLAN_NEW_TEST_ID)

      _.each(tasking_plans, (tasking) ->
        expect(moment(tasking.due_at).isSame(commonDueDate, 'day')).to.be.true
        expect(moment(tasking.opens_at).isSame(commonOpenDate, 'day')).to.be.true
      )


  it 'should handle different open and due dates for periods', ->
    helper(NEW_READING).then ({dom, element}) ->
      pickDateValue(element.refs.dueDate, moment(threeDaysAfter))

      commonOpenDate = getInputDateValue(element.refs.openDate)
      commonDueDate = getInputDateValue(element.refs.dueDate)

      uncheckedPeriodsToggle = dom.querySelector('input[name=toggle-periods-radio]:not(:checked)')
      Testing.actions.change(uncheckedPeriodsToggle)

      {periods} = CourseStore.get(COURSE_TEST_ID)

      updates = []

      # change each tasking plan's dates
      _.each(periods, (period, iter) ->
        due_at = moment(commonDueDate).add(iter + 1, 'day')
        opens_at = moment(commonOpenDate).add(iter + 1, 'day')

        updates.push({due_at, opens_at})

        pickDateValue(element.refs["dueDate#{period.id}"], due_at)
        pickDateValue(element.refs["openDate#{period.id}"], opens_at)
      )

      {tasking_plans} = TaskPlanStore.get(PLAN_NEW_TEST_ID)

      _.each(tasking_plans, (tasking, iter) ->
        expect(moment(tasking.due_at).isSame(updates[iter].due_at, 'day')).to.be.true
        # TO DO this line should pass
        # expect(moment(tasking.opens_at).isSame(updates[iter].opens_at, 'day')).to.be.true
      )


  it 'should have valid dates when switching from changed periods to all', ->
    helper(NEW_READING).then ({dom, element}) ->
      pickDateValue(element.refs.dueDate, moment(threeDaysAfter))

      commonOpenDate = getInputDateValue(element.refs.openDate)
      commonDueDate = getInputDateValue(element.refs.dueDate)

      # toggle to individual
      uncheckedPeriodsToggle = dom.querySelector('input[name=toggle-periods-radio]:not(:checked)')
      Testing.actions.change(uncheckedPeriodsToggle)

      {periods} = CourseStore.get(COURSE_TEST_ID)

      # change each tasking plan's dates
      _.each(periods, (period, iter) ->
        due_at = moment(commonDueDate).add(iter + 1, 'day')
        opens_at = moment(commonOpenDate).add(iter + 1, 'day')

        pickDateValue(element.refs["dueDate#{period.id}"], due_at)
        pickDateValue(element.refs["openDate#{period.id}"], opens_at)
      )

      # toggle back to all
      uncheckedPeriodsToggle = dom.querySelector('input[name=toggle-periods-radio]:not(:checked)')
      Testing.actions.change(uncheckedPeriodsToggle)

      {tasking_plans} = TaskPlanStore.get(PLAN_NEW_TEST_ID)

      _.each(tasking_plans, (tasking, iter) ->
        expect(tasking.due_at).to.not.be.null
        expect(tasking.opens_at).to.not.be.null
      )


  it 'should have valid dates when switching from changed due_at to all', ->
    helper(NEW_READING).then ({dom, element}) ->
      pickDateValue(element.refs.dueDate, moment(threeDaysAfter))

      commonOpenDate = getInputDateValue(element.refs.openDate)
      commonDueDate = getInputDateValue(element.refs.dueDate)

      # toggle to individual
      uncheckedPeriodsToggle = dom.querySelector('input[name=toggle-periods-radio]:not(:checked)')
      Testing.actions.change(uncheckedPeriodsToggle)

      {periods} = CourseStore.get(COURSE_TEST_ID)

      # change each tasking plan's dates
      _.each(periods, (period, iter) ->
        due_at = moment(commonDueDate).add(iter + 1, 'day')

        pickDateValue(element.refs["dueDate#{period.id}"], due_at)
      )

      # toggle back to all
      uncheckedPeriodsToggle = dom.querySelector('input[name=toggle-periods-radio]:not(:checked)')
      Testing.actions.change(uncheckedPeriodsToggle)

      {tasking_plans} = TaskPlanStore.get(PLAN_NEW_TEST_ID)

      _.each(tasking_plans, (tasking, iter) ->
        expect(tasking.due_at).to.not.be.null
        expect(tasking.opens_at).to.not.be.null
      )


  it 'should have valid dates when switching from changed opens_at to all', ->
    helper(NEW_READING).then ({dom, element}) ->
      pickDateValue(element.refs.dueDate, moment(threeDaysAfter))

      commonOpenDate = getInputDateValue(element.refs.openDate)
      commonDueDate = getInputDateValue(element.refs.dueDate)

      # toggle to individual
      uncheckedPeriodsToggle = dom.querySelector('input[name=toggle-periods-radio]:not(:checked)')
      Testing.actions.change(uncheckedPeriodsToggle)

      {periods} = CourseStore.get(COURSE_TEST_ID)

      # change each tasking plan's dates
      _.each(periods, (period, iter) ->
        opens_at = moment(commonOpenDate).add(iter + 1, 'day')

        pickDateValue(element.refs["dueDate#{period.id}"], opens_at)
      )

      # toggle back to all
      uncheckedPeriodsToggle = dom.querySelector('input[name=toggle-periods-radio]:not(:checked)')
      Testing.actions.change(uncheckedPeriodsToggle)

      {tasking_plans} = TaskPlanStore.get(PLAN_NEW_TEST_ID)

      _.each(tasking_plans, (tasking, iter) ->
        expect(tasking.due_at).to.not.be.null
        expect(tasking.opens_at).to.not.be.null
      )


describe 'Task Plan Builder, existing reading', ->
  beforeEach ->
    TaskPlanActions.HACK_DO_NOT_RELOAD(true)
    CourseActions.HACK_DO_NOT_RELOAD(true)

    TaskPlanActions.reset()
    CourseActions.loaded(COURSE_TEST_DATA, COURSE_TEST_ID)

  it 'should not use query params as default dates', ->
    routerQuery =
      due_at: moment(threeDaysAfter).add(7, 'days').format(DATE_STRING_FORMAT)
      opens_at: moment(twoDaysAfter).add(7, 'days').format(DATE_STRING_FORMAT)

    helper(PUBLISHED_READING, {routerQuery}).then ({dom, element}) ->
      {taskingOpensAt, taskingDueAt} = element.getDefaultPlanDates()

      openDateValue = getInputDateValue(element.refs.openDate)
      dueDateValue = getInputDateValue(element.refs.dueDate)

      expect(moment(routerQuery.due_at).isSame(dueDateValue, 'day')).to.be.false
      expect(moment(routerQuery.opens_at).isSame(openDateValue, 'day')).to.be.false

      expect(moment(taskingDueAt).isSame(dueDateValue, 'day')).to.be.true
      expect(moment(taskingOpensAt).isSame(openDateValue, 'day')).to.be.true
