import moment from 'moment-timezone';
import { Time } from '../../src/models'
import TimeHelper from '../../src/helpers/time';


const TEST_TIMEZONE = 'US/Alaska';
const TODAY_IN_CURRENT_ZONE = moment().startOf('day').format();

describe('Time Helpers', function() {

    it('will set the default timezone', function() {
        TimeHelper.syncCourseTimezone(TEST_TIMEZONE);
        expect(moment().startOf('day').format()).not.toEqual(TODAY_IN_CURRENT_ZONE);
        expect(Time.now.zoneName).toEqual(TEST_TIMEZONE)
    });

    it('will reset the default timezone to user time', function() {
        TimeHelper.unsyncCourseTimezone();
        expect(moment().startOf('day').isSame(TODAY_IN_CURRENT_ZONE)).toBe(true);
    });

    it('checks if browser is in same timezone as course', function() {
        expect(
            TimeHelper.isCourseTimezone(TEST_TIMEZONE)
        ).toBe(false);

        TimeHelper.syncCourseTimezone(TEST_TIMEZONE)
        expect(
            TimeHelper.isCourseTimezone(TEST_TIMEZONE)
        ).toBe(true);
        TimeHelper.unsyncCourseTimezone();
    });

});
