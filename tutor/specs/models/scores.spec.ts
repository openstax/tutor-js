import { bootstrapCoursesList } from '../courses-test-data';
import DATA from '../../api/courses/1/performance.json';
import { currentCourses, Course } from '../../src/models'
const COURSE_ID = 2;

// Rabbit's completed all assignments on time
const COMPLETED_TASK_ID = 17;

describe('scores store', function() {
    let scores;
    let course:Course;

    beforeEach(() => {
        course = bootstrapCoursesList().get(COURSE_ID)!;
        scores = course.scores;
        scores.onFetchComplete(DATA as any)
    });

    it('can get task by id', () => {
        const task = currentCourses.get(COURSE_ID)!.scores.getTask(17)!
        expect(task.id).toEqual(COMPLETED_TASK_ID);
    });

});
