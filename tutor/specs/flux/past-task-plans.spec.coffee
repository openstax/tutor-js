map = require 'lodash/map'

PLANS  = require '../../api/courses/1/plans.json'
{PastTaskPlansActions, PastTaskPlansStore} = require '../../src/flux/past-task-plans'

COURSE_ID = '1'

describe 'Past Task Plans store', ->

  beforeEach ->
    PastTaskPlansActions.loaded(PLANS, COURSE_ID)


  it 'can retrive plans by due date', ->
    expect(map(PastTaskPlansStore.byDueDate(COURSE_ID), 'due_at')).to.deep.equal([
      '2015-03-10T04:00:00.000Z',
      '2015-03-01T04:00:00.000Z',
      '2015-03-18T04:00:00.000Z',
      '2015-04-01T04:00:00.000Z',
      '2015-04-05T04:00:00.000Z',
      '2015-10-14T12:00:00.000Z'
    ])
    undefined


  it 'checks for plan existance', ->
    expect(PastTaskPlansStore.hasPlans(COURSE_ID)).to.be.true
    expect(PastTaskPlansStore.hasPlans('99')).to.be.false
    undefined
