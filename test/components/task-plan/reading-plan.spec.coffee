_ = require 'underscore'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{CourseActions, CourseStore} = require '../../../src/flux/course'
{TocActions, TocStore} = require '../../../src/flux/toc'

{ReadingPlan} = require '../../../src/components/task-plan/reading'

{Testing, sinon, expect, _, React} = require '../helpers/component-testing'
{ExtendBasePlan, PlanRenderHelper} = require '../helpers/task-plan'

yesterday = (new Date(Date.now() - 1000 * 3600 * 24)).toString()

VISIBLE_READING = ExtendBasePlan({published_at: yesterday}, {opens_at: yesterday})
UNPUBLISHED_READING = ExtendBasePlan({page_ids: [1]})
NEW_READING = ExtendBasePlan({id: "_CREATING_1", settings: {page_ids: []}})

COURSE_ID = '1'
COURSE = require '../../../api/user/courses/1.json'
COURSE_ECOSYSTEM_ID = COURSE.ecosystem_id

ECO_READING = require '../../../api/plans/1.json'
ECO_READING_ECOSYSTEM_ID = ECO_READING.ecosystem_id

helper = (model) -> PlanRenderHelper(model, ReadingPlan)

describe 'Reading Plan', ->
  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
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

  it 'should load the course\'s ecosystem_id when new or not specified on the plan', ->
    TocActions.load = sinon.spy()

    helper(NEW_READING).then ->
      expect(TocActions.load).to.have.been.calledWith(COURSE_ECOSYSTEM_ID)

  it 'should load the plan\'s specified ecosystem_id', ->
    TocActions.load = sinon.spy()

    helper(ECO_READING).then ->
      expect(TocActions.load).to.have.been.calledWith(ECO_READING_ECOSYSTEM_ID)
