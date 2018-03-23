import Tag from '../../src/model/exercise/tag';

describe('Exercise Tags', () => {

  it('splits and re-assembles parts', () => {
    const lo = new Tag('lo:stax-phys:1-2-1');

    expect(lo.asString).toEqual('lo:stax-phys:1-2-1');
    expect(lo.asObject).toEqual({ type: 'lo', specifier: 'stax-phys', value: '1-2-1' });
    lo.type = 'TY';
    expect(lo.asObject).toEqual({ type: 'TY', specifier: 'stax-phys', value: '1-2-1' });

    lo.specifier = 'S';
    expect(lo.asObject).toEqual({ type: 'TY', specifier: 'S', value: '1-2-1' });

    lo.value = 'V';
    expect(lo.asObject).toEqual({ type: 'TY', specifier: 'S', value: 'V' });

    expect(lo.asString).toEqual('TY:S:V');
  });

});
