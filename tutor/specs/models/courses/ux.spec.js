import createUXForCourse from '../../../src/models/course/ux';

import BasicCourseUX from '../../../src/models/course/basic-ux';
import CoursePreviewUX from '../../../src/models/course/preview-ux';


describe('Basic Course UX Model', () => {


  it('returns either preview or basic', () => {
    expect(
      createUXForCourse({ is_preview: true })
    ).toBeInstanceOf(CoursePreviewUX);
    expect(
      createUXForCourse({ is_preview: true })
    ).toBeInstanceOf(BasicCourseUX);
  });

});
