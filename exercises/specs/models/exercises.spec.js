import { Exercise, ExercisesMap } from '../../src/models/exercises';

describe('Exercises map', () => {

    it('creates version submaps', () => {
        const map = new ExercisesMap();
        map.onLoaded({ data: { number: 1, version: 1, uid: '1@1' } });
        map.onLoaded({ data: { number: 1, version: 2, uid: '1@2' } });
        map.onLoaded({ data: { number: 2, version: 11,uid: '2@11' } });
        expect(map.keys()).toEqual([ 1, 2 ]);
        expect(map.get('1@1')).toMatchObject({
            number: 1, version: 1,
        });
        expect(map.get(1)).toMatchObject({
            number: 1, version: 2,
        });
    });

    it('sets to a exercise model', () => {
        const map = new ExercisesMap();
        map.onLoaded({ data: { number: 1, version: 1, uid: '1@1' } });
        const ex = map.get('1@1');
        expect(ex).toBeInstanceOf(Exercise);
        expect(ex.number).toEqual(1);
        expect(ex.version).toEqual(1);
        expect(ex.uid).toEqual('1@1');
    });

});
