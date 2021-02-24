import CourseUX from '../../../src/models/course/ux';

import { bootstrapCoursesList } from '../../courses-test-data';

describe('Course UX Model', () => {
    let ux;
    beforeEach(() => {
        const courses = bootstrapCoursesList();
        ux = new CourseUX(courses.get(1));
    });

    it('#dataProps', () => {
        expect(ux.dataProps).toEqual({
            'data-appearance': 'testing',
            'data-book-title': 'Testing',
            'data-is-preview': false,
            'data-term': 'Spring 2017',
            'data-title': 'Local Test Course One',
        });
    });

    it('#formattedStudentCost', () => {
        expect(ux.formattedStudentCost).toEqual('$10');
    });
});
