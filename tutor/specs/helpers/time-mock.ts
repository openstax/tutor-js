import Time from 'shared/model/time'
import MockDate from 'mockdate';
// @ts-ignore
import moment from 'moment-timezone';
import { partial } from 'lodash';
import FactoryBot from 'object-factory-bot';

const TimeMock: {
    spies: jest.SpyInstance[],
    setTo: (dateTime: string | Time | Date) => Time,
    mock: (now: Time) => void,
    restore: () => void
} = {
    spies: [],

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
        const nowSpy = jest.spyOn(Time, 'now', 'get');
        nowSpy.mockImplementation(() => now);
        TimeMock.spies.push(nowSpy);
        const guessSpy = jest.spyOn(moment.tz, 'guess');
        guessSpy.mockImplementation(() => tz);
        TimeMock.spies.push(guessSpy);
        moment.tz.setDefault(tz);
        moment.locale('en');
    },

    restore() {
        delete FactoryBot.defaults!.now;
        MockDate.reset();
        let spy = TimeMock.spies.pop();
        while (spy) {
            spy.mockRestore();
            spy = TimeMock.spies.pop();
        }
    },

};

export default TimeMock;
