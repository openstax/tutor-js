import { bootstrapCoursesList } from '../courses-test-data';
import DATA from '../../api/courses/1/performance.json';
import Courses from '../../src/models/courses-map';
const COURSE_ID = 2;

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

    it('can get task by id', () => {
        const task = Courses.get(COURSE_ID).scores.getTask('17');
        expect(task.id).toEqual(COMPLETED_TASK_ID);
    });

});
