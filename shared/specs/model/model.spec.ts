import { BaseModel, extendedArray, hydrateModel, modelize, field, model } from 'shared/model'

describe('Model base class', () => {

    class Bar {
        @field num = 1
    }

    class Foo extends BaseModel {
        @model(Bar) bars = extendedArray((a: Bar[]) => ({
            eq(n: number) { return a.filter((b) => b.num == n) },
        }))

        constructor() {
            super();
            modelize(this);
        }
    }

    it('can extend array', () => {
        const foo = hydrateModel(Foo, {
            bars: [ { num: 1 }, { num: 2 }, { num: 1 } ],
        })
        expect(foo.bars).toHaveLength(3)
        foo.bars.forEach(b => expect(b).toBeInstanceOf(Bar))
        expect(foo.bars.eq(1)).toHaveLength(2)
    });
})
