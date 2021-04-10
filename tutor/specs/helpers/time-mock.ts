import Time from 'shared/model/time'
import MockDate from 'mockdate';

import { partial, isString } from 'lodash';
import FactoryBot from 'object-factory-bot';

const TimeMock = {

    setTo(dateTime: string | Date) {
        if (isString(dateTime)) {
            dateTime = new Date(dateTime);
        }
        beforeEach(partial(TimeMock.mock, dateTime));
        afterEach(TimeMock.restore);
        return dateTime;
    },

    mock(dateTime: string | Date) {
        const now = new Time(dateTime);
        // const tz  = 'America/Chicago';
        MockDate.set(now.asDate, -360);
        FactoryBot.defaults!.now = dateTime;
        const spy = jest.spyOn(Time, 'now', 'get');
        spy.mockImplementation(() => now);
    },

    restore() {
        delete FactoryBot.defaults!.now;
        MockDate.reset();
    },

};

export default TimeMock;
