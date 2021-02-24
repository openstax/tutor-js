import Courses from '../models/courses-map';
import Router from '../helpers/router';

export default {
    getCourseDataProps(courseId = Router.currentParams()) {
        const course = Courses.get(courseId);
        return {
            'data-title': course.name,
            'data-book-title': course.bookName || '',
            'data-appearance': course.appearance_code,
        };
    },

};
