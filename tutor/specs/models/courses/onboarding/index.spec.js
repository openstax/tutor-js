import onboardingForCourse from '../../../../src/models/course/onboarding';
import StudentCourseOnboarding from '../../../../src/models/course/onboarding/student-course';
import PreviewOnboarding from '../../../../src/models/course/onboarding/preview';


describe('Basic Course UX Model', () => {

  it('returns either student or preview', () => {
    expect(
      onboardingForCourse({ currentRole: { isStudentLike: true }, is_preview: true })
    ).toBeInstanceOf(StudentCourseOnboarding);

    expect(
      onboardingForCourse({ currentRole: { isStudentLike: false }, is_preview: true })
    ).toBeInstanceOf(PreviewOnboarding);

    expect(
      onboardingForCourse({ currentRole: { isStudentLike: false }, is_preview: false })
    ).toBeNull();
  });

});
