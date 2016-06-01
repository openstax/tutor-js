{expect, utils, Assertion} = require 'chai'

_ = require 'underscore'
ld = require 'lodash'

{ScoresActions, ScoresStore} = require '../../src/flux/scores'

DATA = require '../../api/courses/1/performance.json'
COURSE_ID = 1

COMPLETED_TASK_ID = '1'
PARTIALLY_WORKED_LATE_TASK_ID = '2'
NON_LATE_TASK_ID = '3'
UNWORKED_TASK_ID = '4'


# helper to make specs more concise
gT = ScoresStore.getTaskById

Assertion.addMethod('changedScoreBy', (scoreDiff) ->
  task = ScoresStore.getTaskById(@_obj)
  ScoresActions.acceptLate(@_obj)

  updated = ScoresStore.getTaskById(@_obj)
  if _.isObject(scoreDiff)
    expect(task.score).to.be.closeTo(scoreDiff.from, 0.01,
      "original score should have been #{scoreDiff.from} but was #{task.score}")
    expect(updated.score).to.be.closeTo(scoreDiff.to, 0.01,
      "updated score should have been set to #{scoreDiff.to} but was #{updated.score}")
  else
    expect(updated.score - task.score).to.be.closeTo(scoreDiff, 0.01,
      "expected updated score to change by #{scoreDiff}"
    )
)


describe 'scores store', ->

  beforeEach ->
    ScoresActions.loaded(DATA, COURSE_ID)

  it 'marks late work as accepted', ->
    expect( gT(PARTIALLY_WORKED_LATE_TASK_ID).is_late_work_accepted ).to.be.false
    ScoresActions.acceptLate(PARTIALLY_WORKED_LATE_TASK_ID)
    updated = ScoresStore.getTaskById(PARTIALLY_WORKED_LATE_TASK_ID)
    expect( gT(PARTIALLY_WORKED_LATE_TASK_ID).is_late_work_accepted ).to.be.true


  it 'adjusts average when late work is accepted', ->
    # no changes since there's no late work, should stay same
    expect(NON_LATE_TASK_ID).to.have.changedScoreBy(0)
    expect(UNWORKED_TASK_ID).to.have.changedScoreBy(0)


    # worked 1/3 problems late & got it correct
    expect(PARTIALLY_WORKED_LATE_TASK_ID).to.have.changedScoreBy(from: 0.33, to: 0.67)

    # worked 1/3 problems late & got it wrong
    expect(PARTIALLY_WORKED_LATE_TASK_ID).to.have.changedScoreBy(0)
