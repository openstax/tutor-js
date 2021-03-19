import Factories from '../../factories';

describe('Course Periods Model', () => {

    let course, period;

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
