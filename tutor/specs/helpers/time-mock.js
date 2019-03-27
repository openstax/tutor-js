import Time from '../../src/models/time';
import chronokinesis from 'chronokinesis';
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
  },

  mock(dateTime) {
    const now = new Date(dateTime);
    chronokinesis.travel(now);
    FactoryBot.defaults.now = dateTime;
    const spy = jest.spyOn(Time, 'now', 'get');
    spy.mockImplementation(() => now);
    moment.tz.setDefault('America/Chicago');
    moment.locale('en');
  },

  restore() {
    delete FactoryBot.defaults.now;
    chronokinesis.reset();
    moment.tz.setDefault();
  },

};

export default TimeMock;
