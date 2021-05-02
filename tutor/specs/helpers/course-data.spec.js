import CD from '../../src/helpers/course-data';
import { Factory } from '../helpers'
import { currentCourses } from '../../src/models'
jest.mock('../../src/models/courses-map')

const COURSE_ID = 1234

describe('Course Data helpers', function() {

    it('getCourseDataProps', function() {
        const course = Factory.course({ id: COURSE_ID })
        currentCourses.get.mockImplementation(() => course);

        return expect(CD.getCourseDataProps(COURSE_ID)).toEqual({
            'data-appearance': course.appearance_code,
            'data-book-title': course.bookName,
            'data-title': course.name,
        });
    });

});
