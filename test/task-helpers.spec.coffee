{expect} = require 'chai'
_ = require 'underscore'

Helpers = require '../src/helpers/task'

describe 'TaskHelpers', ->

  it 'returns false if task is not late', ->
    lateness = Helpers.getLateness(
      due_at:'2015-07-22T12:00:00.000Z', last_worked_at: '2015-07-21T17:09:44.012Z'
    )
    expect( lateness.is_late ).to.be.false
    expect( lateness.how_late ).to.be.null

  it 'calculates time differences if task is late by a day', ->
    lateness = Helpers.getLateness(
      due_at:'2015-07-22T12:00:00.000Z', last_worked_at: '2015-07-23T12:00:00.000Z'
    )
    expect( lateness.is_late ).to.be.true
    expect( lateness.how_late ).to.equal('a day')

  it 'calculates time differences if task is late by a few minutes', ->
    lateness = Helpers.getLateness(
      due_at:'2015-07-22T12:00:00.000Z', last_worked_at: '2015-07-22T12:30:20.000Z'
    )
    expect( lateness.is_late ).to.be.true
    expect( lateness.how_late ).to.equal('30 minutes')
