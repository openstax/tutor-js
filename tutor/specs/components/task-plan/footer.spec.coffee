_ = require 'underscore'
moment = require 'moment'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{TimeActions, TimeStore} = require '../../../src/flux/time'

PlanFooter = require '../../../src/components/task-plan/footer'
{Testing, sinon, _, React} = require '../helpers/component-testing'
{ExtendBasePlan, PlanRenderHelper} = require '../helpers/task-plan'

ISO_DATE_FORMAT = 'YYYY-MM-DD'

twoDaysBefore = moment(TimeStore.getNow()).subtract(2, 'days').format(ISO_DATE_FORMAT)
yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(ISO_DATE_FORMAT)
tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(ISO_DATE_FORMAT)
dayAfter = moment(TimeStore.getNow()).add(2, 'day').format(ISO_DATE_FORMAT)

NEW_READING = ExtendBasePlan({type: 'reading', id: "_CREATING_1"})
UNPUBLISHED_READING = ExtendBasePlan({type: 'reading', is_published: false, is_publishing: false})
PUBLISHED_READING = ExtendBasePlan({type: 'reading', published_at: yesterday, is_published: true, is_publishing: false})
PAST_DUE_PUBLISHED_READING = ExtendBasePlan(
  {type: 'reading', published_at: twoDaysBefore, is_published: true, is_publishing: false},
  {opens_at: twoDaysBefore, due_at: yesterday}
)
VISIBLE_READING = ExtendBasePlan(
  {type: 'reading', is_published: true, is_publishing: false, published_at: yesterday},
  {opens_at: yesterday}
)
VISIBLE_HW = ExtendBasePlan(
  {type: 'homework', is_published: true, is_publishing: false, published_at: yesterday},
  {opens_at: yesterday}
)

NEW_HW = ExtendBasePlan({type: 'homework', id: "_CREATING_1"})
HW_WITH_EXERCISES = ({
  type: 'homework',
  is_published: true, is_publishing: false,
  settings: {
    exercise_ids: ['1']
  }
})


# Stub the function, TODO - bring in helper
getBackToCalendarParams = ->
  to: 'calendarByDate'
  params:
    date: moment(TimeStore.getNow()).format('YYYY-MM-DD')


helper = (model) -> PlanRenderHelper(model, PlanFooter,
  {
    getBackToCalendarParams,
    onCancel: sinon.spy(),
    onPublish: sinon.spy(),
    goBackToCalendar: sinon.spy(),
    isValid: true,
    hasError: false
  }
)

describe 'Task Plan Footer', ->
  beforeEach ->
    TaskPlanActions.reset()

  it 'should have correct buttons when reading is new', ->
    helper(NEW_READING).then ({dom}) ->
      expect(dom.querySelector('.delete-link')).to.be.null
      expect(dom.querySelector('.-save')).to.not.be.null
      expect(dom.querySelector('.-publish')).to.not.be.null
      expect(dom.querySelector('.-publish').textContent).to.equal('Publish')

  it 'should have correct buttons when reading is unpublished', ->
    helper(UNPUBLISHED_READING).then ({dom}) ->
      expect(dom.querySelector('.delete-link')).to.not.be.null
      expect(dom.querySelector('.-save')).to.not.be.null
      expect(dom.querySelector('.-publish')).to.not.be.null

  it 'should have correct buttons when reading is published', ->
    helper(PUBLISHED_READING).then ({dom}) ->
      expect(dom.querySelector('.delete-link')).to.not.be.null
      expect(dom.querySelector('.-save')).to.be.null
      expect(dom.querySelector('.-publish')).to.not.be.null
      expect(dom.querySelector('.-publish').textContent).to.equal('Save')

  it 'should have correct buttons when reading is visible', ->
    helper(VISIBLE_READING).then ({dom}) ->
      expect(dom.querySelector('.delete-link')).to.not.be.null
      expect(dom.querySelector('.-save')).to.be.null
      expect(dom.querySelector('.-publish')).to.not.be.null

  it 'should have correct buttons when reading is past due', ->
    helper(PAST_DUE_PUBLISHED_READING).then ({dom}) ->
      expect(dom.querySelector('.delete-link')).to.not.be.null
      expect(dom.querySelector('.-save')).to.be.null
      expect(dom.querySelector('.-publish')).to.not.be.null

  it 'should have help tooltip', ->
    helper(PUBLISHED_READING).then ({dom}) ->
      expect(dom.querySelector('.footer-instructions')).to.not.be.null
