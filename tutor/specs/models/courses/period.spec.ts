import Course from '../../../src/models/course';
import CoursePeriod from '../../../src/models/course/period';
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

});
