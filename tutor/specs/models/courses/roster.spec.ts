import Course from '../../../src/models/course';
import CourseTeacher from '../../../src/models/course/teacher';
import { Factory } from '../../helpers';

describe('Roster Model', function() {
    let course: Course;

    beforeEach(() => {
        course = Factory.course();
    });

    it('loads active', () => {
        expect(course.roster.teachers).toHaveLength(0);
        Factory.courseRoster({ course });
        expect(course.roster.teachers).toHaveLength(2);
        course.roster.teachers.push({ id: 33, active: false } as any)
        course.roster.teachers.forEach(t => expect(t).toBeInstanceOf(CourseTeacher))
        expect(course.roster.teachers.active.map(t => t.id)).not.toContain(33)
    });

});
