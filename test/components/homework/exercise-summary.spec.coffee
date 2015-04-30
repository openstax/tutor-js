{expect} = require 'chai'
React = require 'react'
_ = require 'underscore'

{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
ExerciseSummary = require '../../../src/components/task-plan/homework/exercise-summary'

VALID_MODEL = require '../../../api/plans/2.json'

helper = (props) ->
  html = React.renderToString(<ExerciseSummary {...props} />)
  div = document.createElement('div')
  div.innerHTML = html
  div

newProps = defaultProps =
  planId: VALID_MODEL.id
  canAdd: true
  canReview: true
  addClicked: React.PropTypes.func
  reviewClicked: React.PropTypes.func


describe 'Homework - Exercise Summary', ->
  beforeEach ->
    TaskPlanActions.loaded(VALID_MODEL, VALID_MODEL.id)
    newProps = _.mapObject(defaultProps)
    newProps = _.extend(defaultProps, {})

  afterEach ->
    TaskPlanActions.reset()

  it 'can render correct amount of exercises', ->
    node = helper(newProps)
    selected = VALID_MODEL.settings.exercise_ids.length
    dynamic = VALID_MODEL.settings.exercises_count_dynamic
    total = selected + dynamic

    expect(node.querySelector('.total h2').innerHTML).to.be.equal(total.toString())
    expect(node.querySelector('.num-selected h2').innerHTML).to.be.equal(selected.toString())

  it 'should show add button if prop.canAdd is true', ->
    newProps.canAdd = true
    newProps.canReview = false

    node = helper(newProps)
    expect(node.querySelector('.-add-exercises')).to.not.be.null

  it 'should show review button if prop.canReview is true', ->
    newProps.canAdd = false
    newProps.canReview = true

    node = helper(newProps)
    expect(node.querySelector('.-review-exercises')).to.not.be.null
