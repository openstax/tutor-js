{expect} = require 'chai'

React = require 'react'
_ = require 'underscore'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
PlanFooter = require '../../../src/components/task-plan/footer'
{Testing, sinon, expect, _, React} = require '../helpers/component-testing'

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

  _.extend({}, baseModel, props)

  if taskingProps?
    _.extend({}, baseTaskingPlan, taskingProps)

    baseModel.tasking_plans = []
    baseModel.tasking_plans.push(baseTaskingPlan)
  baseModel

NEW_READING = extendBasePlan({type: 'reading', id: "_CREATING_1"})
UNPUBLISHED_READING = extendBasePlan({type: 'reading'})
PUBLISHED_READING = extendBasePlan({type: 'reading', published_at: yesterday})
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
  console.info(model)
  # Load the plan into the store
  TaskPlanActions.loaded(model, id)
  Testing.renderComponent( PlanFooter, props: {id} )


describe 'Task Plan Footer', ->
  beforeEach ->
    TaskPlanActions.reset()

  it 'should have correct buttons when reading is new', ->
    helper(NEW_READING).then ({dom}) ->
      expect(dom.querySelector('.delete-link')).to.be.null
      expect(dom.querySelector('.-save')).to.not.be.null
      expect(dom.querySelector('.-publish')).to.not.be.null

  it 'should have correct buttons when reading is unpublished', ->
    helper(UNPUBLISHED_READING).then ({dom}) ->
      expect(dom.querySelector('.delete-link')).to.not.be.null
      expect(dom.querySelector('.-save')).to.not.be.null
      expect(dom.querySelector('.-publish')).to.not.be.null

  it 'should have correct buttons when reading is published', ->
    helper(PUBLISHED_READING).then ({dom}) ->
      expect(dom.querySelector('.delete-link')).to.not.be.null
      expect(dom.querySelector('.-save')).to.be.null
      expect(dom.querySelector('.-publish')).to.not.be.null

  xit 'should have correct buttons when reading is visible', ->
    helper(VISIBLE_READING).then ({dom}) ->
      expect(dom.querySelector('.delete-link')).to.be.null
      expect(dom.querySelector('.-save')).to.be.null
      expect(dom.querySelector('.-publish')).to.not.be.null
