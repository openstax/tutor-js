_ = require 'underscore'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{ReadingPlan} = require '../../../src/components/task-plan/reading'
{Testing, sinon, expect, _, React} = require '../helpers/component-testing'
{ExtendBasePlan, PlanRenderHelper} = require '../helpers/task-plan'

yesterday = (new Date(Date.now() - 1000 * 3600 * 24)).toString()

VISIBLE_READING = ExtendBasePlan({published_at: yesterday}, {opens_at: yesterday})
UNPUBLISHED_READING = ExtendBasePlan({page_ids: [1]})
NEW_READING = ExtendBasePlan({id: "_CREATING_1", settings: {page_ids: []}})


helper = (model) -> PlanRenderHelper(model, ReadingPlan)

describe 'Reading Plan', ->
  beforeEach ->
    TaskPlanActions.reset()

  it 'should allow add sections when not visible', ->
    helper(UNPUBLISHED_READING).then ({dom}) ->
      expect(dom.querySelector('#reading-select')).to.not.be.null

  it 'should not allow add sections after visible', ->
    helper(VISIBLE_READING).then ({dom}) ->
      expect(dom.querySelector('#reading-select')).to.be.null

  it 'should show sections required message when saving and no sections', ->
    helper(NEW_READING).then ({dom}) ->
      expect(dom.querySelector('.readings-required')).to.be.null
      Testing.actions.click(dom.querySelector('.-save'))
      expect(dom.querySelector('.readings-required')).to.not.be.null

  it 'can mark form as invalid', ->
    helper(NEW_READING).then ({dom}) ->
      expect(dom.querySelector('.edit-reading.is-invalid-form')).to.be.null
      Testing.actions.click(dom.querySelector('.-save'))
      expect(dom.querySelector('.edit-reading.is-invalid-form')).to.not.be.null

  it 'hides form when selecting sections', ->
    helper(NEW_READING).then ({dom}) ->
      expect(dom.querySelector('.edit-reading.hide')).to.be.null
      Testing.actions.click(dom.querySelector('#reading-select'))
      expect(dom.querySelector('.edit-reading.hide')).to.not.be.null

