{expect, utils, Assertion} = require 'chai'

_ = require 'underscore'
ld = require 'lodash'

{ScoresActions, ScoresStore} = require '../../src/flux/scores'

DATA = require '../../api/courses/1/performance.json'
COURSE_ID = 1


# helpers to make specs more concise
gT = ScoresStore.getTaskById
acceptTask = (id) ->
  ScoresActions.acceptLate(id)
  gT(id)


Assertion.addMethod('changedScoreBy', (scoreDiff) ->
  task = ScoresStore.getTaskById(@_obj)
  updated = acceptTask(@_obj)
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


# Rabbit's completed all assignments on time
COMPLETED_TASK_ID = '17'

# Seymour Glass worked some questions on time, and the rest late
PARTIALLY_WORKED_LATE_TASK_ID = '18'

# Bettie Hacket worked some problems late, but non on-time
ALL_LATE_TASK_ID = '12'

# Albin hasn't perfomed any work
UNWORKED_TASK_ID = '10'

describe 'scores store', ->

  beforeEach ->
    ScoresActions.loaded(DATA, COURSE_ID)

  it 'marks late work as accepted', ->
    expect( gT(PARTIALLY_WORKED_LATE_TASK_ID).is_late_work_accepted ).to.be.false
    ScoresActions.acceptLate(PARTIALLY_WORKED_LATE_TASK_ID)
    updated = ScoresStore.getTaskById(PARTIALLY_WORKED_LATE_TASK_ID)
    expect( gT(PARTIALLY_WORKED_LATE_TASK_ID).is_late_work_accepted ).to.be.true

  it 'moves counts into accepted', ->
    # no changes
    expect( acceptTask(UNWORKED_TASK_ID).completed_accepted_late_exercise_count ).to.equal(0)
    expect( acceptTask(UNWORKED_TASK_ID).correct_accepted_late_exercise_count ).to.equal(0)

    expect( acceptTask(PARTIALLY_WORKED_LATE_TASK_ID).completed_accepted_late_exercise_count ).to.equal(2)
    expect( acceptTask(PARTIALLY_WORKED_LATE_TASK_ID).correct_accepted_late_exercise_count ).to.equal(1)

    expect( acceptTask(ALL_LATE_TASK_ID ).completed_accepted_late_exercise_count ).to.equal(2)
    expect( acceptTask(ALL_LATE_TASK_ID ).correct_accepted_late_exercise_count ).to.equal(1)



  it 'adjusts average when late work is accepted', ->
    # no changes since there's no late work, should stay same
    expect(COMPLETED_TASK_ID).to.have.changedScoreBy(0)
    expect(UNWORKED_TASK_ID).to.have.changedScoreBy(0)

    # had 2/4 correct, worked another one & got it correct
    expect(PARTIALLY_WORKED_LATE_TASK_ID).to.have.changedScoreBy(from: 0.5, to: 0.75)

    # worked non on-time, 2 late & got only 1 correct
    expect(ALL_LATE_TASK_ID).to.have.changedScoreBy(from: 0, to: 0.25)
