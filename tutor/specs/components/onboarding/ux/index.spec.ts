import {
    onboardingForCourse,
    PreviewOnboarding,
    StudentCourseOnboarding,
} from '../../../../src/components/onboarding/ux'

describe('Basic Course UX Model', () => {

    it('returns either student or preview', () => {
        expect(
            onboardingForCourse({ currentRole: { isStudentLike: true }, is_preview: true } as any, {} as any)
        ).toBeInstanceOf(StudentCourseOnboarding);

        expect(
            onboardingForCourse({ currentRole: { isStudentLike: false }, is_preview: true } as any, {} as any)
        ).toBeInstanceOf(PreviewOnboarding);

        expect(
            onboardingForCourse({ currentRole: { isStudentLike: false }, is_preview: false } as any, {} as any)
        ).toBeNull();
    });

});
