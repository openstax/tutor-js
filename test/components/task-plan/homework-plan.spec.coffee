_ = require 'underscore'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{HomeworkPlan} = require '../../../src/components/task-plan/homework'
{Testing, sinon, expect, _, React} = require '../helpers/component-testing'
{ExtendBasePlan, PlanRenderHelper} = require '../helpers/task-plan'

yesterday = (new Date(Date.now() - 1000 * 3600 * 24)).toString()

VISIBLE_HW = ExtendBasePlan({type: 'homework', published_at: yesterday, exercise_ids: [1]}, {opens_at: yesterday})
UNPUBLISHED_HW = ExtendBasePlan({type: 'homework', exercise_ids: [1]})
NEW_HW = ExtendBasePlan({type: 'homework', id: "_CREATING_1"})

helper = (model) -> PlanRenderHelper(model, HomeworkPlan)

describe 'Homework Plan', ->
  beforeEach ->
    TaskPlanActions.reset()

  it 'should allow add exercises when not visible', ->
    helper(UNPUBLISHED_HW).then ({dom}) ->
      expect(dom.querySelector('#problems-select')).to.not.be.null

  it 'should not allow add exercises after visible', ->
    helper(VISIBLE_HW).then ({dom}) ->
      expect(dom.querySelector('#problems-select')).to.be.null

  it 'should show exercises required message when saving and no exercises', ->
    helper(NEW_HW).then ({dom}) ->
      expect(dom.querySelector('.problems-required')).to.be.null
      Testing.actions.click(dom.querySelector('.-save'))
      expect(dom.querySelector('.problems-required')).to.not.be.null

  it 'can mark form as invalid', ->
    helper(NEW_HW).then ({dom}) ->
      expect(dom.querySelector('.edit-homework.is-invalid-form')).to.be.null
      Testing.actions.click(dom.querySelector('.-save'))
      expect(dom.querySelector('.edit-homework.is-invalid-form')).to.not.be.null

  it 'hides form when selecting sections', ->
    helper(NEW_HW).then ({dom}) ->
      expect(dom.querySelector('.edit-homework.hide')).to.be.null
      Testing.actions.click(dom.querySelector('#problems-select'))
      expect(dom.querySelector('.edit-homework.hide')).to.not.be.null
      expect(dom.querySelector('.homework-plan-exercise-select-topics')).to.not.be.null

