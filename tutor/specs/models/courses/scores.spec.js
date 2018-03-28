import { bootstrapCoursesList } from '../../courses-test-data';
import { isObject, find, map } from 'lodash';
import DATA from '../../../api/courses/1/performance.json';
import Courses from '../../../src/models/courses-map';
const COURSE_ID = 2;
//
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
    expect(task.score).toBeCloseTo(scoreDiff.from, 0.01,
                                   `original score should have been ${scoreDiff.from} but was ${task.score}`);
    expect(updated.score).toBeCloseTo(scoreDiff.to, 0.01,
                                      `updated score should have been set to ${scoreDiff.to} but was ${updated.score}`);
  } else {
    expect(updated.score - task.score).toBeCloseTo(scoreDiff, 0.01,
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
  let period;

  beforeEach(() => {
    course = bootstrapCoursesList().get(COURSE_ID);
    scores = course.scores;
    scores.onFetchComplete({ data: DATA });
    period = course.scores.periods.get('1');
  });

  it('marks late work as accepted', function() {
    const task = gT(PARTIALLY_WORKED_LATE_TASK_ID);
    expect(task.lateStepCount).toEqual(2);
    expect( task.is_late_work_accepted ).toBe(false);
    task.onLateWorkAccepted();
    expect( task.is_late_work_accepted ).toBe(true);
    return undefined;
  });

  it('moves counts into accepted', function() {
    // no changes
    expect( acceptTask(UNWORKED_TASK_ID).completed_accepted_late_exercise_count ).toEqual(0);
    expect( acceptTask(UNWORKED_TASK_ID).correct_accepted_late_exercise_count ).toEqual(0);

    expect( acceptTask(PARTIALLY_WORKED_LATE_TASK_ID).completed_accepted_late_exercise_count ).toEqual(2);
    expect( acceptTask(PARTIALLY_WORKED_LATE_TASK_ID).correct_accepted_late_exercise_count ).toEqual(1);
    expect( acceptTask(ALL_LATE_TASK_ID ).completed_accepted_late_exercise_count ).toEqual(2);
    expect( acceptTask(ALL_LATE_TASK_ID ).correct_accepted_late_exercise_count ).toEqual(0);
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

  it('calculates scored counts', function() {
    expect(period.students[0].scoredStepCount).toMatchObject({
      external: 1, homework: 4, reading: 29,
    });
    expect(period.scoredStepCount).toMatchObject({
      external: 1, homework: 36, reading: 261,
    });
    expect(map(period.data_headings, 'scoredStepCount')).toEqual([
      36, 0, 1,
    ]);
  });


});
