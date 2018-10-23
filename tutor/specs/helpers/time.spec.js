import _ from 'underscore';
import moment from 'moment-timezone';

import TimeHelper from '../../src/helpers/time';
import Courses from '../../src/models/courses-map';

const COURSE_ID = 'TEST_COURSE_ID';
const TEST_TIMEZONE = 'Pacific Time (US & Canada)';
const TODAY_IN_CURRENT_ZONE = moment().startOf('day').format();

describe('Time Helpers', function() {

  beforeEach(() => Courses.bootstrap([{ id: COURSE_ID, time_zone: TEST_TIMEZONE }], { clear: true }));

  afterEach(() => Courses.clear());

  it('can get current locale', function() {
    const currentLocale = TimeHelper.getCurrentLocales();

    // check on the essential properties for being able to use
    // currentLocale to fix calendar's locale changing
    expect(currentLocale).to.have.property('abbr').and.to.be.a('string');
    expect(currentLocale).to.have.property('week').and.to.be.an('object');
    expect(currentLocale).to.have.deep.property('week.dow').and.to.be.a('number');
    expect(currentLocale).to.have.deep.property('week.doy').and.to.be.a('number');
    expect(currentLocale).to.have.property('weekdaysMin').and.to.be.an('array');
    return undefined;
  });


  it('will set the default timezone', function() {
    const courseTimezone = Courses.get(COURSE_ID).time_zone;

    TimeHelper.syncCourseTimezone(courseTimezone);
    expect(moment()._z).to.have.property('name').and.to.equal(TEST_TIMEZONE);
    expect(moment().startOf('day').format()).to.not.equal(TODAY_IN_CURRENT_ZONE);
    return undefined;
  });


  it('will reset the default timezone to user time', function() {
    const localTimezone = TimeHelper.getLocal();
    TimeHelper.unsyncCourseTimezone();
    expect(moment()._z).to.have.property('name').and.to.equal(localTimezone);
    expect(moment().startOf('day').isSame(TODAY_IN_CURRENT_ZONE)).to.be.true;
    return undefined;
  });


  return it('can check the default timezone', function() {
    const courseTimezone = Courses.get(COURSE_ID).time_zone;

    let isCourseTimezone = TimeHelper.isCourseTimezone(courseTimezone);
    expect(isCourseTimezone).to.be.false;

    TimeHelper.syncCourseTimezone(courseTimezone);
    isCourseTimezone = TimeHelper.isCourseTimezone(courseTimezone);
    expect(isCourseTimezone).to.be.true;
    TimeHelper.unsyncCourseTimezone();
    return undefined;
  });
});
