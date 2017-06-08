import FullCourse from './full-course';
import Preview from './preview';

export default function onboardingForCourse(course, context) {
  const Klass = course.is_preview ? Preview : FullCourse;
  return new Klass(course, context);
}
