import onboardingForCourse from '../../../../src/models/course/onboarding';
import FullCourseOnboarding from '../../../../src/models/course/onboarding/full-course';
import PreviewOnboarding from '../../../../src/models/course/onboarding/preview';


describe('Basic Course UX Model', () => {

  it('returns either preview or basic', () => {
    expect(
      onboardingForCourse({ currentRole: { isTeacher: true }, is_preview: true })
    ).toBeInstanceOf(PreviewOnboarding);

    expect(
      onboardingForCourse({ currentRole: { isTeacher: true }, is_preview: false })
    ).toBeInstanceOf(FullCourseOnboarding);
  });

});
