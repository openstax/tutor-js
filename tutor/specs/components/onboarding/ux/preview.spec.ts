import { observable } from 'mobx';
import { TEACHER_COURSE_TWO_MODEL } from '../../../courses-test-data';
import { hydrateModel } from 'modeled-mobx';
import { Time, Course, TourContext } from '../../../../src/models'
import {
    PreviewOnboarding,
} from '../../../../src/components/onboarding/ux/preview'

let mockCourses = observable.array();
Object.defineProperties(mockCourses, {
    isEmpty: {
        get: function() { return this.length === 0; },
    },
    api: {
        get: function() { return {}; },
    },
});

jest.mock('../../../../src/models/courses-map', () => ({
    currentCourses: {
        tutor: { currentAndFuture: { get nonPreview() { return mockCourses; } } },
    },
}));
jest.mock('../../../../src/models/course');
jest.mock('../../../../src/models/task-plans/teacher');

describe('Course Preview Onboarding', () => {
    let ux:PreviewOnboarding;
    const mockActiveCoursePlans = observable.array()

    beforeEach(() => {
        const course = hydrateModel(Course, TEACHER_COURSE_TWO_MODEL);
        mockActiveCoursePlans.clear();
        (course as any).teacherTaskPlans = { active: mockActiveCoursePlans, api: { isPending: false } };
        (course as any).offering = { is_available: true };
        ux = new PreviewOnboarding(course, hydrateModel(TourContext, {}));
        ux._setTaskPlanPublish(false);
    });

    it('#shouldWarnPreviewOnly', () => {
        ux._setTaskPlanPublish();
        expect(ux.shouldWarnPreviewOnly).toBe(false);
        mockActiveCoursePlans.replace([
            { is_preview: true, type: 'homework' },
            { is_preview: false, type: 'homework' },
            { is_preview: true, type: 'reading' },
        ]);
        expect(ux.shouldWarnPreviewOnly).toBe(false);
        mockActiveCoursePlans.push({ is_preview: false, type: 'external' })
        expect(ux.shouldWarnPreviewOnly).toBe(false);
        mockActiveCoursePlans.push({ is_preview: false, type: 'reading' })
        expect(ux.shouldWarnPreviewOnly).toBe(true);
    });

    it('#hasCreatedRealCourse', () => {
        mockCourses.push({ is_preview: false });
        expect(ux.hasCreatedRealCourse).toBe(true);
    });

    it('#nagComponent', () => {
        mockCourses.clear();
        expect(ux.nagComponent).toBeNull();
        ux.course.ends_at = Time.now.minus({ minute: 100 });
        (ux.course as any).hasEnded = true;
        mockActiveCoursePlans.clear();
        expect(ux.nagComponent).not.toBeNull();
    });

});
