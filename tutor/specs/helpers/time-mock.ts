import Time from 'shared/model/time'
import MockDate from 'mockdate';
// @ts-ignore
import moment from 'moment-timezone';
import { partial } from 'lodash';
import FactoryBot from 'object-factory-bot';

const TimeMock = {

    setTo(dateTime: string | Time | Date) {
        const now = new Time(dateTime)
        beforeEach(partial(TimeMock.mock, now));
        afterEach(TimeMock.restore);
        return now
    },

    mock(now: Time) {
        const tz  = 'America/Chicago';
        Time.defaultZoneName = tz;
        MockDate.set(now.asDate, -360);
        FactoryBot.defaults!.now = now.asDate
        const spy = jest.spyOn(Time, 'now', 'get');
        spy.mockImplementation(() => now);

        jest.spyOn(moment.tz, 'guess').mockImplementation(() => tz);
        moment.tz.setDefault(tz);
        moment.locale('en');
    },

    restore() {
        delete FactoryBot.defaults!.now;
        MockDate.reset();
    },

};

export default TimeMock;
