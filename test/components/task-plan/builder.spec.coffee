{expect} = require 'chai'

React = require 'react'
_ = require 'underscore'
moment = require 'moment'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{TimeActions, TimeStore} = require '../../../src/flux/time'

Builder = require '../../../src/components/task-plan/builder'
{Testing, sinon, expect, _, React} = require '../helpers/component-testing'

two_days_ago = (new Date(Date.now() - 1000 * 3600 * 24 * 2)).toString()
yesterday = (new Date(Date.now() - 1000 * 3600 * 24)).toString()
tomorrow = (new Date(Date.now() + 1000 * 3600 * 24)).toString()
dayAfter = (new Date(tomorrow + 1000 * 3600 * 24)).toString()


extendBasePlan = (props, taskingProps = {}) ->
  baseModel =
    id: '111'
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
    baseModel.tasking_plans.push(baseTaskingPlan)

  baseModel

NEW_READING = extendBasePlan({type: 'reading', id: "_CREATING_1"})
UNPUBLISHED_READING = extendBasePlan({type: 'reading'})
PUBLISHED_READING = extendBasePlan({type: 'reading', published_at: yesterday})
PAST_DUE_PUBLISHED_READING = extendBasePlan({type: 'reading', published_at: two_days_ago}, {opens_at: two_days_ago, due_at: yesterday})
VISIBLE_READING = extendBasePlan({type: 'reading', published_at: yesterday}, {opens_at: yesterday})
VISIBLE_HW = extendBasePlan({type: 'homework', published_at: yesterday}, {opens_at: yesterday})

NEW_HW = extendBasePlan({type: 'homework', id: "_CREATING_1"})
HW_WITH_EXERCISES = ({
  type: 'homework',
  settings: {
    exercise_ids: ['1']
  }
})
VISIBLE_HW = extendBasePlan({
  type: 'homework',
  published_at: yesterday}, {
  opens_at: yesterday
})

helper = (model) ->
  {id} = model
  # Load the plan into the store
  TaskPlanActions.loaded(model, id)
  Testing.renderComponent( Builder, props: {id, courseId: "1"} )


describe 'Task Plan Footer', ->
  beforeEach ->
    TaskPlanActions.reset()

  it 'should be hiding all periods on default', ->
    helper(NEW_READING).then ({dom}) ->
      checkedPeriodsToggle = dom.querySelector('input[name=toggle-periods-radio]:checked')
      expect(checkedPeriodsToggle.id).to.contain('hide')
      expect(wrapper.refs.element.state.showingPeriods).to.be.false

  it 'should change state when periods toggle is changed', ->
    helper(NEW_READING).then ({dom, wrapper}) ->
      uncheckedPeriodsToggle = dom.querySelector('input[name=toggle-periods-radio]:not(:checked)')
      Testing.actions.change(uncheckedPeriodsToggle)
      expect(wrapper.refs.element.state.showingPeriods).to.be.true

