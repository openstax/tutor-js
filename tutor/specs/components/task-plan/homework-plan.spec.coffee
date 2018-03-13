_ = require 'underscore'
moment = require 'moment-timezone'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{default: Courses} = require '../../../src/models/courses-map'

{TimeStore} = require '../../../src/flux/time'
TimeHelper = require '../../../src/helpers/time'

{HomeworkPlan} = require '../../../src/components/task-plan/homework'

{Testing, sinon, _, React, ReactTestUtils} = require '../helpers/component-testing'
{ExtendBasePlan, PlanRenderHelper} = require '../helpers/task-plan'

yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(TimeHelper.ISO_DATE_FORMAT)
tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT)

COURSE_ID = '1'
COURSE = require '../../../api/user/courses/1.json'
COURSE_ECOSYSTEM_ID = COURSE.ecosystem_id

VISIBLE_HW = ExtendBasePlan({type: 'homework', is_published: true, exercise_ids: [1]},
  {opens_at: yesterday, due_at: tomorrow, target_id: COURSE.periods[0].id})
UNPUBLISHED_HW = ExtendBasePlan({type: 'homework', exercise_ids: [1]})
NEW_HW = ExtendBasePlan({type: 'homework', id: "_CREATING_1"})

ECO_HOMEWORK = require '../../../api/plans/2.json'
ECO_HOMEWORK_ECOSYSTEM_ID = ECO_HOMEWORK.ecosystem_id

helper = (model) -> PlanRenderHelper(model, HomeworkPlan)

xdescribe 'Homework Plan', ->
  beforeEach ->
    Courses.bootstrap([COURSE], { clear: true })
    TaskPlanActions.reset()

  it 'should allow add exercises when not visible', ->
    helper(UNPUBLISHED_HW).then ({dom}) ->
      expect(dom.querySelector('#problems-select')).to.not.be.null

  xit 'should not allow add exercises after visible', ->
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

  it 'toggles immediate feedback when options are changed', ->
    sinon.spy(TaskPlanActions, 'setImmediateFeedback')
    helper(NEW_HW).then ({dom}) ->
      ReactTestUtils.Simulate.change(dom.querySelector('#feedback-select'), target: {value: 'immediate'})
      expect(TaskPlanActions.setImmediateFeedback).to.have.been.calledWith(NEW_HW.id, true)
