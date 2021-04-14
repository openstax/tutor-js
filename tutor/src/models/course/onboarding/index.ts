import { StudentCourseOnboarding } from './student-course';
import { PreviewOnboarding } from './preview';
import { Course, TourContext } from '../../../models'

export default function onboardingForCourse(course: Course, context: TourContext) {
    if (!course || (!course.currentRole.isStudentLike && !course.is_preview)) { return null; }

    const Klass = course.currentRole.isStudentLike ? StudentCourseOnboarding : PreviewOnboarding;
    return new Klass(course, context);
}
