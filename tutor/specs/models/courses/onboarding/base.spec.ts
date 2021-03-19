import moment from 'moment';

import Course from '../../../../src/models/course';
import { TEACHER_COURSE_TWO_MODEL } from '../../../courses-test-data';
import OnboardingUX from '../../../../src/models/course/onboarding/preview';

describe('Course Onboarding base class', () => {
    let ux;

    beforeEach(() => {
        ux = new OnboardingUX(new Course(TEACHER_COURSE_TWO_MODEL), { tour: null });
        ux._setTaskPlanPublish(false);
    });

    it('#courseIsNaggable', () => {
        ux.course.roles[0].joined_at = moment().subtract(1, 'hours');
        expect(ux.courseIsNaggable).toBe(false);
        ux.course.roles[0].joined_at = moment().subtract(4, 'hours').subtract(1, 'second');
        expect(ux.courseIsNaggable).toBe(true);
        ux.course.ends_at = moment().subtract(1, 'day');
        expect(ux.courseIsNaggable).toBe(false);
    });


});
