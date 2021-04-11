import Time from 'shared/model/time'
import MockDate from 'mockdate';

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
        // const tz  = 'America/Chicago';
        MockDate.set(now.asDate, -360);
        FactoryBot.defaults!.now = now.asDate
        const spy = jest.spyOn(Time, 'now', 'get');
        spy.mockImplementation(() => now);
    },

    restore() {
        delete FactoryBot.defaults!.now;
        MockDate.reset();
    },

};

export default TimeMock;
