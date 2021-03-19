import { DateTime } from '../../src/models/date-time'
import { TimeMock } from '../helpers';

describe(DateTime, () => {
    const now = new Date('2017-10-14T12:00:00.000Z');
    TimeMock.setTo(now);

    it('can be mocked', () => {
        const dt = new DateTime(now)
        expect(dt.asDateTime).toEqual('1')

    })
})
