_ = require 'underscore'
moment = require 'moment-timezone'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{default: Courses} = require '../../../src/models/courses-map'
{TocActions, TocStore} = require '../../../src/flux/toc'
{TimeStore} = require '../../../src/flux/time'
TimeHelper = require '../../../src/helpers/time'

{ReadingPlan} = require '../../../src/components/task-plan/reading'

{Testing, sinon, _, React} = require '../helpers/component-testing'
{ExtendBasePlan, PlanRenderHelper} = require '../helpers/task-plan'

yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(TimeHelper.ISO_DATE_FORMAT)
tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT)

COURSE_ID = '1'
COURSE = require '../../../api/user/courses/1.json'
COURSE_ECOSYSTEM_ID = COURSE.ecosystem_id

VISIBLE_READING = ExtendBasePlan({is_published: true},
  {opens_at: yesterday, due_at: tomorrow, target_id: COURSE.periods[0].id})
UNPUBLISHED_READING = ExtendBasePlan({page_ids: [1]})
NEW_READING = ExtendBasePlan({id: "_CREATING_1", settings: {page_ids: []}})

ECO_READING = require '../../../api/plans/1.json'
ECO_READING_ECOSYSTEM_ID = ECO_READING.ecosystem_id

helper = (model) -> PlanRenderHelper(model, ReadingPlan)

describe 'Reading Plan', ->
  beforeEach ->
    Courses.bootstrap([COURSE], { clear: true })
    TaskPlanActions.reset()

  it 'should allow add sections when not visible', ->
    helper(UNPUBLISHED_READING).then ({dom}) ->
      expect(dom.querySelector('#reading-select')).to.not.be.null

  xit 'should not allow add sections after visible', ->
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
