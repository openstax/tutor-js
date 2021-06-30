import Time, { setNow, setResolution } from '../../src/model/time'
import { autorun } from 'mobx'
import moment from 'moment'

const SERVER_TIME = new Date('2000-02-02');

describe('time class', () => {

    beforeEach(() => setResolution(1));
    afterEach(() => setResolution());

    it('sets time', () => {
        setNow(SERVER_TIME);
        const time = Time.now;
        expect(time.startOf('second').asISOString).toEqual(
            new Time(SERVER_TIME).startOf('second').asISOString
        )
    });

    it('is observable', () => {
        return new Promise((done:any) => {
            const timer = jest.fn();
            autorun(() => timer(Time.now));
            setTimeout(() => {
                expect(timer).toHaveBeenCalledTimes(2);
                done();
            }, 1);
        });
    });

    it('converts from momentjs', () => {
        const m = moment()
        const t = new Time(m as any)
        expect(t.asISOString).toEqual(m.toISOString())
    });

    it('diffs', () => {
        const past = new Time('2021-01-15T10:00:00.000Z')
        const future = new Time('2021-01-15T10:58:00.000Z')

        expect(past.diff(future, 'minute')).toEqual(-58)
        expect(past.fractionalDiff(future, 'hour')).toBeCloseTo(-0.9666)
        expect(future.diff(past, 'hour')).toEqual(0)
        expect(future.isSame(past, 'hour')).toBe(true)
        expect(past.diff(future, 'hour')).toEqual(-0)

        expect(past.isBefore(future)).toBe(true)
        expect(past.isBefore(future, 'minute')).toBe(true)
        expect(past.isBefore(future, 'hour')).toBe(false)

        expect(past.isAfter(future)).toBe(false)
        expect(past.isAfter(future, 'minute')).toBe(false)
        expect(past.isAfter(future, 'hour')).toBe(false)

        expect(future.isAfter(past)).toBe(true)
        expect(future.isAfter(past, 'minute')).toBe(true)
        expect(future.isAfter(past, 'hour')).toBe(false)
    })

    it('converts to interval with human display', () => {
        const past = new Time('2021-01-15T10:00:00.000Z')
        const future = new Time('2021-01-15T10:58:00.000Z')
        const interval = future.intervalTo(past)
        // it flipped start/end so start always comes first
        expect(interval.start.isSame(past, 'millisecond')).toBe(true)
        expect(interval.humanized).toEqual('58 minutes')
    })

})
