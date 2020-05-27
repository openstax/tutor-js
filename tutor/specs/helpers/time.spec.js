import moment from 'moment-timezone';
import TimeHelper from '../../src/helpers/time';
import Courses from '../../src/models/courses-map';

const COURSE_ID = 'TEST_COURSE_ID';
const TEST_TIMEZONE = 'Pacific Time (US & Canada)';
const TODAY_IN_CURRENT_ZONE = moment().startOf('day').format();

describe('Time Helpers', function() {

  beforeEach(() => Courses.bootstrap([{ id: COURSE_ID, time_zone: TEST_TIMEZONE }], { clear: true }));

  afterEach(() => Courses.clear());


  it('will set the default timezone', function() {
    const courseTimezone = Courses.get(COURSE_ID).time_zone;

    TimeHelper.syncCourseTimezone(courseTimezone);
    expect(moment().startOf('day').format()).not.toEqual(TODAY_IN_CURRENT_ZONE);
  });


  it('will reset the default timezone to user time', function() {
    TimeHelper.unsyncCourseTimezone();
    expect(moment().startOf('day').isSame(TODAY_IN_CURRENT_ZONE)).toBe(true);
  });

  it('checks if browser is in same timezone as course', function() {
    const courseTimezone = Courses.get(COURSE_ID).time_zone;
    expect(
      TimeHelper.isCourseTimezone(courseTimezone)
    ).toBe(false);

    TimeHelper.syncCourseTimezone(courseTimezone);
    expect(
      TimeHelper.isCourseTimezone(courseTimezone),
    ).toBe(true);
    TimeHelper.unsyncCourseTimezone();
  });

});
