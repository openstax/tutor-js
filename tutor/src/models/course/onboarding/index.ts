import StudentCourse from './student-course';
import Preview from './preview';
import { Course, TourContext } from './base';

export default function onboardingForCourse(course: Course, context: TourContext) {
    if (!course || (!course.currentRole.isStudentLike && !course.is_preview)) { return null; }

    const Klass = course.currentRole.isStudentLike ? StudentCourse : Preview;
    return new Klass(course, context);
}
