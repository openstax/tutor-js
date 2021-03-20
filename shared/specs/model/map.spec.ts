import { Map } from 'shared/model/map'
import { autorun, runInAction } from 'mobx'

class FooModel {

    id = '1'

    update(_obj: any) {

    }
}

describe('Map base class', () => {

    it('defaults to converting keys to int', () => {
        const map = new Map<string, FooModel>();
        const mod = new FooModel()
        map.set(1, mod);
        expect(map.get('1')).toBe(mod)
    });

    it('can use string keys', () => {
        const map = new Map<string, FooModel>();
        const mod = new FooModel()
        map.set('1', mod);
        expect(map.get(1)).toBe(mod)
    });

    it('resets self and api when reset', () => {
        const map = new Map<string, FooModel>();
        map.set('1', new FooModel());
        map.api.requestCounts.read = 1;
        map.reset();
        expect(map.get('1')).toBeUndefined();
        expect(map.api.requestCounts.read).toEqual(0);
    });

    it('is observable', () => {
        const map = new Map<string, FooModel>();
        map.set('1', new FooModel());
        const spy = jest.fn(() => map?.get(1)?.id)
        autorun(spy)
        runInAction(() => {
            map.set('1', new FooModel());
        })
        expect(spy).toHaveBeenCalledTimes(2)
    })

});
