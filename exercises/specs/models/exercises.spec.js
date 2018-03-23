import { Exercise, ExercisesMap } from '../../src/models/exercises';

describe('Exercises map', () => {

  it('creates version submaps', () => {
    const map = new ExercisesMap();
    map.onLoaded({ data: { number: 1, version: 1 } });
    map.onLoaded({ data: { number: 1, version: 2 } });
    map.onLoaded({ data: { number: 2, version: 11 } });
    expect(map.keys()).toEqual([ '1', '2' ]);
    expect(map.get('1@1')).toMatchObject({
      number: 1, version: 1,
    });
    expect(map.get(1)).toMatchObject({
      number: 1, version: 2,
    });
  });

});
