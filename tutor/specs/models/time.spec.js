import { autorun } from 'mobx';

import Time, { setNow, setResolution } from '../../src/models/time';

const SERVER_TIME = new Date('2000-02-02');
const LOCAL_TIME = new Date('2011-11-11');

describe('Time Store', () => {

    beforeEach(() => setResolution(1));
    afterEach(() => setResolution());

    it('sets time', () => {
        setNow(SERVER_TIME);
        const time = Time.now;
        expect(`${time}`).toEqual(`${SERVER_TIME}`);
    });

    it('is observable', () => {
        return new Promise(done => {
            const timer = jest.fn();
            autorun(() => timer(Time.now));
            setTimeout(() => {
                expect(timer).toHaveBeenCalledTimes(2);
                done();
            }, 1);
        });
    });

});
