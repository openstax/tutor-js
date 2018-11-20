import Time from '../../src/models/time';
import chronokinesis from 'chronokinesis';
import moment from 'moment-timezone';
import { partial } from 'lodash';


const TimeMock = {

  setTo(dateTime) {
    beforeEach(partial(TimeMock.mock, dateTime));
    afterEach(TimeMock.restore);
  },

  mock(dateTime) {
    const now = new Date(dateTime);
    chronokinesis.travel(now);
    //setNow(now);
    const spy = jest.spyOn(Time, 'now', 'get');
    spy.mockImplementation(() => now);
    moment.tz.setDefault('America/Chicago');
    moment.locale('en');
  },

  restore() {
    chronokinesis.reset();
    moment.tz.setDefault();
  },

};

export default TimeMock;
