import Time from '../../src/models/time';
import MockDate from 'mockdate';
import moment from 'moment-timezone';
import { partial, isString } from 'lodash';
import FactoryBot from 'object-factory-bot';

const TimeMock = {

  setTo(dateTime) {
    if (isString(dateTime)) {
      dateTime = new Date(dateTime);
    }
    beforeEach(partial(TimeMock.mock, dateTime));
    afterEach(TimeMock.restore);
    return dateTime;
  },

  mock(dateTime) {
    const now = new Date(dateTime);
    const tz  = 'America/Chicago';

    MockDate.set(now, -360);
    FactoryBot.defaults.now = dateTime;
    const spy = jest.spyOn(Time, 'now', 'get');
    spy.mockImplementation(() => now);

    jest.spyOn(moment.tz, 'guess').mockImplementation(() => tz);
    moment.tz.setDefault(tz);
    moment.locale('en');
  },

  restore() {
    delete FactoryBot.defaults.now;
    MockDate.reset();
    moment.tz.setDefault();
  },

};

export default TimeMock;
