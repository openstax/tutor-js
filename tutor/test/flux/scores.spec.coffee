{expect, utils, Assertion} = require 'chai'

_ = require 'underscore'
ld = require 'lodash'

{ScoresActions, ScoresStore} = require '../../src/flux/scores'

DATA = require '../../api/courses/1/performance.json'
COURSE_ID = 1


# helpers to make specs more concise
gT = (id) -> ScoresStore.getTaskInfoById(id).task
acceptTask = (id) ->
  ScoresActions.acceptLate(id)
  gT(id)

courseData = ->
  ScoresStore.get(COURSE_ID)[0]

Assertion.addMethod('changedScoreBy', (scoreDiff) ->
  task = gT(@_obj)
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


  it 'adjusts other averages', ->
    expect(courseData().data_headings[0].average_score).to.be.closeTo(0.1666, 0.0001)
    expect(courseData().students[2].average_score).to.be.closeTo(0.5, 0.001)
    expect(courseData().overall_average_score).to.be.closeTo(0.16666, 0.001)

    ScoresActions.acceptLate(PARTIALLY_WORKED_LATE_TASK_ID)

    expect(courseData().data_headings[0].average_score).to.be.closeTo(0.1944, 0.0001)
    expect(courseData().students[2].average_score).to.be.closeTo(0.625, 0.001)
    expect(courseData().overall_average_score).to.be.closeTo(0.1944, 0.001)

  it 'adjusts overal course average', ->
    expect(courseData().overall_average_score).closeTo(0.1666, 0.0001)
    ScoresActions.acceptLate(PARTIALLY_WORKED_LATE_TASK_ID)
    ScoresActions.acceptLate(ALL_LATE_TASK_ID)
    expect(courseData().overall_average_score).closeTo(0.2222, 0.0001)

  it 'resets properties after a rejection', ->
    ScoresActions.acceptLate(PARTIALLY_WORKED_LATE_TASK_ID)
    task = gT(PARTIALLY_WORKED_LATE_TASK_ID)

    expect(task.is_late_work_accepted).to.be.true
    expect(task.correct_accepted_late_exercise_count ).to.equal( 1 )
    expect(task.completed_accepted_late_exercise_count ).to.equal( 2 )
    expect(task.completed_accepted_late_step_count ).to.equal( 2 )
    expect(task.accepted_late_at ).to.exist
    expect(courseData().overall_average_score).closeTo(0.1944, 0.0001)


    ScoresActions.rejectLate(PARTIALLY_WORKED_LATE_TASK_ID)

    task = gT(PARTIALLY_WORKED_LATE_TASK_ID)
    expect(task.is_late_work_accepted).to.be.false
    expect(task.correct_accepted_late_exercise_count ).to.equal( 0 )
    expect(task.completed_accepted_late_exercise_count ).to.equal( 0 )
    expect(task.completed_accepted_late_step_count ).to.equal( 0 )
    expect(task.accepted_late_at ).not.to.exist
    expect(courseData().overall_average_score).closeTo(0.1666, 0.0001)
