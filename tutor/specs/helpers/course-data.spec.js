import CD from '../../src/helpers/course-data';
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

});
