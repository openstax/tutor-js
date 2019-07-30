import Map from 'model/map';

describe('Map base class', () => {

  it('defaults to converting keys to int', () => {
    const m = new Map();
    m.set('1', { foo: 'bar' });
    expect(m.get('1')).toEqual({ foo: 'bar' });
  });

  it('can use string keys', () => {
    const m = new Map({}, { keyType: String });
    m.set(1, { foo: 'bar' });
    expect(m.get('1')).toEqual({ foo: 'bar' });
  });

  it('resets self and api when reset', () => {
    const m = new Map();
    m.set('1', 'bar');
    m.api.requestCounts.read = 1;
    m.reset();
    expect(m.get('1')).toBeUndefined();
    expect(m.api.requestCounts.read).toEqual(0);
  });

});
