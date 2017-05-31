import {
  computed, observable,
} from 'mobx';

import StandardCourseUX from './standard-ux';
import PreviewCourseUX from './preview-ux';

export default function createUXForCourse(course) {
  const UxKlass = course.is_preview ? PreviewCourseUX : StandardCourseUX;
  return new UxKlass(course);
}
