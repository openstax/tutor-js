_ = require 'underscore'
moment = require 'moment-timezone'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{default: Courses} = require '../../../src/models/courses-map'

{TimeStore} = require '../../../src/flux/time'
TimeHelper = require '../../../src/helpers/time'

{ReadingPlan} = require '../../../src/components/task-plan/reading'
{default: Factory} = require '../../factories'
{Testing, sinon, _, React} = require '../helpers/component-testing'
{ExtendBasePlan, PlanRenderHelper} = require '../helpers/task-plan'

yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(TimeHelper.ISO_DATE_FORMAT)
tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT)

# COURSE_ID = '1'
# COURSE = require '../../../api/user/courses/1.json'
# COURSE_ECOSYSTEM_ID = COURSE.ecosystem_id


helper = (model) -> PlanRenderHelper(model, ReadingPlan)

xdescribe 'Reading Plan', ->
  VISIBLE_READING = UNPUBLISHED_READING = NEW_READING = ECO_READING = ECO_READING_ECOSYSTEM_ID = props = null

  beforeEach ->
    console.log(Factory)
    course = Factory.course()
    course.referenceBook.onApiRequestComplete({ data: [Factory.data('Book')] })

    VISIBLE_READING = ExtendBasePlan({is_published: true},
      {opens_at: yesterday, due_at: tomorrow, target_id: course.periods[0].id})
    UNPUBLISHED_READING = ExtendBasePlan({
      page_ids: [ course.referenceBook.pages.byId.keys()[1] ],
    })
    NEW_READING = ExtendBasePlan({id: "_CREATING_1", settings: {page_ids: []}})

    Courses.set(course.id, course)
    TaskPlanActions.reset()
    props = {}

  it 'should allow add sections when not visible', ->
    helper(UNPUBLISHED_READING).then ({dom}) ->
      expect(dom.querySelector('#reading-select')).to.not.be.null

  xit 'should not allow add sections after visible', ->
    helper(VISIBLE_READING).then ({dom}) ->
      expect(dom.querySelector('#reading-select')).to.be.null

  xit 'should show sections required message when saving and no sections', ->
    helper(NEW_READING).then ({dom}) ->
      expect(dom.querySelector('.readings-required')).to.be.null
      Testing.actions.click(dom.querySelector('.-save'))
      expect(dom.querySelector('.readings-required')).to.not.be.null

  xit 'can mark form as invalid', ->
    helper(NEW_READING).then ({dom}) ->
      expect(dom.querySelector('.edit-reading.is-invalid-form')).to.be.null
      Testing.actions.click(dom.querySelector('.-save'))
      expect(dom.querySelector('.edit-reading.is-invalid-form')).to.not.be.null

  xit 'hides form when selecting sections', ->
    helper(NEW_READING).then ({dom}) ->
      expect(dom.querySelector('.edit-reading.hide')).to.be.null
      Testing.actions.click(dom.querySelector('#reading-select'))
      expect(dom.querySelector('.edit-reading.hide')).to.not.be.null
