import Time, { Interval, setNow, setResolution } from '../../src/model/time'
import { autorun } from 'mobx'
import moment from 'moment-timezone'

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
        const t = new Time(m)
        expect(t.asISOString).toEqual(m.toISOString())
    });

    it.only('converts from momentjs and keeps timezone', () => {
        const m = moment.tz('2021-01-15T10:00:00.000Z', 'US/Arizona');
        const t = new Time(m)

        expect(t.asISOString).toEqual(m.toISOString())
        expect(t.zoneName).toEqual('US/Arizona');
    });

    it('converts to moment with tz', () => {
        const t = new Time('2021-01-15T10:00:00.000Z').inZone('US/Arizona')
        expect(t.asMomentTz.tz()).toEqual('US/Arizona')
        expect(t.asISOString).toEqual(t.asMomentTz.toISOString())
    })

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

    it('has a humanized representation', () => {
        expect(new Interval({
            start: '2020-01-14T03:00:00.000Z',
            end: '2021-01-15T10:58:03.330Z',
        }).humanized).toEqual('1 year')
        expect(new Interval({
            start: '2021-01-14T03:00:00.000Z',
            end: '2021-04-15T10:58:03.330Z',
        }).humanized).toEqual('3 months')
        expect(new Interval({
            start: '2021-01-14T03:00:00.000Z',
            end: '2021-01-18T10:58:03.330Z',
        }).humanized).toEqual('4 days')
        expect(new Interval({
            start: '2021-01-14T03:00:00.000Z',
            end: '2021-01-14T10:58:03.330Z',
        }).humanized).toEqual('7 hours')
        expect(new Interval({
            start: '2021-01-14T03:00:00.000Z',
            end: '2021-01-14T03:58:03.330Z',
        }).humanized).toEqual('58 minutes')
        expect(new Interval({
            start: '2021-01-14T03:00:00.000Z',
            end: '2021-01-14T03:0:03.330Z',
        }).humanized).toEqual('now')
    })

    it('converts to sentence', () => {
        const past = new Time('2021-01-14T03:00:00.000Z')
        const future = new Time('2021-01-15T10:58:03.330Z')
        const interval = future.intervalTo(past)
        // it flipped start/end so start always comes first
        expect(interval.start.isSame(past, 'millisecond')).toBe(true)
        expect(interval.asSentence).toEqual('1 day, 7 hours and 58 minutes')
    })

})
