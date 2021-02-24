import * as O from '../../src/helpers/object';

describe('Object helpers', function() {

    it('titlesizes a object', function() {
        expect(O.titleize({ foo: 'is Bad', bar: 'is Good' })).toEqual(
            'Foo is Bad and Bar is Good'
        );
    });

});
