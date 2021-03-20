import { autorun, runInAction } from 'mobx';
import UiSettings from 'shared/model/ui-settings';


describe('UiSettings', function() {
    let saveSettings = {} as any;

    beforeEach(function() {
        saveSettings = jest.fn();
        UiSettings.initialize({}, saveSettings);
    });

    afterEach(function() {
        runInAction(() => UiSettings._reset() );
    });

    it('remembers initialized values', function() {
        UiSettings.initialize({ 'one': 1, 'two': 'II' }, saveSettings);
        expect(UiSettings.get('one')).toEqual(1);
        expect(UiSettings.get('two')).toEqual('II');
    });

    it('saves when set', function() {
        runInAction( () => UiSettings.set({ one: 'five' }));
        expect(saveSettings).toHaveBeenCalledTimes(1);
    });

    it('groups saves together', function() {
        const initialSetting = { one: 18, two: 'III', deep: { key: 'value', bar: 'bz' } };
        UiSettings.initialize(initialSetting, saveSettings);
        runInAction( () => UiSettings.set({ one: 'five' }) );
        runInAction( () => UiSettings.set({ one: 'six', deep: { bar: 'foo' } }) );
        runInAction( () => UiSettings.set({ one: 'seven' }) );
        expect(saveSettings).toHaveBeenCalledTimes(3);
    });

    it('can set with key and id', function() {
        const initialSetting = { one: 18, two: 'III', deep: { key: 'value', bar: 'bz' } };
        UiSettings.initialize(initialSetting);
        expect(UiSettings.get('deep', 'bar')).toEqual('bz');
        runInAction( () => UiSettings.set('deep', 42, 'answer') );
        expect(UiSettings.get('deep', 'bar')).toEqual('bz');
        expect(UiSettings.get('deep', 'key')).toEqual('value');
        expect(UiSettings.get('deep', 42)).toEqual('answer');
        expect(UiSettings.get('deep')).toEqual({ 42: 'answer', key: 'value', bar: 'bz' });
    });

    it('can observe', function() {
        const initialSetting = { one: 18, two: 'III', deep: { key: 'value', bar: 'bz' } };
        UiSettings.initialize(initialSetting, saveSettings);
        const spy = jest.fn(() => UiSettings.get('deep', 'bar'));
        autorun(spy);
        expect(spy).toHaveBeenCalledTimes(1); // mobx fires two observed events per set; one for the insert
        runInAction( () => UiSettings.set('deep', 'bar', 'foo') ); // and one for converting to observable object
        expect(saveSettings).toHaveBeenCalledTimes(1);
    });

    it('can observe when bad values are present', function() {
        const initialSetting = { deep: {} };
        runInAction( () => UiSettings.initialize(initialSetting, saveSettings) );
        const spy = jest.fn(() => UiSettings.get('deep', 'bar'));
        autorun(spy);
        expect(spy).toHaveBeenCalledTimes(1);
        runInAction( () => UiSettings.set('deep', true) );
        expect(spy).toHaveBeenCalledTimes(2);
        runInAction( () => UiSettings.set('deep', 'bar', 'foo') );
        expect(spy).toHaveBeenCalledTimes(3);
        let obj = UiSettings.get('deep');
        expect(obj).toEqual({ bar: 'foo' });
        runInAction( () => obj.bar = 233 );
        expect(spy).toHaveBeenCalledTimes(4);
        runInAction( () => UiSettings.set('deep', 'bar', [2, 3] ) );
        expect(spy).toHaveBeenCalledTimes(5);
        obj = UiSettings.get('deep', 'bar');
        return expect(obj.toJSON()).toEqual([2, 3]);
    });

});
