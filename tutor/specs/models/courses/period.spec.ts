import { Course, CoursePeriod } from '../../../src/models'
import Factories from '../../factories';

describe('Course Periods Model', () => {

    let course: Course;
    let period: CoursePeriod

    beforeEach(() => {
        course = Factories.course();
        period = course.periods[0];
    });

    it('calculates a join url', () => {
        expect(period.enrollment_url_with_details).toContain(
            period.enrollment_code
        );
    });

    it ('adds itself to the course when saving if isNew', async () => {
        const newPeriod = Factories.period({ id: null }, course);
        expect(newPeriod.isNew).toEqual(true);
        const numPeriods = course.periods.length;
        await newPeriod.save();
        expect(course.periods.length).toEqual(numPeriods + 1);
        expect(course.periods).toContain(newPeriod);
    });

    it ('does not add itself to the course when saving if not isNew', async () => {
        expect(period.isNew).toEqual(false);
        const numPeriods = course.periods.length;
        await period.save();
        expect(course.periods.length).toEqual(numPeriods);
        expect(course.periods).toContain(period);
    });

});
