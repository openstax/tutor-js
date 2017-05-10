import {
  computed, observable,
} from 'mobx';

import BasicCourseUX from './basic-ux';
import CoursePreviewUX from './preview-ux';

export default function createUXForCourse(course) {
  const UxKlass = course.is_preview ? CoursePreviewUX : BasicCourseUX;
  return new UxKlass(course);
}
