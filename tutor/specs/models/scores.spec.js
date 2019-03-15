import { bootstrapCoursesList } from '../courses-test-data';
import { isObject } from 'lodash';
import DATA from '../../api/courses/1/performance.json';
import Courses from '../../src/models/courses-map';
const COURSE_ID = 2;

// helpers to make specs more concise
const gT = id => {
  return Courses.get(COURSE_ID).scores.getTask(id);
};

const acceptTask = (id) => {
  const task = gT(id);
  task.onLateWorkAccepted();
  return task;
};

const testChangedScoreBy = (taskId, scoreDiff) => {
  const task = gT(taskId);
  const updated = acceptTask(taskId);
  if (isObject(scoreDiff)) {
    expect(parseFloat(task.score)).toBeCloseTo(parseFloat(scoreDiff.from), 0.01,
      `original score should have been ${scoreDiff.from} but was ${task.score}`);
    expect(parseFloat(updated.score)).toBeCloseTo(parseFloat(scoreDiff.to), 0.01,
      `updated score should have been set to ${scoreDiff.to} but was ${updated.score}`);
  } else {
    expect(parseFloat(updated.score) - parseFloat(task.score)).toBeCloseTo(parseFloat(scoreDiff), 0.01,
      `expected updated score to change by ${scoreDiff}`
    );
  }
};


// Rabbit's completed all assignments on time
const COMPLETED_TASK_ID = 17;

// Seymour Glass worked some questions on time, and the rest late
const PARTIALLY_WORKED_LATE_TASK_ID = 18;

// Bettie Hacket worked some problems late, but non on-time
const ALL_LATE_TASK_ID = 12;

// Albin hasn't perfomed any work
const UNWORKED_TASK_ID = 10;

describe('scores store', function() {
  let scores;
  let course;

  beforeEach(() => {
    course = bootstrapCoursesList().get(COURSE_ID);
    scores = course.scores;
    scores.onFetchComplete({ data: DATA });
  });

  it('marks late work as accepted', function() {
    const task = gT(PARTIALLY_WORKED_LATE_TASK_ID);
    expect(task.unacceptedLateStepCount).toEqual(2);
    expect( task.is_late_work_accepted ).toBe(false);
    task.onLateWorkAccepted();
    expect( task.is_late_work_accepted ).toBe(true);
    return undefined;
  });

  it('moves counts into accepted', function() {
    // no changes
    expect( acceptTask(UNWORKED_TASK_ID).completed_accepted_late_exercise_count ).toEqual(0);
    expect( acceptTask(UNWORKED_TASK_ID).correct_accepted_late_exercise_count ).toEqual(0);

    expect( acceptTask(PARTIALLY_WORKED_LATE_TASK_ID).completed_accepted_late_exercise_count ).toEqual(4);
    expect( acceptTask(PARTIALLY_WORKED_LATE_TASK_ID).correct_accepted_late_exercise_count ).toEqual(3);
    expect( acceptTask(ALL_LATE_TASK_ID ).completed_accepted_late_exercise_count ).toEqual(2);
    expect( acceptTask(ALL_LATE_TASK_ID ).correct_accepted_late_exercise_count ).toEqual(1);
  });

  it('adjusts average when late work is accepted', function() {
    // no changes since there's no late work, should stay same
    testChangedScoreBy(COMPLETED_TASK_ID, 0);
    testChangedScoreBy(UNWORKED_TASK_ID, 0);

    // had 2/4 correct, worked another one & got it correct
    testChangedScoreBy(PARTIALLY_WORKED_LATE_TASK_ID, { from: 0.5, to: 0.75 });

    // worked non on-time, 2 late & got only 1 correct
    testChangedScoreBy(ALL_LATE_TASK_ID, { from: 0, to: 0.25 });
  });

  it('can get task by id', () => {
    const task = Courses.get(COURSE_ID).scores.getTask('17');
    expect(task.id).toEqual(COMPLETED_TASK_ID);
  });

});
