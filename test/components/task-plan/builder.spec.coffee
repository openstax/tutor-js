_ = require 'underscore'
moment = require 'moment'

Builder = require '../../../src/components/task-plan/builder'
{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{Testing, sinon, expect, _, React} = require '../helpers/component-testing'
{ExtendBasePlan, PlanRenderHelper} = require '../helpers/task-plan'

{CourseListingActions, CourseListingStore} = require '../../../src/flux/course-listing'
{CourseStore} = require '../../../src/flux/course'
{TimeStore} = require '../../../src/flux/time'
TutorDateFormat = TimeStore.getFormat()

yesterday = (new Date(Date.now() - 1000 * 3600 * 24)).toString()
tomorrow = (new Date(Date.now() + 1000 * 3600 * 24)).toString()
dayAfter = (new Date(Date.now() + 1000 * 3600 * 48)).toString()

getDateString = (value) -> moment(value).format(TutorDateFormat)

COURSES = require '../../../api/user/courses.json'
NEW_READING = ExtendBasePlan({id: "_CREATING_1", settings: {page_ids: []}})
PUBLISHED_MODEL = ExtendBasePlan({
  id: '1'
  title: 'hello',
  description: 'description',
  published_at: yesterday}, {opens_at: yesterday, due_at: yesterday, target_id: COURSES[0].periods[0].id})

helper = (model) -> PlanRenderHelper(model, Builder)


describe 'Task Plan Builder', ->
  beforeEach ->
    TaskPlanActions.reset()
    CourseListingActions.loaded(COURSES)

  it 'should load expected plan', ->
    helper(PUBLISHED_MODEL).then ({dom}) ->
      expect(dom.querySelector('#reading-title').value).to.equal(PUBLISHED_MODEL.title)
      descriptionValue = dom.querySelector('.assignment-description textarea').value
      expect(descriptionValue).to.equal(PUBLISHED_MODEL.description)

  it 'should allow editable periods radio if plan is not visible', ->
    helper(NEW_READING).then ({dom}) ->
      expect(dom.querySelector('#show-periods-radio')).to.not.be.null
      expect(dom.querySelector('#hide-periods-radio')).to.not.be.null
 
  it 'should not allow editable periods radio if plan is visible', ->
    helper(PUBLISHED_MODEL).then ({dom, element}) ->
      expect(dom.querySelector('#show-periods-radio')).to.be.null
      expect(dom.querySelector('#hide-periods-radio')).to.be.null
      expect(element.state.isVisibleToStudents).to.be.true

  it 'should not allow editable open date if plan is visible', ->
    helper(PUBLISHED_MODEL).then ({dom, element}) ->
      element.setAllPeriods()
      expect(element.refs.openDate.props.disabled).to.be.true


  it 'hides periods by default', ->
    helper(NEW_READING).then ({dom, element}) ->
      expect(dom.querySelector('.tasking-plan.tutor-date-input')).to.be.null

  it 'can show individual periods', ->
    helper(NEW_READING).then ({dom, element}) ->
      element.setIndividualPeriods()
      expect(dom.querySelectorAll('.tasking-plan.tutor-date-input').length).to.equal(COURSES[0].periods.length)

  it 'does not load a default due at for all periods', ->
    helper(NEW_READING).then ({dom, element}) ->
      element.setIndividualPeriods()
      element.setAllPeriods()
      dueAt = TaskPlanStore.getDueAt(NEW_READING.id)
      expect(dueAt).to.be.falsy

  it 'can update open date with date obj', ->
    helper(NEW_READING).then ({dom, element}) ->
      element.setOpensAt(new Date(dayAfter))
      opensAt = TaskPlanStore.getOpensAt(NEW_READING.id)
      expect(getDateString(opensAt)).to.be.equal(getDateString(dayAfter))

  it 'can update open date with string', ->
    helper(NEW_READING).then ({dom, element}) ->
      element.setDueAt(getDateString(tomorrow))
      opensAt = TaskPlanStore.getOpensAt(NEW_READING.id)
      expect(getDateString(opensAt)).to.be.equal(getDateString(tomorrow))

  it 'can update due date with date obj', ->
    helper(NEW_READING).then ({dom, element}) ->
      element.setDueAt(new Date(dayAfter))
      dueAt = TaskPlanStore.getDueAt(NEW_READING.id)
      expect(getDateString(dueAt)).to.be.equal(getDateString(dayAfter))

  it 'can update due date with string', ->
    helper(NEW_READING).then ({dom, element}) ->
      element.setDueAt(getDateString(tomorrow))
      dueAt = TaskPlanStore.getDueAt(NEW_READING.id)
      expect(getDateString(dueAt)).to.be.equal(getDateString(tomorrow))

  it 'can update open date for individual period', ->
    periodId = COURSES[0].periods[0].id
    helper(NEW_READING).then ({dom, element}) ->
      element.setOpensAt(new Date(dayAfter))
      opensAt = TaskPlanStore.getOpensAt(NEW_READING.id)
      expect(getDateString(opensAt)).to.be.falsy
      opensAt = TaskPlanStore.getOpensAt(NEW_READING.id, periodId)
      expect(getDateString(opensAt)).to.be.equal(getDateString(dayAfter))

  it 'can update due date for individual period', ->
    periodId = COURSES[0].periods[0].id
    helper(NEW_READING).then ({dom, element}) ->
      element.setDueAt(new Date(tomorrow))
      dueAt = TaskPlanStore.getDueAt(NEW_READING.id)
      expect(getDateString(dueAt)).to.be.falsy
      dueAt = TaskPlanStore.getDueAt(NEW_READING.id, periodId)
      expect(getDateString(dueAt)).to.be.equal(getDateString(tomorrow))

