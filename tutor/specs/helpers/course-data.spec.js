import CD from '../../src/helpers/course-data';

import mapValues from 'lodash/mapValues';
import TimeHelper from '../../src/helpers/time';
import Courses from '../../src/models/courses-map';

import COURSE from '../../api/courses/1.json';
const COURSE_ID = '1';

describe('Course Data helpers', function() {

  it('getCourseDataProps', function() {
    const cd = Courses.bootstrap([COURSE], { clear: true });
    expect(cd.get(COURSE_ID)).not.toBeUndefined();
    return expect(CD.getCourseDataProps(COURSE_ID)).toEqual(
      { 'data-appearance': 'biology', 'data-book-title': 'Biology', 'data-title': 'Local Test Course' }
    );
  });

  return it('getCourseBounds', function() {
    Courses.bootstrap([COURSE], { clear: true });
    const bounds = CD.getCourseBounds(COURSE_ID);
    expect(bounds.start).toEqual(
      TimeHelper.getMomentPreserveDate(COURSE.starts_at, TimeHelper.ISO_DATE_FORMAT)
    );
    return expect(bounds.end).toEqual(
      TimeHelper.getMomentPreserveDate(COURSE.ends_at, TimeHelper.ISO_DATE_FORMAT)
    );
  });
});
