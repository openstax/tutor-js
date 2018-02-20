import Factories from '../../../factories';
import Factory from 'object-factory-bot';

// import { bootstrapCoursesList } from '../../courses-test-data';


describe('Course Periods Model', () => {

  let course, period;

  beforeEach(() => {
    course = Factories.Course()
    period = course.periods[0];
  });


  it('calculates a join url', () => {
    expect(period.enrollment_url_with_details).toContain(
      period.enrollment_code
    );
  });

});
