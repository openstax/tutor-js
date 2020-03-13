import { autorun } from 'mobx';
import UiSettings from 'model/ui-settings';


describe('UiSettings', function() {
  let saveSettings;

  beforeEach(function() {
    saveSettings = jest.fn();
    UiSettings.initialize({}, saveSettings);
  });

  afterEach(function() {
    UiSettings._reset();
  });

  it('remembers initialized values', function() {
    UiSettings.initialize({ 'one': 1, 'two': 'II' }, saveSettings);
    expect(UiSettings.get('one')).toEqual(1);
    expect(UiSettings.get('two')).toEqual('II');
  });

  it('saves when set', function() {
    UiSettings.set({ one: 'five' });
    expect(saveSettings).toHaveBeenCalledTimes(1);
  });

  it('groups saves together', function() {
    const initialSetting = { one: 18, two: 'III', deep: { key: 'value', bar: 'bz' } };
    UiSettings.initialize(initialSetting, saveSettings);
    UiSettings.set({ one: 'five' });
    UiSettings.set({ one: 'six', deep: { bar: 'foo' } });
    UiSettings.set({ one: 'seven' });
    expect(saveSettings).toHaveBeenCalledTimes(3);
  });

  it('can set with key and id', function() {
    const initialSetting = { one: 18, two: 'III', deep: { key: 'value', bar: 'bz' } };
    UiSettings.initialize(initialSetting);
    expect(UiSettings.get('deep', 'bar')).toEqual('bz');
    UiSettings.set('deep', 42, 'answer');
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
    UiSettings.set('deep', 'bar', 'foo'); // and one for converting to observable object
    expect(saveSettings).toHaveBeenCalledTimes(1);
  });

  it('can observe when bad values are present', function() {
    const initialSetting = { deep: {} };
    UiSettings.initialize(initialSetting, saveSettings);
    const spy = jest.fn(() => UiSettings.get('deep', 'bar'));
    autorun(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    UiSettings.set('deep', true);
    expect(spy).toHaveBeenCalledTimes(2);
    UiSettings.set('deep', 'bar', 'foo');
    expect(spy).toHaveBeenCalledTimes(3);
    let obj = UiSettings.get('deep');
    expect(obj).toEqual({ bar: 'foo' });
    obj.bar = 233;
    expect(spy).toHaveBeenCalledTimes(4);
    UiSettings.set('deep', 'bar', [2, 3] );
    expect(spy).toHaveBeenCalledTimes(5);
    obj = UiSettings.get('deep', 'bar');
    return expect(obj.toJS()).toEqual([2, 3]);
  });

  it('can decorate properties', () => {
    class Foo {
      @UiSettings.decorate('fb') bar = 1;
    }
    const foo = new Foo();
    expect(foo.bar).toEqual(1);

    UiSettings.set({ fb: 2 });
    expect(foo.bar).toEqual(2);

    foo.bar = 'test';
    expect(foo.bar).toEqual('test');
    expect(saveSettings).toHaveBeenCalledTimes(2);
  });
});
