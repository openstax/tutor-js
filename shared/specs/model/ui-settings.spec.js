import { sinon, _ } from 'shared/specs/helpers';
import { autorun } from 'mobx';
const saveSettingsMock = jest.fn();
jest.mock('lodash/debounce', () => jest.fn(() => saveSettingsMock));

const UiSettings = require('model/ui-settings');
const Networking = require('model/networking');


describe('UiSettings', function() {

  beforeEach(function() {
    saveSettingsMock.mockReset();
    return sinon.stub(Networking, 'perform').returns({
      then(fn) { return fn({}); },
    });
  });

  afterEach(function() {
    UiSettings._reset();
    return Networking.perform.restore();
  });

  it('remembers initialized values', function() {
    UiSettings.initialize({ 'one': 1, 'two': 'II' });
    expect(UiSettings.get('one')).to.equal(1);
    expect(UiSettings.get('two')).to.equal('II');
    return undefined;
  });

  it('saves when set', function() {
    const initialSetting = { 'one': 1, 'two': 'II' };
    UiSettings.initialize(initialSetting);

    UiSettings.set({ one: 'five' });
    return expect(saveSettingsMock).toHaveBeenCalledTimes(1);
  });

  it('groups saves together', function() {
    const initialSetting = { one: 18, two: 'III', deep: { key: 'value', bar: 'bz' } };
    UiSettings.initialize(initialSetting);
    UiSettings.set({ one: 'five' });
    UiSettings.set({ one: 'six', deep: { bar: 'foo' } });
    UiSettings.set({ one: 'seven' });
    expect(saveSettingsMock).toHaveBeenCalledTimes(3);
    return undefined;
  });

  it('can set with key and id', function() {
    const initialSetting = { one: 18, two: 'III', deep: { key: 'value', bar: 'bz' } };
    UiSettings.initialize(initialSetting);
    expect(UiSettings.get('deep', 'bar')).to.eql('bz');
    UiSettings.set('deep', 42, 'answer');
    expect(UiSettings.get('deep', 'bar')).toEqual('bz');
    expect(UiSettings.get('deep', 'key')).toEqual('value');
    expect(UiSettings.get('deep', 42)).toEqual('answer');
    expect(UiSettings.get('deep')).toEqual({ 42: 'answer', key: 'value', bar: 'bz' });
    return undefined;
  });

  it('can observe', function() {
    const initialSetting = { one: 18, two: 'III', deep: { key: 'value', bar: 'bz' } };
    UiSettings.initialize(initialSetting);
    const spy = jest.fn(() => UiSettings.get('deep', 'bar'));
    autorun(spy);
    expect(spy).toHaveBeenCalledTimes(1); // mobx fires two observed events per set; one for the insert
    UiSettings.set('deep', 'bar', 'foo'); // and one for converting to observable object
    return expect(spy).toHaveBeenCalledTimes(3);
  });

  return it('can observe when bad values are present', function() {
    const initialSetting = { deep: {} };
    UiSettings.initialize(initialSetting);
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
    expect(spy).toHaveBeenCalledTimes(6);
    obj = UiSettings.get('deep', 'bar');
    return expect(obj.toJS()).toEqual([2, 3]);
  });
});
