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
        expect(time.asISOString).toEqual(SERVER_TIME.toISOString());
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
})
