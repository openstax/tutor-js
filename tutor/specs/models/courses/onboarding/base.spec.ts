import { hydrateModel } from 'modeled-mobx';
import TourContext from '../../../../src/models/tour/context'
import Course from '../../../../src/models/course';
import { TEACHER_COURSE_TWO_MODEL } from '../../../courses-test-data';
import OnboardingUX from '../../../../src/models/course/onboarding/preview';
import DateTime from 'shared/model/date-time'

describe('Course Onboarding base class', () => {
    let ux: OnboardingUX;

    beforeEach(() => {
        const course = hydrateModel(Course, TEACHER_COURSE_TWO_MODEL);
        ux = new OnboardingUX(course, hydrateModel(TourContext, {}));
        ux._setTaskPlanPublish(false);
    });

    it('#courseIsNaggable', () => {
        expect(ux.course.isActive).toBe(true);
        (ux.course as any).roles[0].joined_at = DateTime.now.minus({ hour: 1 });
        expect(ux.courseIsNaggable).toBe(false);
        (ux.course as any).roles[0].joined_at = DateTime.now.minus({ hour: 5 });
        expect(ux.courseIsNaggable).toBe(true);
        (ux.course as any).ends_at = DateTime.now.minus({ day: 1 });
        expect(ux.courseIsNaggable).toBe(false);
    });
});
