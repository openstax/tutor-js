import { hydrateModel } from 'modeled-mobx';
import { TourContext, Course } from '../../../../src/models'
import {
    PreviewOnboarding,
} from '../../../../src/components/onboarding/ux/preview'

import { TEACHER_COURSE_TWO_MODEL } from '../../../courses-test-data';
import Time from 'shared/model/time'

describe('Course Onboarding base class', () => {
    let ux: PreviewOnboarding;

    beforeEach(() => {
        const course = hydrateModel(Course, TEACHER_COURSE_TWO_MODEL);
        ux = new PreviewOnboarding(course, hydrateModel(TourContext, {}));
        ux._setTaskPlanPublish(false);
    });

    it('#courseIsNaggable', () => {
        expect(ux.course.isActive).toBe(true);
        (ux.course as any).roles[0].joined_at = Time.now.minus({ hour: 1 });
        expect(ux.courseIsNaggable).toBe(false);
        (ux.course as any).roles[0].joined_at = Time.now.minus({ hour: 5 });
        expect(ux.courseIsNaggable).toBe(true);
        (ux.course as any).ends_at = Time.now.minus({ day: 1 });
        expect(ux.courseIsNaggable).toBe(false);
    });
});
