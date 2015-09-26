_ = require 'underscore'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{CourseActions, CourseStore} = require '../../../src/flux/course'
{TocActions, TocStore} = require '../../../src/flux/toc'

{HomeworkPlan} = require '../../../src/components/task-plan/homework'

{Testing, sinon, expect, _, React} = require '../helpers/component-testing'
{ExtendBasePlan, PlanRenderHelper} = require '../helpers/task-plan'

yesterday = (new Date(Date.now() - 1000 * 3600 * 24)).toString()

VISIBLE_HW = ExtendBasePlan({type: 'homework', published_at: yesterday, exercise_ids: [1]}, {opens_at: yesterday})
UNPUBLISHED_HW = ExtendBasePlan({type: 'homework', exercise_ids: [1]})
NEW_HW = ExtendBasePlan({type: 'homework', id: "_CREATING_1"})

COURSE_ID = '1'
COURSE = require '../../../api/user/courses/1.json'
COURSE_ECOSYSTEM_ID = COURSE.ecosystem_id

ECO_HOMEWORK = require '../../../api/plans/2.json'
ECO_HOMEWORK_ECOSYSTEM_ID = ECO_HOMEWORK.ecosystem_id

helper = (model) -> PlanRenderHelper(model, HomeworkPlan)

describe 'Homework Plan', ->
  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
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

  it 'should load the course\'s ecosystem_id when new or not specified on the plan', ->
    TocActions.load = sinon.spy()

    helper(NEW_HW).then ({element}) ->
      element.showSectionTopics()
      expect(TocActions.load).to.have.been.calledWith(COURSE_ECOSYSTEM_ID)

  it 'should load the plan\'s specified ecosystem_id', ->
    TocActions.load = sinon.spy()

    helper(ECO_HOMEWORK).then ({element}) ->
      element.showSectionTopics()
      expect(TocActions.load).to.have.been.calledWith(ECO_HOMEWORK_ECOSYSTEM_ID)
