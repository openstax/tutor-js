import { bootstrapCoursesList } from '../../courses-test-data';


describe('Course Periods Model', () => {

  let courses, period;

  beforeEach(() => {
    courses = bootstrapCoursesList();
    period = courses.get(2).periods[0];
  });


  it('calculates a join url', () => {
    expect(period.enrollment_url_with_details).toEqual(
      'http://test/period/1/Local-Test-Course-Two-Spring-2017'
    );
  });

});
