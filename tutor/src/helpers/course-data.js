import Courses from '../models/courses-map';

import Router from '../helpers/router';
import TimeHelper from '../helpers/time';

export default {
  getCourseDataProps(courseId) {
    let dataProps;
    if (courseId == null) {
      ((((((({ courseId } = Router.currentParams())))))));
    }
    const course = Courses.get(courseId);
    return dataProps = {
      'data-title': course.name,
      'data-book-title': course.bookName || '',
      'data-appearance': course.appearance_code,
    };
  },

  getCourseBounds(courseId) {
    const course = Courses.get(courseId);

    const start = TimeHelper.getMomentPreserveDate(course.starts_at, TimeHelper.ISO_DATE_FORMAT);
    const end = TimeHelper.getMomentPreserveDate(course.ends_at, TimeHelper.ISO_DATE_FORMAT);

    return { start, end };
  },
};
