_ = require 'underscore'
moment = require 'moment-timezone'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{CourseActions, CourseStore} = require '../../../src/flux/course'
{TimeStore} = require '../../../src/flux/time'
TimeHelper = require '../../../src/helpers/time'

{ExternalPlan} = require '../../../src/components/task-plan/external'

{Testing, sinon, expect, _, React, ReactTestUtils} = require '../helpers/component-testing'
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

describe 'Homework Plan', ->
  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
    TaskPlanActions.reset()

  it 'should allow set url when not visible', ->
    helper(UNPUBLISHED_EXTERNAL).then ({dom}) ->
      expect(dom.querySelector('#external-url[disabled]')).to.be.null

  it 'should not allow add setting url after visible', ->
    helper(VISIBLE_EXTERNAL).then ({dom}) ->
      expect(dom.querySelector('#external-url[disabled]')).to.not.be.null

  it 'should show url required message when saving and no assignment URL', ->
    helper(NEW_EXTERNAL).then ({dom}) ->
      Testing.actions.click(dom.querySelector('.-save'))
      expect(dom.querySelector('.external-url.is-required.has-error')).to.not.be.null

  it 'can mark form as invalid', ->
    helper(NEW_EXTERNAL).then ({dom}) ->
      expect(dom.querySelector('.edit-external.is-invalid-form')).to.be.null
      Testing.actions.click(dom.querySelector('.-save'))
      expect(dom.querySelector('.edit-external.is-invalid-form')).to.not.be.null

