{expect} = require 'chai'

React = require 'react'
_ = require 'underscore'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
PlanFooter = require '../../../src/components/task-plan/footer'

yesterday = (new Date(Date.now() - 1000 * 3600 * 24)).toString()
tomorrow = (new Date(Date.now() + 1000 * 3600 * 24)).toString()
dayAfter = (new Date(tomorrow + 1000 * 3600 * 24)).toString()


extendBasePlan = (props) ->
  baseModel =
    id: '111'
    title: 'Test Title'
    opens_at: tomorrow
    due_at: dayAfter
    settings:
      page_ids: ['1']

  _.extend({}, baseModel, props)

NEW_READING = extendBasePlan({type: 'reading', id: "_CREATING_1"})
UNPUBLISHED_READING = extendBasePlan({type: 'reading'})
PUBLISHED_READING = extendBasePlan({type: 'reading', published_at: yesterday})
VISIBLE_READING = extendBasePlan({type: 'reading', published_at: yesterday, opens_at: yesterday})

NEW_HW = extendBasePlan({type: 'homework', id: "_CREATING_1"})
HW_WITH_EXERCISES = ({
  type: 'homework',
  settings: {
    exercise_ids: ['1']
  }
})
VISIBLE_HW = extendBasePlan({
  type: 'homework',
  published_at: yesterday,
  opens_at: yesterday
})

helper = (model) ->
  {id} = model
  # Load the plan into the store
  TaskPlanActions.loaded(model, id)
  html = React.renderToString(<PlanFooter id={id} />)
  div = document.createElement('div')
  div.innerHTML = html
  div


describe 'Task Plan Footer', ->
  beforeEach ->
    TaskPlanActions.reset()

  it 'should have correct buttons when reading is new', ->
    node = helper(NEW_READING)

    expect(node.querySelector('.delete-link')).to.be.null
    expect(node.querySelector('.-save')).to.not.be.null
    expect(node.querySelector('.-publish')).to.not.be.null
    expect(node.querySelector('.-select-problems')).to.be.null

  it 'should have correct buttons when reading is unpublished', ->
    node = helper(UNPUBLISHED_READING)
    expect(node.querySelector('.delete-link')).to.not.be.null
    expect(node.querySelector('.-save')).to.not.be.null
    expect(node.querySelector('.-publish')).to.not.be.null
    expect(node.querySelector('.-select-problems')).to.be.null

  it 'should have correct buttons when reading is published', ->
    node = helper(PUBLISHED_READING)
    expect(node.querySelector('.delete-link')).to.not.be.null
    expect(node.querySelector('.-save')).to.be.null
    expect(node.querySelector('.-publish')).to.not.be.null
    expect(node.querySelector('.-select-problems')).to.be.null

  it 'should have correct buttons when reading is visible', ->
    node = helper(VISIBLE_READING)

    expect(node.querySelector('.delete-link')).to.be.null
    expect(node.querySelector('.-save')).to.be.null
    expect(node.querySelector('.-publish')).to.not.be.null
    expect(node.querySelector('.-select-problems')).to.be.null

  it 'should only show select problems when homework is new', ->
    node = helper(NEW_HW)

    expect(node.querySelector('.delete-link')).to.be.null
    expect(node.querySelector('.-save')).to.be.null
    expect(node.querySelector('.-publish')).to.be.null
    expect(node.querySelector('.-select-problems')).to.not.be.null

  it 'should not show select problems when homework has exercises', ->
    node = helper(HW_WITH_EXERCISES)
    expect(node.querySelector('.-select-problems')).to.be.null

  it 'should not show select problems when homework is visible', ->
    node = helper(VISIBLE_HW)
    expect(node.querySelector('.-select-problems')).to.be.null


