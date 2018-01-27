import { bootstrapCoursesList } from '../../courses-test-data';
import DATA from '../../../api/courses/1/performance.json';
import Courses from '../../../src/models/courses-map';
const COURSE_ID = 2;
import { isObject, find } from 'lodash';
//
// helpers to make specs more concise


// const courseData = () => ScoresStore.get(COURSE_ID)[0];
//

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

  it('adjusts other averages', function() {
    const task = gT(PARTIALLY_WORKED_LATE_TASK_ID);

    expect(parseFloat(task.student.course_average)).toBeCloseTo(0.0512, 5);
    expect(period.data_headings[0].average_score).toBeCloseTo(0.166666, 5);
    expect(parseFloat(period.overall_course_average)).toBeCloseTo(0.16857, 5);
    expect(parseFloat(period.overall_homework_progress)).toBeCloseTo(0.222857, 5);
    expect(parseFloat(period.overall_homework_score)).toBeCloseTo(0.111857, 5);

    expect(task.score).toBeCloseTo(0.5, 5);

    task.onLateWorkAccepted();

    expect(task.score).toBeCloseTo(0.75, 5);

    expect(parseFloat(task.student.course_average)).toBeCloseTo(0.3012, 5);
    expect(period.data_headings[0].average_score).toBeCloseTo(0.19444, 5);
    expect(parseFloat(period.overall_course_average)).toBeCloseTo(0.196349, 5);
    expect(parseFloat(period.overall_homework_progress)).toBeCloseTo(1.778412, 5);
    expect(parseFloat(period.overall_homework_score)).toBeCloseTo(0.13963, 5);
  });

  it('adjusts overall course average', function() {
    expect(parseFloat(period.overall_course_average)).toBeCloseTo(0.16857, 5);
    gT(PARTIALLY_WORKED_LATE_TASK_ID).onLateWorkAccepted();
    gT(ALL_LATE_TASK_ID).onLateWorkAccepted();
    expect(period.overall_course_average).toBeCloseTo(0.224126, 5);
  });

  it('can get task by id', () => {
    const task = Courses.get(COURSE_ID).scores.getTask('17');
    expect(task.id).toEqual(COMPLETED_TASK_ID);
  });

  it('resets properties after a rejection', function() {
    let task = gT(PARTIALLY_WORKED_LATE_TASK_ID);

    task.onLateWorkAccepted();
    expect(task.is_late_work_accepted).toBe(true);
    expect(task.correct_accepted_late_exercise_count ).toEqual( 1 );
    expect(task.completed_accepted_late_exercise_count ).toEqual( 2 );
    expect(task.completed_accepted_late_step_count ).toEqual( 2 );

    expect(period.overall_course_average).toBeCloseTo(0.1963492, 5);

    task.onLateWorkRejected();
    expect(task.is_late_work_accepted).toBe(false);
    expect(task.correct_accepted_late_exercise_count ).toEqual( 0 );
    expect(task.completed_accepted_late_exercise_count ).toEqual( 0 );
    expect(task.completed_accepted_late_step_count ).toEqual( 0 );
    expect(period.overall_course_average).toBeCloseTo(0.16857142, 5);
  });
});
