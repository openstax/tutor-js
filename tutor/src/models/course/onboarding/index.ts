import StudentCourse from './student-course';
import Preview from './preview';

export default function onboardingForCourse(course, context) {
    if (!course || (!course.currentRole.isStudentLike && !course.is_preview)) { return null; }

    const Klass = course.currentRole.isStudentLike ? StudentCourse : Preview;
    return new Klass(course, context);
}
