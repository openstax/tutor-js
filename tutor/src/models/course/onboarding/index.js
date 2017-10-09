import FullCourse from './full-course';
import StudentCourse from './student-course';
import Preview from './preview';

export default function onboardingForCourse(course, context) {
  let Klass;
  if (!course) { return {}; }

  if (course.isStudent) {
    Klass = StudentCourse;
  } else {
    Klass = course.is_preview ? Preview : FullCourse;
  }
  return new Klass(course, context);
}
