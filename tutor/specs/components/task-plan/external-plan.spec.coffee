_ = require 'underscore'
moment = require 'moment-timezone'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{TaskingActions} = require '../../../src/flux/tasking'
{default: Courses} = require '../../../src/models/courses-map'
{TimeStore} = require '../../../src/flux/time'
TimeHelper = require '../../../src/helpers/time'

{ExternalPlan} = require '../../../src/components/task-plan/external'

{Testing, sinon, _, React, ReactTestUtils} = require '../helpers/component-testing'
{ExtendBasePlan, PlanRenderHelper} = require '../helpers/task-plan'

yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(TimeHelper.ISO_DATE_FORMAT)
tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT)

COURSE_ID = '1'
COURSE = require '../../../api/user/courses/1.json'
COURSE_ECOSYSTEM_ID = COURSE.ecosystem_id

VISIBLE_EXTERNAL = ExtendBasePlan({type: 'external', is_published: true, exercise_ids: [1]},
  {opens_at: yesterday, due_at: tomorrow, target_id: COURSE.periods[0].id})
UNPUBLISHED_EXTERNAL = ExtendBasePlan({type: 'external'})
NEW_EXTERNAL = ExtendBasePlan({type: 'external', id: "_CREATING_1"})

EXTERNAL_PLAN = require '../../../api/plans/8.json'

helper = (model) -> PlanRenderHelper(model, ExternalPlan)

describe 'External Homework Plan', ->
  beforeEach ->
    Courses.bootstrap([COURSE], { clear: true })
    TaskPlanActions.reset()
    TaskingActions.reset()

  it 'should allow set url when not visible', ->
    helper(UNPUBLISHED_EXTERNAL).then ({dom}) ->
      expect(
        dom.querySelector('#external-url').getAttribute('disabled')
      ).not.to.exist

  xit 'should not allow add setting url after visible', ->
    helper(VISIBLE_EXTERNAL).then ({dom, element}) ->
      expect(
        dom.querySelector('#external-url').getAttribute('disabled')
      ).to.exist

  xit 'should show url required message when saving and no assignment URL', ->
    helper(NEW_EXTERNAL).then ({dom}) ->
      Testing.actions.click(dom.querySelector('.-save'))
      expect(dom.querySelector('.external-url.is-required.has-error')).to.not.be.null

  it 'can mark form as invalid', ->
    helper(NEW_EXTERNAL).then ({dom}) ->
      expect(dom.querySelector('.edit-external.is-invalid-form')).to.be.null
      Testing.actions.click(dom.querySelector('.-save'))
      expect(dom.querySelector('.edit-external.is-invalid-form')).to.not.be.null
