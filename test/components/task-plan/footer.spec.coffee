_ = require 'underscore'
moment = require 'moment'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{TimeActions, TimeStore} = require '../../../src/flux/time'

PlanFooter = require '../../../src/components/task-plan/footer'
{Testing, sinon, expect, _, React} = require '../helpers/component-testing'
{ExtendBasePlan, PlanRenderHelper} = require '../helpers/task-plan'

two_days_ago = (new Date(Date.now() - 1000 * 3600 * 24 * 2)).toString()
yesterday = (new Date(Date.now() - 1000 * 3600 * 24)).toString()
tomorrow = (new Date(Date.now() + 1000 * 3600 * 24)).toString()
dayAfter = (new Date(tomorrow + 1000 * 3600 * 24)).toString()


NEW_READING = ExtendBasePlan({type: 'reading', id: "_CREATING_1"})
UNPUBLISHED_READING = ExtendBasePlan({type: 'reading'})
PUBLISHED_READING = ExtendBasePlan({type: 'reading', published_at: yesterday})
PAST_DUE_PUBLISHED_READING = ExtendBasePlan({type: 'reading', published_at: two_days_ago}, {opens_at: two_days_ago, due_at: yesterday})
VISIBLE_READING = ExtendBasePlan({type: 'reading', published_at: yesterday}, {opens_at: yesterday})
VISIBLE_HW = ExtendBasePlan({type: 'homework', published_at: yesterday}, {opens_at: yesterday})

NEW_HW = ExtendBasePlan({type: 'homework', id: "_CREATING_1"})
HW_WITH_EXERCISES = ({
  type: 'homework',
  settings: {
    exercise_ids: ['1']
  }
})


# Stub the function, TODO - bring in helper
getBackToCalendarParams = ->
  to: 'calendarByDate'
  params:
    date: moment(TimeStore.getNow()).format('YYYY-MM-DD')

helper = (model) -> PlanRenderHelper(model, PlanFooter, {getBackToCalendarParams})

describe 'Task Plan Footer', ->
  beforeEach ->
    TaskPlanActions.reset()

  it 'should have correct buttons when reading is new', ->
    helper(NEW_READING).then ({dom}) ->
      expect(dom.querySelector('.delete-link')).to.be.null
      expect(dom.querySelector('.-save')).to.not.be.null
      expect(dom.querySelector('.-publish')).to.not.be.null

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

  it 'should have correct buttons when reading is visible', ->
    helper(VISIBLE_READING).then ({dom}) ->
      expect(dom.querySelector('.delete-link')).to.be.null
      expect(dom.querySelector('.-save')).to.be.null
      expect(dom.querySelector('.-publish')).to.not.be.null

  it 'should have correct buttons when reading is past due', ->
    helper(PAST_DUE_PUBLISHED_READING).then ({dom}) ->
      expect(dom.querySelector('.delete-link')).to.be.null
      expect(dom.querySelector('.-save')).to.be.null
      expect(dom.querySelector('.-publish')).to.be.null
