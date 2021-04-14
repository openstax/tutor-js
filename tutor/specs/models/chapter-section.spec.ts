import { ChapterSection } from '../../src/models'

describe('ChapterSection Model', () => {

    it('accepts an array', () => {
        const cs = new ChapterSection([1,23]);
        expect(cs.asString).toEqual('1.23');
    });

    it('accepts an existing CS', () => {
        const cs1 = new ChapterSection([1,23]);
        const cs2 = new ChapterSection(cs1);
        expect(cs2.asString).toEqual('1.23');
    });

    it('can convert to a number for sorting', () => {
        const cs = new ChapterSection([0,23]);
        expect(cs.asNumber).toEqual(23); // 0 + 23
        cs.chapter = 2;
        expect(cs.asNumber).toEqual(223); // 200 + 23
        cs.section = 0;
        expect(cs.asNumber).toEqual(200); // 200 + 0
        cs.section = 110;
        cs.chapter = 1000; // a MASSIVE book
        expect(cs.asNumber).toEqual(100110); // 100000 + 110
    });
});
